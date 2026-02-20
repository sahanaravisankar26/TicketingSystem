package support

import (
	"capella-auth/constants"
	"capella-auth/cors"
	"capella-auth/response"
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

func UpdatedByAdmin(collection *gocb.Collection, cluster *gocb.Cluster, broker *Broker) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cors.EnableCORS(&w)
		if r.Method == constants.MethodOptions {
			return
		}
		if r.Method != constants.MethodPost {
			response.RespondWithError(w, constants.ErrMethodNotAllowed, constants.StatusMethodNotAllowed)
			return
		}

		var update UpdateAdmin
		err := json.NewDecoder(r.Body).Decode(&update)
		if err != nil {
			response.RespondWithError(w, constants.ErrInvalidRequestBody, constants.StatusBadRequest)
			return
		}

		query := "UPDATE `tickets`._default._default AS tickets SET message = $1, state = $2 WHERE id = $3 RETURNING tickets.*;"
		res, err := cluster.Query(query, &gocb.QueryOptions{
			PositionalParameters: []interface{}{update.Message, update.State, update.Id},
			Adhoc:                true,
		})

		var tickets Issue
		if err == nil && res.Next() {
			res.Row(&tickets)
			broker.Broadcast("UPDATE", tickets)
			broker.NotifyUser(tickets.Email, "UPDATE", tickets)
		}

		if err != nil {
			response.RespondWithError(w, constants.ErrFailedToUpdate, constants.StatusInternalServerError)
			return
		}
	}
}
