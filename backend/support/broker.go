package support

import (
	"capella-auth/cors"
	"encoding/json"
	"fmt"
	"net/http"
	"sync"

	"github.com/couchbase/gocb/v2"
)

type TicketEvent struct {
	Action string `json:"action"` // "CREATE", "UPDATE", "DELETE"
	Ticket Issue  `json:"ticket"`
}

type Broker struct {
	Admins map[chan TicketEvent]bool
	mu     sync.Mutex
}

func NewBroker() *Broker {
	return &Broker{
		Admins: make(map[chan TicketEvent]bool),
	}
}

// Broadcast sends the update to all connected admins
func (b *Broker) Broadcast(action string, ticket Issue) {
	b.mu.Lock()
	defer b.mu.Unlock()
	event := TicketEvent{Action: action, Ticket: ticket}
	for ch := range b.Admins {
		ch <- event
	}
}

func (b *Broker) ServeAdminSSE(cluster *gocb.Cluster) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        cors.EnableCORS(&w)
        cors.SetSSEHeader(&w)

        // Fetch existing tickets
        query := "SELECT id, email, issue, description, message, state FROM `tickets`._default._default ORDER BY id DESC;"
        res, err := cluster.Query(query, nil)
        if err == nil {
            for res.Next() {
                var t Issue
                if err := res.Row(&t); err == nil {
                    ticketMarshal, _ := json.Marshal(TicketEvent{Action: "CREATE", Ticket: t})
                    fmt.Fprintf(w, "data: %s\n\n", ticketMarshal)
                }
            }
            w.(http.Flusher).Flush()
        }

        // Enter the Live Broker Loop
        clientChan := make(chan TicketEvent)
        b.mu.Lock()
        b.Admins[clientChan] = true
        b.mu.Unlock()

        defer func() {
            b.mu.Lock()
            delete(b.Admins, clientChan)
            b.mu.Unlock()
        }()

        for {
            select {
            case event := <-clientChan:
                msg, _ := json.Marshal(event)
                fmt.Fprintf(w, "data: %s\n\n", msg)
                w.(http.Flusher).Flush()
            case <-r.Context().Done():
                return
            }
        }
    }
}
