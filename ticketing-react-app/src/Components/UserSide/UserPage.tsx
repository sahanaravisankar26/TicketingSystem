import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import SupportIssue from "./SupportIssue";
import History from "./History";
import { toast } from "react-toastify";
import { DEFAULT_TOAST_OPTIONS } from "../../Contants/toastConstant";

const UserPage = ({
  userData,
  onLogout,
}: {
  userData: { email: string };
  onLogout: () => void;
}) => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    let runOnce = false;

    fetch("http://localhost:8080/protected", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (runOnce) {
          toast.success(data.message, DEFAULT_TOAST_OPTIONS);
        }
      })
      .catch((err) => {
        console.error(err);
      });

    return () => {
      runOnce = true;
    };
  }, []);

  return (
    <div className="pb-4 bg-white">
      <Navbar onLogout={onLogout} />
      <h6 className="text-2xl font-bold text-center mt-4">
        Welcome {userData.email}!
      </h6>
      <Routes>
        <Route index element={<SupportIssue email={userData.email} />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="issue" element={<SupportIssue email={userData.email} />} />
        <Route path="history" element={<History email={userData.email} />} />
        <Route path="*" element={<Navigate to="issue" replace />} />
      </Routes>
    </div>
  );
};

export default UserPage;
