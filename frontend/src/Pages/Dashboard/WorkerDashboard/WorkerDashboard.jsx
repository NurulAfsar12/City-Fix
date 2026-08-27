import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { FaHome, FaTasks, FaUser, FaBars, FaSignOutAlt } from "react-icons/fa";
import useAuth from "../../../Hooks/useAuth";

const WorkerDashboard = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut();
    navigate("/login");
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="worker-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col p-4">
        {/* Page content here */}
        <label
          htmlFor="worker-drawer"
          className="btn btn-primary text-white drawer-button lg:hidden mb-4 w-fit"
        >
          <FaBars /> Open Menu
        </label>
        <Outlet />
      </div>
      <div className="drawer-side z-40">
        <label htmlFor="worker-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content flex flex-col">
          {/* Sidebar content here */}
          <div className="mb-6 flex flex-col items-center">
            <div className="avatar placeholder mb-2">
              <div className="bg-primary text-primary-content rounded-full w-16">
                <span className="text-xl font-bold">
                  {(user?.name || "U").charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <h2 className="text-xl font-bold">Staff Dashboard</h2>
            <p className="text-sm opacity-70">Welcome, {user?.name}</p>
          </div>

          <li>
            <NavLink to="/dashboard/worker" end>
              <FaHome /> Overview
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/worker/assigned-issues">
              <FaTasks /> Assigned Issues
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/worker/profile">
              <FaUser /> Profile
            </NavLink>
          </li>

          <div className="divider"></div>
          <li>
            <NavLink to="/">
              <FaHome /> Home
            </NavLink>
          </li>
          <li>
            <button onClick={handleLogout} className="text-error">
              <FaSignOutAlt /> Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default WorkerDashboard;
