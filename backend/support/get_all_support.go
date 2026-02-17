package support

import (
	"capella-auth/cors"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/couchbase/gocb/v2"
)

func FetchAllSupport(ticket_collection *gocb.Collection, cluster *gocb.Cluster) http.HandlerFunc {
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

		flusher, ok := w.(http.Flusher)
		if !ok {
			http.Error(w, "Streaming unsupported", http.StatusInternalServerError)
			return
		}

		query := "SELECT id, email, issue, description, message, state FROM `tickets`._default._default ORDER BY id DESC;"
        res, err := cluster.Query(query, &gocb.QueryOptions{
            Adhoc: true,
        })

		if err != nil {
			http.Error(w, "Query failed: "+err.Error(), http.StatusInternalServerError)
			return
		}

		// var tickets []Issue
		for res.Next() {
			var ticket Issue
			if err := res.Row(&ticket); err != nil {
				http.Error(w, "Row mapping failed", http.StatusInternalServerError)
				return
			}
			ticketMarshal, _ := json.Marshal(ticket)
			fmt.Fprintf(w, "data: %s\n\n", ticketMarshal)
			flusher.Flush();
			// tickets = append(tickets, ticket)
		}

		// w.Header().Set("Content-Type", "application/json")
		// json.NewEncoder(w).Encode(tickets)
	}
}
