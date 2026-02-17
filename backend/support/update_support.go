package support

import (
	"capella-auth/cors"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/couchbase/gocb/v2"
)

type Update struct {
	Id          string `json:"id"`
	Description string `json:"description"`
}

func UpdateSupport(collection *gocb.Collection, cluster *gocb.Cluster, broker *Broker) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cors.EnableCORS(&w)
		if r.Method == http.MethodOptions {
			return
		}

		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var update Update
		err := json.NewDecoder(r.Body).Decode(&update)
		if err != nil {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}
		_, err = collection.MutateIn(update.Id, []gocb.MutateInSpec{
			gocb.ReplaceSpec("description", update.Description, nil),
		}, &gocb.MutateInOptions{})

		if err != nil {
			http.Error(w, fmt.Sprintf("Update failed: %v", err), http.StatusInternalServerError)
			return
		}

		var ticket Issue
		getRes, err := collection.Get(update.Id, nil)
		if err != nil {
		}

		if err := getRes.Content(&ticket); err != nil {
		}

		broker.Broadcast("UPDATE", ticket)
	}
}
