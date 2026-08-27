import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { FaHome, FaUsers, FaUserShield, FaClipboardList, FaBars, FaSignOutAlt, FaUser } from "react-icons/fa";
import useAuth from "../../../Hooks/useAuth";

const AdminDashboard = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut();
    navigate("/login");
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col p-4">
        {/* Page content here */}
        <label
          htmlFor="my-drawer-2"
          className="btn btn-primary text-white drawer-button lg:hidden mb-4 w-fit"
        >
          <FaBars /> Open Menu
        </label>
        <Outlet />
      </div>
      <div className="drawer-side z-40">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content flex flex-col">
          {/* Sidebar content here */}
          <div className="mb-6 flex flex-col items-center">
            <div className="avatar placeholder mb-2">
              <div className="bg-neutral text-neutral-content rounded-full w-16">
                <span className="text-xl font-bold">
                  {(user?.name || "A").charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <h2 className="text-xl font-bold">Admin Dashboard</h2>
            <p className="text-sm opacity-70">Welcome, {user?.name}</p>
          </div>

          <li>
            <NavLink to="/dashboard/admin" end>
              <FaHome /> Overview
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/admin/manage-staff">
              <FaUserShield /> Manage Staff
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/admin/all-issues">
              <FaClipboardList /> All Issues
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/admin/profile">
              <FaUser /> My Profile
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

export default AdminDashboard;
