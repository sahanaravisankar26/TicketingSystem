package support

import (
	"capella-auth/constants"
	"capella-auth/cors"
	"capella-auth/response"
	"encoding/json"
	"net/http"

	"github.com/couchbase/gocb/v2"
)

func DeleteSupport(collection *gocb.Collection, broker *Broker) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cors.EnableCORS(&w)
		if r.Method == constants.MethodOptions {
			return
		}

		if r.Method != constants.MethodPost {
			response.RespondWithError(w, constants.ErrMethodNotAllowed, constants.StatusMethodNotAllowed)
			return
		}

		var id constants.DocId
		err := json.NewDecoder(r.Body).Decode(&id)
		if err != nil {
			response.RespondWithError(w, constants.ErrInvalidRequestBody, constants.StatusBadRequest)
			return
		}

		_, err = collection.Remove(id.DocId, nil)
		if err != nil {
			response.RespondWithError(w, constants.ErrFailedToDelete, constants.StatusBadRequest)
			return
		}

		broker.Broadcast(constants.DELETE, constants.Issue{Id: id.DocId})
	}
}
