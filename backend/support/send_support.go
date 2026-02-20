package support

import (
	"capella-auth/constants"
	"capella-auth/cors"
	"capella-auth/response"
	"encoding/json"
	"net/http"

	"github.com/couchbase/gocb/v2"
)

func SendSupport(collection *gocb.Collection, broker *Broker) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cors.EnableCORS(&w)
		w.Header().Set(constants.ContentType, constants.ApplicationJSON)

		if r.Method == constants.MethodOptions {
			return
		}

		if r.Method != constants.MethodPost {
			response.RespondWithError(w, constants.ErrMethodNotAllowed, constants.StatusMethodNotAllowed)
			return
		}

		var issue constants.Issue
		err := json.NewDecoder(r.Body).Decode(&issue)
		if err != nil {
			response.RespondWithError(w, constants.ErrInvalidRequestBody, constants.StatusBadRequest)
			return
		}

		// Validate required fields
		if issue.Id == "" || issue.Email == "" || issue.Issue == "" || issue.Description == "" || issue.State == "" {
			response.RespondWithError(w, constants.ErrFormFields, constants.StatusBadRequest)
			return
		}

		_, err = collection.Insert(issue.Id, issue, nil)
		if err != nil {
			response.RespondWithError(w, constants.ErrFailedToSubmit, constants.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Your issue has been successfully submitted. Stay tuned for updates!",
		})
		broker.Broadcast(constants.CREATE, issue)
	}
}
