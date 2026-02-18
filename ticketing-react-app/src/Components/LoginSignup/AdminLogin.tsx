import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Bounce } from "react-toastify";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (
      username === import.meta.env.VITE_ADMIN &&
      password === import.meta.env.VITE_PASSWORD
    ) {
      // Redirect to Admin Dashboard
      navigate("/admin-dashboard");
    } else {
      toast.error("Invalid Admin Credentials", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const gotoUser = () => {
    navigate("/sign-in");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-100">
      <div className="mx-auto mt-10 w-full max-w-112.5 bg-white p-8 rounded-2xl shadow-xl flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Login</h2>
        </div>

        {/* Form Section */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 border-b-2 border-gray-200 outline-hidden focus:border-red-500 transition-colors"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border-b-2 border-gray-200 outline-hidden focus:border-red-500 transition-colors"
          />

          <button
            type="submit"
            className="mt-4 w-full p-4 bg-linear-to-r from-red-600 to-orange-500 text-white rounded-full text-lg font-bold shadow-md hover:shadow-lg hover:opacity-95 transition-all active:scale-[0.98]"
          >
            Login
          </button>
          <p className="text-center text-sm text-gray-500 mt-2">
            If you're the user,{" "}
            <span
              onClick={gotoUser}
              className="text-orange-600 font-semibold hover:underline cursor-pointer"
            >
              click here!
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
