import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../Contants/routes";

export const useNavigationService = () => {
  const navigate = useNavigate();

  const goToPath = (path: typeof AppRoutes[keyof typeof AppRoutes]) => {
    navigate(path);
  };

  return goToPath;
};
