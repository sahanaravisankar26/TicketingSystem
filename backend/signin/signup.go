package signin

import (
	"capella-auth/constants"
	"capella-auth/cors"
	"capella-auth/response"
	"encoding/json"
	"net/http"

	"github.com/couchbase/gocb/v2"
)

func SignupHandler(collection *gocb.Collection) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cors.EnableCORS(&w)

		if r.Method == constants.MethodOptions {
			return
		}

		if r.Method != constants.MethodPost {
			response.RespondWithError(w, constants.ErrMethodNotAllowed, constants.StatusMethodNotAllowed)
			return
		}

		var user constants.User
		if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
			response.RespondWithError(w, constants.ErrInvalidRequestBody, constants.StatusBadRequest)
			return
		}

		// Check if user already exists
		_, err := collection.Get(user.Email, nil)
		if err == nil {
			response.RespondWithError(w, constants.ErrUserExists, constants.StatusConflict)
			return
		}

		// Save user
		_, err = collection.Insert(user.Email, user, nil)
		if err != nil {
			response.RespondWithError(w, constants.ErrFailedToCreateUser, constants.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(map[string]string{
			"message": "Signup successful",
		})
	}
}
