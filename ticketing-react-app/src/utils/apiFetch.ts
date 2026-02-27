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
}): Promise<{ response: Response; data: T } | null> => { 
  try {
    const response = await fetch(endpoint, {
      method: Methods.POST,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body || null,
    });

    // If you expect JSON, you cast it to T
    const data: T = await response.json();

    if (!response.ok) {
      toast.error("Something went wrong", DEFAULT_TOAST_OPTIONS);
      return null; 
    }

    return { response, data };
  } catch (error) {
    toast.error(`Error: ${error}`, DEFAULT_TOAST_OPTIONS);
    return null;
  }
};