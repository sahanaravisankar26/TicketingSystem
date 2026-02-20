package cors

import (
	"capella-auth/constants"
	"net/http"
)

func EnableCORS(w *http.ResponseWriter) {
	(*w).Header().Set(constants.AccessControlAllowOrigin, constants.All)
	(*w).Header().Set(constants.AccessControlAllowHeaders, constants.ContentType + constants.AND + constants.Authorization)
	(*w).Header().Set(constants.AccessControlAllowMethods, constants.GetPostOption)
}
