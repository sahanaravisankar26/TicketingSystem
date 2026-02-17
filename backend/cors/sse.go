package cors

import "net/http"

func SetSSEHeader(w *http.ResponseWriter) {
	(*w).Header().Set("Content-Type", "text/event-stream")
    (*w).Header().Set("Cache-Control", "no-cache")
    (*w).Header().Set("Connection", "keep-alive")
	// Standard HTTP responses typically require a Content-Length header so the browser knows when the download is finished. 
	// Since an SSE stream stays open indefinitely for new updates, the "total size" is unknown. 
	// Chunked encoding tells the browser to keep the connection open and process each part as it arrives.
	(*w).Header().Set("Transfer-Encoding", "chunked")
}