package support

import (
	"capella-auth/constants"
	"capella-auth/cors"
	"capella-auth/response"
	"encoding/json"
	"net/http"

	"github.com/couchbase/gocb/v2"
)

func UpdateSupport(collection *gocb.Collection, cluster *gocb.Cluster, broker *Broker) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cors.EnableCORS(&w)
		if r.Method == constants.MethodOptions {
			return
		}

		if r.Method != constants.MethodPost {
			response.RespondWithError(w, constants.ErrMethodNotAllowed, constants.StatusMethodNotAllowed)
			return
		}

		var update constants.Update
		err := json.NewDecoder(r.Body).Decode(&update)
		if err != nil {
			response.RespondWithError(w, constants.ErrInvalidRequestBody, constants.StatusBadRequest)
			return
		}
		_, err = collection.MutateIn(update.Id, []gocb.MutateInSpec{
			gocb.ReplaceSpec("description", update.Description, nil),
		}, &gocb.MutateInOptions{})

		if err != nil {
			response.RespondWithError(w, constants.ErrFailedToUpdate, constants.StatusInternalServerError)
			return
		}

		var ticket constants.Issue
		getRes, err := collection.Get(update.Id, nil)
		if err != nil {
			response.RespondWithError(w, constants.ErrFailedToFetch, constants.StatusNotFound)
			return
		}

		if err := getRes.Content(&ticket); err != nil {
			response.RespondWithError(w, constants.ErrFailedToFetch, constants.StatusInternalServerError)
			return
		}

		broker.Broadcast(constants.UPDATE, ticket)
	}
}
