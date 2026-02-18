package support

import (
	"capella-auth/cors"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/couchbase/gocb/v2"
)

func FetchSupport(ticket_collection *gocb.Collection, cluster *gocb.Cluster, broker *Broker) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cors.EnableCORS(&w)
		cors.SetSSEHeader(&w)

		if r.Method == http.MethodOptions {
			return
		}

		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		// var requestBody struct {
		//     Email string `json:"email"`
		// }
		// if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
		//     http.Error(w, "Invalid request", http.StatusBadRequest)
		//     return
		// }

		// SSE started
		email := r.URL.Query().Get("email")
		if email == "" {
			http.Error(w, "Email is needed", http.StatusBadRequest)
			return
		}

		// flusher, ok := w.(http.Flusher)
		// if !ok {
		// 	http.Error(w, "Streaming unsupported", http.StatusInternalServerError)
		// 	return
		// }

		query := "SELECT id, email, issue, description, message, state FROM `tickets`._default._default WHERE email = $1 ORDER BY id DESC;"
		res, err := cluster.Query(query, &gocb.QueryOptions{
			PositionalParameters: []interface{}{email},
			Adhoc:                true, // not use cached - for dynamically
		})

		if err != nil {
			http.Error(w, "Query failed: "+err.Error(), http.StatusInternalServerError)
			return
		}

		if err == nil {
            for res.Next() {
                var t Issue
                if err := res.Row(&t); err == nil {
                    ticketMarshal, _ := json.Marshal(TicketEvent{Action: "CREATE", Ticket: t}) // sending existing data as create
                    fmt.Fprintf(w, "data: %s\n\n", ticketMarshal)
                }
            }
            w.(http.Flusher).Flush()
        }

		clientChannel := make(chan TicketEvent)
		broker.mu.Lock()
		if broker.Users[email] == nil {
            broker.Users[email] = make(map[chan TicketEvent]bool) // don't overwrite other open tabs for this user
        }
		broker.Users[email][clientChannel] = true
		broker.mu.Unlock()

		defer func() {
            broker.mu.Lock()
            delete(broker.Users[email], clientChannel)
            broker.mu.Unlock()
        }()

		for {
            select {
            case event := <-clientChannel:
                msg, _ := json.Marshal(event)
                fmt.Fprintf(w, "data: %s\n\n", msg)
                w.(http.Flusher).Flush()
            case <-r.Context().Done():
                return
            }
        }

		// var tickets []Issue
		// for res.Next() {
		// 	var ticket Issue
		// 	if err := res.Row(&ticket); err != nil {
		// 		http.Error(w, "Row mapping failed", http.StatusInternalServerError)
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

// ... inside your handler ...

// 2. Encode the wrapper instead of the raw slice
json.NewEncoder(w).Encode(TicketResponse{
    Tickets: tickets,
})
*/
