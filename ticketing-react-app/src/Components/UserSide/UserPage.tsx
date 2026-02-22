import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import SupportIssue from "./SupportIssue";
import History from "./History";
import { AppRoutes } from "../../Contants/routes";
import { sessionValidationCheck } from "../../Services/authService";

const UserPage = ({
  userData,
  onLogout,
}: {
  userData: { email: string };
  onLogout: () => void;
}) => {
  useEffect(() => {
    sessionValidationCheck(onLogout);
  }, [onLogout]);

  return (
    <div className="pb-4 bg-white">
      <Navbar onLogout={onLogout} />
      <h6 className="text-2xl font-bold text-center mt-4">
        Welcome {userData.email}!
      </h6>
      <Routes>
        <Route index element={<SupportIssue email={userData.email} />} />
        <Route path={AppRoutes.Dashboard} element={<Dashboard />} />
        <Route
          path={AppRoutes.Issue}
          element={<SupportIssue email={userData.email} />}
        />
        <Route
          path={AppRoutes.History}
          element={<History email={userData.email} />}
        />
        <Route
          path={AppRoutes.All}
          element={<Navigate to={AppRoutes.Issue} replace />}
        />
      </Routes>
    </div>
  );
};

export default UserPage;
