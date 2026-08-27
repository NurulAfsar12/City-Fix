import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { FaChartPie, FaList, FaPlusCircle, FaUser, FaSignOutAlt, FaBars } from "react-icons/fa";
import useAuth from "../../../Hooks/useAuth";

const CitizenDashboard = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogOut = () => {
    logOut();
    navigate("/login");
  };

  const navLinks = [
    { path: "", icon: <FaChartPie />, label: "Overview", end: true },
    { path: "my-issues", icon: <FaList />, label: "My Issues" },
    { path: "report-issue", icon: <FaPlusCircle />, label: "Report Issue" },
    { path: "profile", icon: <FaUser />, label: "Profile" },
  ];

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-base-200">
      <input
        id="dashboard-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={isSidebarOpen}
        onChange={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="drawer-content flex flex-col">
        {/* Mobile Navbar */}
        <div className="w-full navbar bg-base-100 lg:hidden shadow-sm">
          <div className="flex-none">
            <label htmlFor="dashboard-drawer" className="btn btn-square btn-ghost">
              <FaBars className="text-xl" />
            </label>
          </div>
          <div className="flex-1 px-2 mx-2 text-xl font-bold text-primary">
            Citizen Dashboard
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </div>

      <div className="drawer-side z-50">
        <label
          htmlFor="dashboard-drawer"
          className="drawer-overlay"
          onClick={() => setIsSidebarOpen(false)}
        ></label>
        <ul className="menu p-4 w-72 h-full bg-base-100 text-base-content border-r border-base-200">
          <div className="mb-8 px-4 py-2">
            <h2 className="text-2xl font-extrabold text-primary tracking-tighter">CityFIX</h2>
            <p className="text-xs text-base-content/50 uppercase tracking-widest mt-1">
              Citizen Panel
            </p>
          </div>

          {navLinks.map((link) => (
            <li key={link.path} className="mb-2">
              <NavLink
                to={link.path}
                end={link.end}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-primary text-primary-content shadow-md"
                      : "hover:bg-base-200 text-base-content/70"
                  }`
                }
              >
                {link.icon}
                <span className="font-medium">{link.label}</span>
              </NavLink>
            </li>
          ))}

          <div className="divider my-4"></div>

          <li>
            <button
              onClick={handleLogOut}
              className="flex items-center gap-3 px-4 py-3 text-error hover:bg-error hover:text-white rounded-xl transition-all"
            >
              <FaSignOutAlt />
              <span className="font-medium">Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CitizenDashboard;
