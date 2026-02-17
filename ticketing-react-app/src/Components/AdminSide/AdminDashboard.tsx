import React from "react";;
import AdminNavbar from "./AdminNavbar";
import AdminPage from "./AdminPage";

const AdminDashboard = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="pt-20 pb-4">
          <AdminPage />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
