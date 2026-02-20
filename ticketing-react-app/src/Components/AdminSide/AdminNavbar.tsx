import React from "react";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { Routes } from "../../Contants/routes";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate(Routes.SignIn);
  };

  return (
    <>
      <nav className="fixed bg-gray-300 w-full z-20 top-0 start-0 border-b border-default">
        <div className="flex flex-wrap items-center justify-between mx-auto p-4">
          <a
            href="#"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img src={logo} className="h-7" alt="Flowbite Logo" />
          </a>
          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary"
            aria-controls="navbar-default"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="2"
                d="M5 7h14M5 12h14M5 17h14"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="text-white bg-red-600 hover:bg-red-700 shadow-xs font-medium text-sm px-4 py-2.5 rounded-xl cursor-pointer"
          >
            Logout
          </button>
        </div>
      </nav>
    </>
  );
};

export default AdminNavbar;
