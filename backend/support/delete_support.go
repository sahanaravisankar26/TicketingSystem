package support

import (
	"capella-auth/cors"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/couchbase/gocb/v2"
)

type DocId struct {
	DocId string `json:"id"`
}

func DeleteSupport(collection *gocb.Collection, broker *Broker) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cors.EnableCORS(&w)
		if r.Method == http.MethodOptions {
			return
		}

		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}
		
		var id DocId
		err := json.NewDecoder(r.Body).Decode(&id)
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to fetch due to %v", err), http.StatusBadRequest)
			return
		}

		_, err = collection.Remove(id.DocId, nil)
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to delete due to %v", err), http.StatusBadRequest)
			return
		}

		broker.Broadcast("DELETE", Issue{Id: id.DocId}) 
	}
}
