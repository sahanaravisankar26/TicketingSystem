package constants

import "sync"

type User struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type DocId struct {
	DocId string `json:"id"`
}

type Issue struct {
	Id          string `json:"id"`
	Email       string `json:"email"`
	Issue       string `json:"issue"`
	Description string `json:"description"`
	Message     string `json:"message"`
	State       string `json:"state"`
}

type Update struct {
	Id          string `json:"id"`
	Description string `json:"description"`
}

type UpdateAdmin struct {
	Id      string `json:"id"`
	Message string `json:"message"`
	State   string `json:"state"`
}

type TicketEvent struct {
	Action string `json:"action"` // "CREATE", "UPDATE", "DELETE"
	Ticket Issue  `json:"ticket"`
}

type Broker struct {
	Admins map[chan TicketEvent]bool
	Users  map[string]map[chan TicketEvent]bool
	Mu     sync.Mutex
}
