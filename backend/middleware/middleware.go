package middleware

import (
	"capella-auth/constants"
	"capella-auth/cors"
	"capella-auth/response"
	"encoding/json"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte("key")

func GenerateJWT(email string) (string, error) {
	claims := jwt.MapClaims{ // This part will just map email to token with expiry
		"email": email,
		"exp":   time.Now().Add(24 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims) // unsealed part, signed with hs 256 algo
	return token.SignedString(jwtSecret) // This will seal it with secret key and send it so even if on wrong email, it won't work
}

func JwtMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cors.EnableCORS(&w)

		if r.Method == constants.MethodOptions {
			return
		}
		authHeader := r.Header.Get(constants.Authorization)
		if authHeader == "" {
			response.RespondWithError(w, constants.ErrMissingToken, constants.StatusUnauthorized)
			return
		}

		tokenStr := authHeader[len("Bearer "):]

		token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			response.RespondWithError(w, constants.ErrInvalidToken, constants.StatusUnauthorized)
			return
		}

		next(w, r)
	}
}

func ProtectedHandler(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Welcome!",
	})
}
