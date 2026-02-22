import AdminDashboard from "./Components/AdminSide/AdminDashboard";
import "./App.css";
import AdminLogin from "./Components/LoginSignup/AdminLogin";
import LoginSignup from "./Components/LoginSignup/LoginSignup";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppRoutes } from "./Contants/routes";

function App() {
  return (
    <>
      <div className="grid h-screen bg-red-50">
        <Routes>
          <Route path={AppRoutes.AllPossible} element={<LoginSignup />} />
          <Route path={AppRoutes.SignInAll} element={<LoginSignup />} />
          <Route path={AppRoutes.AdminLoginAll} element={<AdminLogin />} />
          <Route path={AppRoutes.AdminDashboard} element={<AdminDashboard />} />
        </Routes>
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
