package signin

import (
	"capella-auth/cors"
	"capella-auth/middleware"
	"encoding/json"
	"net/http"

	"github.com/couchbase/gocb/v2"
)

type User struct {
	Email string `json:"email"`
	Password string `json:"password"`
}

func SignupHandler(collection *gocb.Collection) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cors.EnableCORS(&w)

		if r.Method == http.MethodOptions {
			return
		}

		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var user User
		if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		// Check if user already exists
		_, err := collection.Get(user.Email, nil)
		if err == nil {
			http.Error(w, "User already exists", http.StatusConflict)
			return
		}

		// Save user
		_, err = collection.Insert(user.Email, user, nil)
		if err != nil {
			http.Error(w, "Failed to create user", http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(map[string]string{
			"message": "Signup successful",
		})
	}
}

func LoginHandler(collection *gocb.Collection) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cors.EnableCORS(&w)

		if r.Method == http.MethodOptions {
			return
		}

		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var credentials User
		if err := json.NewDecoder(r.Body).Decode(&credentials); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		result, err := collection.Get(credentials.Email, nil)
		if err != nil {
			http.Error(w, "User not found", http.StatusUnauthorized)
			return
		}

		var storedUser User
		result.Content(&storedUser)

		if storedUser.Password != credentials.Password {
			http.Error(w, "Invalid password", http.StatusUnauthorized)
			return
		}

		token, err := middleware.GenerateJWT(storedUser.Email)
		if err != nil {
			http.Error(w, "Failed to generate token", http.StatusInternalServerError)
			return
		}

		response := map[string]interface{}{
			"message": "Login successful",
			"user": map[string]string{
				"email": storedUser.Email,
			},
			"token": token,
		}

		json.NewEncoder(w).Encode(response)
	}
}
