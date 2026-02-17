import React, { useState } from "react";
import UserPage from "../UserSide/UserPage";
import { useNavigate } from "react-router-dom";

const LoginSignup = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const gotoAdmin = () => {
    navigate("/admin-login");
  }

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    return savedUser !== undefined && savedUser !== null ? JSON.parse(savedUser) : null;
    // return null; // To debug
  });

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");
    setUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLoginMode
      ? "http://localhost:8080/login"
      : "http://localhost:8080/signup";

    try {
      const result = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await result.json();

      if (!result.ok) {
        alert(data.error || "Something went wrong");
        return;
      }

      localStorage.setItem("loggedInUser", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      setUser(data.user);

      // alert(data.message);
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log("Error is ", error);
      alert("Error occured. " + error);
    }
  };

  if (user) {
    return <UserPage userData={user} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-100">
      <div className="mx-auto mt-10 w-full max-w-112.5 bg-white p-8 rounded-2xl shadow-xl flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            {isLoginMode ? "Login" : "Sign up"}
          </h2>
        </div>

        <div className="relative flex h-12 border border-gray-200 rounded-full bg-gray-50 overflow-hidden">
          <button
            onClick={() => setIsLoginMode(true)}
            className={`flex-1 text-sm font-semibold transition-colors duration-300 z-10 ${isLoginMode ? "text-white" : "text-gray-500"}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLoginMode(false)}
            className={`flex-1 text-sm font-semibold transition-colors duration-300 z-10 ${!isLoginMode ? "text-white" : "text-gray-500"}`}
          >
            Sign up
          </button>

          {/* Animated Sliding Background */}
          <div
            className={`absolute top-0 h-full w-1/2 rounded-full bg-linear-to-r from-red-600 to-orange-500 transition-all duration-300 ${isLoginMode ? "left-0" : "left-1/2"}`}
          ></div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            {isLoginMode ? "Login" : "Create Account"}
          </button>

          <p className="text-center text-sm text-gray-500 mt-2">
            {isLoginMode
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="text-orange-600 font-semibold hover:underline"
            >
              {isLoginMode ? "Sign up" : "Login"}
            </button>
            <p>If you're the admin, <span onClick={gotoAdmin} className="text-orange-600 font-semibold hover:underline cursor-pointer">click here!</span></p>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginSignup;
