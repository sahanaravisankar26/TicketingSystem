import { toast } from "react-toastify";
import { APIEndpoints } from "../Contants/routes";

export const sessionValidationCheck = async (onLogout: () => void) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch(APIEndpoints.GetUserPageEndpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      onLogout();
      toast.error("Session expired. Please login again.");
      return;
    }
  } catch {
    onLogout();
    toast.error("Failed to validate session. Please login again.");
  }
};
