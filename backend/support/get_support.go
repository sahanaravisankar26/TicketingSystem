package support

import (
	"capella-auth/constants"
	"capella-auth/cors"
	"capella-auth/response"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/couchbase/gocb/v2"
)

func FetchSupport(ticket_collection *gocb.Collection, cluster *gocb.Cluster, broker *Broker) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cors.EnableCORS(&w)
		cors.SetSSEHeader(&w)

		if r.Method == constants.MethodOptions {
			return
		}

		if r.Method != constants.MethodGet {
			response.RespondWithError(w, constants.ErrMethodNotAllowed, constants.StatusMethodNotAllowed)
			return
		}

		// var requestBody struct {
		//     Email string `json:"email"`
		// }
		// if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
		//     http.Error(w, constants.ErrInvalidRequestBody, constants.StatusBadRequest)
		//     return
		// }

		// SSE started
		email := r.URL.Query().Get("email")
		if email == "" {
			response.RespondWithError(w, constants.ErrMailNeeded, constants.StatusBadRequest)
			return
		}

		// flusher, ok := w.(http.Flusher)
		// if !ok {
		// 	http.Error(w, "Streaming unsupported", constants.StatusInternalServerError)
		// 	return
		// }

		query := "SELECT id, email, issue, description, message, state FROM `tickets`._default._default WHERE email = $1 ORDER BY id DESC;"
		res, err := cluster.Query(query, &gocb.QueryOptions{
			PositionalParameters: []interface{}{email},
			Adhoc:                true, // not use cached - for dynamically
		})

		if err != nil {
			response.RespondWithError(w, constants.ErrFailedToFetch, constants.StatusInternalServerError)
			return
		}

		flusher, ok := w.(http.Flusher)
		if !ok {
			response.RespondWithError(w, constants.ErrStreamUnsupported, constants.StatusInternalServerError)
			return
		}

		for res.Next() {
			var t constants.Issue
			if err := res.Row(&t); err != nil {
				response.RespondWithError(w, constants.ErrFailedToFetch, constants.StatusInternalServerError)
				return
			}
			ticketMarshal, _ := json.Marshal(constants.TicketEvent{Action: constants.CREATE, Ticket: t}) // sending existing data as create
			fmt.Fprintf(w, "data: %s\n\n", ticketMarshal)
			flusher.Flush()
		}

		clientChannel := make(chan constants.TicketEvent)
		broker.Mu.Lock()
		if broker.Users[email] == nil { // fail safe (most probably won't need it)
			broker.Users[email] = make(map[chan constants.TicketEvent]bool) // don't overwrite other open tabs for this user
		}
		broker.Users[email][clientChannel] = true
		broker.Mu.Unlock()

		defer func() {
			broker.Mu.Lock()
			delete(broker.Users[email], clientChannel)
			broker.Mu.Unlock()
		}()

		for {
			select {
			case event := <-clientChannel:
				msg, _ := json.Marshal(event)
				fmt.Fprintf(w, "data: %s\n\n", msg)
				flusher.Flush()
			case <-r.Context().Done():
				return
			}
		}

		// var tickets []Issue
		// for res.Next() {
		// 	var ticket Issue
		// 	if err := res.Row(&ticket); err != nil {
		// 		http.Error(w, "Row mapping failed", constants.StatusInternalServerError)
		// 		return
		// 	}
		// 	ticketMarshal, _ := json.Marshal(ticket) // make it to json because my eventsource needs in such format
		// 	fmt.Fprintf(w, "data: %s\n\n", ticketMarshal)
		// 	flusher.Flush() // Flush after each ticket
		// tickets = append(tickets, ticket)
		// }

		// w.Header().Set("Content-Type", "application/json")
		// json.NewEncoder(w).Encode(tickets)
	}
}

/*
type TicketResponse struct {
    Tickets []Issue `json:"tickets"`
}

Encode the wrapper instead of the raw slice
json.NewEncoder(w).Encode(TicketResponse{
    Tickets: tickets,
})
*/
