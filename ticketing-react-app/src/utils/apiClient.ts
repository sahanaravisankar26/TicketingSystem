export const apiClient = async ({
  endpoint,
  method,
  body,
  headers,
}: {
  endpoint: string;
  method: string;
  body?: string;
  headers?: Record<string, string>;
}) => {
  try {
    const response = await fetch(`${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? body : null,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
