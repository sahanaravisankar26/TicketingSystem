import { toast } from "react-toastify";
import { DEFAULT_TOAST_OPTIONS } from "../Contants/toastConstant";
import { Methods } from "../Contants/constants";

export const apiFetch = async <T>({
  endpoint,
  body,
  headers,
}: {
  endpoint: string;
  body?: string;
  headers?: Record<string, string>;
}): Promise<{ response: Response; data: T | null } | null> => {
  try {
    const response = await fetch(endpoint, {
      method: Methods.POST,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body || null,
    });

    // 1. Handle Error States (4xx, 5xx)
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Error: ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch { /* Failed to parse error response */ }

      toast.error(errorMessage, DEFAULT_TOAST_OPTIONS);
      return null;
    }

    // 2. Handle No Content (204)
    if (response.status === 204) {
      return { response, data: null };
    }

    // 3. Resilient JSON Parsing
    try {
      const data: T = await response.json();
      return { response, data };
    } catch (e) {
      // If parsing fails but status was 2xx, return null data but keep response
      console.warn("Successful status but body was not JSON", e);
      return { response, data: null };
    }
  } catch {
    // Network errors (DNS, Offline, CORS)
    toast.error("Network connection issue", DEFAULT_TOAST_OPTIONS);
    return null;
  }
};
