package support

import (
	"capella-auth/cors"
	"encoding/json"
	"net/http"

	"github.com/couchbase/gocb/v2"
)

// try to do through query now

type UpdateAdmin struct {
	Id      string `json:"id"`
	Message string `json:"message"`
	State   string `json:"state"`
}

func UpdatedByAdmin(collection *gocb.Collection, cluster *gocb.Cluster) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cors.EnableCORS(&w)
		if r.Method == http.MethodOptions {
			return
		}
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var update UpdateAdmin
		err := json.NewDecoder(r.Body).Decode(&update)
		if err != nil {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}

		query := "UPDATE `tickets`._default._default SET message = $1, state = $2 WHERE id = $3;"
		_, err = cluster.Query(query, &gocb.QueryOptions{
			PositionalParameters: []interface{}{update.Message, update.State, update.Id},
			Adhoc:                true,
		})

		if err != nil {
			http.Error(w, "Update failed: "+err.Error(), http.StatusInternalServerError)
			return
		}
	}
}
