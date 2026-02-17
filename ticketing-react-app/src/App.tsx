import AdminDashboard from "./Components/AdminSide/AdminDashboard";
import "./App.css";
import AdminLogin from "./Components/LoginSignup/AdminLogin";
import LoginSignup from "./Components/LoginSignup/LoginSignup";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <div className="grid h-screen bg-red-50">
        <Routes>
          <Route path="/*" element={<LoginSignup />} />
          <Route path="/sign-in/*" element={<LoginSignup />} />
          <Route path="/admin-login/*" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} /> 
        </Routes>
      </div>
    </>
  );
}

export default App;
