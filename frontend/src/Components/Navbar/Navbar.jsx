import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import Logo from "../Logo/Logo";
import { FaSun, FaMoon } from "react-icons/fa";
import { AuthContext } from "../../Authentication/Context/AuthContext";
import useRole from "../../Hooks/useRole";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [role] = useRole();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const localTheme = localStorage.getItem("theme");
    document.querySelector("html").setAttribute("data-theme", localTheme);
  }, [theme]);

  const handleToggle = (e) => {
    if (e.target.checked) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  const dashboardPath =
    role === "admin"
      ? "/dashboard/admin"
      : role === "worker"
      ? "/dashboard/worker"
      : "/dashboard/citizen";

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "All Issues", path: "/all-issues" },
    { name: "Top Issues", path: "/top-issues" },
    { name: "City Map", path: "/city-map" },
  ];

  const handleLogout = async () => {
    await logOut();
    navigate("/login");
  };

  return (
    <div className="navbar bg-base-100 shadow-md rounded-2xl px-4 md:px-8">
      {/* Navbar Start */}
      <div className="navbar-start">
        {/* Mobile Menu */}
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>

          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            {menuItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    isActive ? "text-primary font-semibold" : ""
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}

            {/* User Section */}
            {user ? (
              <li className="mt-2 border-t pt-2">
                <div className="flex items-center gap-2 mb-2 px-2">
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-10 border-2 border-primary">
                      <span className="text-xl font-bold">
                        {(user.name || "U").charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">{user.name}</span>
                    <span className="text-sm text-gray-500">{user.email}</span>
                  </div>
                </div>
                <NavLink
                  to={dashboardPath}
                  className="btn btn-sm w-fit mb-2"
                  onClick={() => setDropdownOpen(false)}
                >
                  Dashboard
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="btn btn-sm btn-outline w-fit"
                >
                  Logout
                </button>
              </li>
            ) : (
              <li className="mt-2 border-t pt-2">
                <NavLink to="/login" className="btn btn-sm w-full mb-2">
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="btn btn-sm btn-outline w-full"
                >
                  Register
                </NavLink>
              </li>
            )}
            {/* Theme Toggle Mobile */}
            <li className="flex justify-center mt-2">
              <label className="swap swap-rotate">
                <input
                  type="checkbox"
                  onChange={handleToggle}
                  checked={theme === "light" ? false : true}
                />
                <FaSun className="swap-on fill-current w-6 h-6 text-yellow-500" />
                <FaMoon className="swap-off fill-current w-6 h-6 text-gray-500" />
              </label>
            </li>
          </ul>
        </div>

        {/* Logo */}
        <NavLink
          to="/"
          className="btn btn-ghost normal-case text-xl font-bold flex items-center gap-2"
        >
          <Logo />
        </NavLink>
      </div>

      {/* Navbar Center (Desktop Menu) */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 font-semibold text-base-content/80">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? "text-primary border-b-2 border-primary" : ""
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Navbar End (Desktop) */}
      <div className="navbar-end hidden lg:flex gap-2 items-center">
        {!user ? (
          <>
            <NavLink to="/login" className="btn btn-sm">
              Login
            </NavLink>
            <NavLink to="/register" className="btn btn-sm btn-outline">
              Register
            </NavLink>
          </>
        ) : (
          <div className="relative">
            <div
              className="avatar placeholder cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="bg-neutral text-neutral-content rounded-full w-10 border-2 border-primary">
                <span className="text-xl font-bold">
                  {(user.name || "U").charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-base-100 shadow-lg rounded-lg border border-base-200 z-50">
                <div className="px-4 py-2 border-b border-base-200">
                  <p className="font-semibold text-base-content capitalize">
                    {user.name}
                  </p>
                  <p className="text-sm text-base-content/60">{user.email}</p>
                </div>
                <ul className="flex flex-col">
                  <li>
                    <NavLink
                      to={dashboardPath}
                      className="block px-4 py-2 hover:bg-base-200 text-base-content"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-base-200 text-base-content"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Theme Toggle Desktop */}
      <div className="hidden lg:flex ml-4">
        <label className="swap swap-rotate">
          <input
            type="checkbox"
            onChange={handleToggle}
            checked={theme === "light" ? false : true}
          />
          <FaSun className="swap-on fill-current w-6 h-6 text-yellow-500" />
          <FaMoon className="swap-off fill-current w-6 h-6 text-gray-500" />
        </label>
      </div>
    </div>
  );
};

export default Navbar;
