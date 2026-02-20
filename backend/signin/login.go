package signin

import (
	"capella-auth/constants"
	"capella-auth/cors"
	"capella-auth/middleware"
	"capella-auth/response"
	"encoding/json"
	"net/http"

	"github.com/couchbase/gocb/v2"
)


func LoginHandler(collection *gocb.Collection) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cors.EnableCORS(&w)

		if r.Method == constants.MethodOptions {
			return
		}

		if r.Method != constants.MethodPost {
			response.RespondWithError(w, constants.ErrMethodNotAllowed, constants.StatusMethodNotAllowed)
			return
		}

		var credentials constants.User
		if err := json.NewDecoder(r.Body).Decode(&credentials); err != nil {
			response.RespondWithError(w, constants.ErrInvalidRequestBody, constants.StatusBadRequest)
			return
		}

		result, err := collection.Get(credentials.Email, nil)
		if err != nil {
			response.RespondWithError(w, constants.ErrUserNotFound, constants.StatusNotFound)
			return
		}

		var storedUser constants.User
		result.Content(&storedUser)

		if storedUser.Password != credentials.Password {
			response.RespondWithError(w, constants.ErrInvalidPassword, constants.StatusUnauthorized)
			return
		}

		token, err := middleware.GenerateJWT(storedUser.Email)
		if err != nil {
			response.RespondWithError(w, constants.ErrFailedTokenGeneration, constants.StatusInternalServerError)
			return
		}

		response := map[string]interface{}{
			"user": map[string]string{
				"email": storedUser.Email,
			},
			"token": token,
		}

		json.NewEncoder(w).Encode(response)
	}
}
