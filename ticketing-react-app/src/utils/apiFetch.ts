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
      method: Methods.POST, // Or pass method as a param
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body || null,
    });

    // 1. Handle Error States
    if (!response.ok) {
      const errorText = await response.text(); // Use text() to avoid JSON crash
      let errorMessage = `Error: ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch { /* not JSON, use default status */ }

      toast.error(errorMessage, DEFAULT_TOAST_OPTIONS);
      return null;
    }

    // 2. Handle Success (Check if there is a body to parse)
    const contentType = response.headers.get("content-type");
    if (response.status === 204 || !contentType || !contentType.includes("application/json")) {
      return { response, data: null };
    }

    const data: T = await response.json();
    return { response, data };
  } catch {
    // Only toast if it's a network error, not a logic error
    toast.error("Fetch Issue", DEFAULT_TOAST_OPTIONS);
    return null;
  }
};