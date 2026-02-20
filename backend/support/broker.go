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

type Broker constants.Broker

func NewBroker() *Broker {
	return (*Broker)(&constants.Broker{
		Admins: make(map[chan constants.TicketEvent]bool),
		Users:  make(map[string]map[chan constants.TicketEvent]bool),
	})
}

// Broadcast sends the update to all connected admins
func (b *Broker) Broadcast(action string, ticket constants.Issue) {
	b.Mu.Lock()
	defer b.Mu.Unlock()
	event := constants.TicketEvent{Action: action, Ticket: ticket}
	for ch := range b.Admins {
		select {
		case ch <- event:
		default: // Skip if channel is full to prevent server hanging
		}
	}
}

func (b *Broker) ServeAdminSSE(cluster *gocb.Cluster) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cors.EnableCORS(&w)
		cors.SetSSEHeader(&w)

		// Fetch existing tickets
		query := "SELECT id, email, issue, description, message, state FROM `tickets`._default._default ORDER BY id DESC;"
		res, err := cluster.Query(query, nil)
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

			ticketMarshal, _ := json.Marshal(constants.TicketEvent{Action: constants.CREATE, Ticket: t})
			fmt.Fprintf(w, "data: %s\n\n", ticketMarshal)
		}
		flusher.Flush()

		// Enter the Live Broker Loop
		clientChan := make(chan constants.TicketEvent)
		b.Mu.Lock()
		b.Admins[clientChan] = true
		b.Mu.Unlock()

		defer func() {
			b.Mu.Lock()
			delete(b.Admins, clientChan)
			b.Mu.Unlock()
		}()

		for {
			select {
			case event := <-clientChan:
				msg, _ := json.Marshal(event)
				fmt.Fprintf(w, "data: %s\n\n", msg)
				flusher.Flush()
			case <-r.Context().Done():
				return
			}
		}
	}
}

func (b *Broker) NotifyUser(email string, action string, ticket constants.Issue) {
	b.Mu.Lock()
	defer b.Mu.Unlock()
	event := constants.TicketEvent{Action: action, Ticket: ticket}
	if chans, ok := b.Users[email]; ok {
		for ch := range chans {
			select {
			case ch <- event:
			default: // Skip if channel is full to prevent server hanging
			}
		}
	}
}
