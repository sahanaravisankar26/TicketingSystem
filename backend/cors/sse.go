package cors

import (
	"capella-auth/constants"
	"net/http"
)

func SetSSEHeader(w *http.ResponseWriter) {
	(*w).Header().Set(constants.ContentType, constants.EventStream)
    (*w).Header().Set(constants.CacheControl, constants.NoCache)
    (*w).Header().Set(constants.Connection, constants.KeepAlive)
	// Standard HTTP responses typically require a Content-Length header so the browser knows when the download is finished. 
	// Since an SSE stream stays open indefinitely for new updates, the "total size" is unknown. 
	// Chunked encoding tells the browser to keep the connection open and process each part as it arrives.
	(*w).Header().Set(constants.TransferEncoding, constants.Chunked)
}