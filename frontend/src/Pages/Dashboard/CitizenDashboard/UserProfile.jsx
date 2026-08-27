import React, { useContext } from "react";
import { AuthContext } from "../../../Authentication/Context/AuthContext";
import { FaUser, FaEnvelope, FaPhone, FaShieldAlt, FaCalendarAlt } from "react-icons/fa";

const roleBadge = {
  admin: "badge-error",
  worker: "badge-info",
  citizen: "badge-success",
};

const UserProfile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-base-100 rounded-2xl shadow-md border border-base-200 p-8">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="avatar placeholder mb-4">
            <div className="bg-primary text-primary-content rounded-full w-24">
              <span className="text-4xl font-bold">
                {(user?.name || "U").charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <h2 className="text-2xl font-extrabold">{user?.name}</h2>
          <span
            className={`badge ${roleBadge[user?.role] || "badge-neutral"} badge-sm uppercase font-semibold text-white mt-2`}
          >
            {user?.role}
          </span>
        </div>

        <ul className="space-y-4">
          <li className="flex items-center gap-3 bg-base-200 rounded-xl px-4 py-3">
            <FaEnvelope className="text-primary" />
            <div>
              <p className="text-xs text-base-content/50">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
          </li>
          <li className="flex items-center gap-3 bg-base-200 rounded-xl px-4 py-3">
            <FaPhone className="text-primary" />
            <div>
              <p className="text-xs text-base-content/50">Phone</p>
              <p className="font-medium">{user?.phone || "Not provided"}</p>
            </div>
          </li>
          <li className="flex items-center gap-3 bg-base-200 rounded-xl px-4 py-3">
            <FaShieldAlt className="text-primary" />
            <div>
              <p className="text-xs text-base-content/50">Account Type</p>
              <p className="font-medium capitalize">{user?.role} Account</p>
            </div>
          </li>
          {user?.created_at && (
            <li className="flex items-center gap-3 bg-base-200 rounded-xl px-4 py-3">
              <FaCalendarAlt className="text-primary" />
              <div>
                <p className="text-xs text-base-content/50">Member Since</p>
                <p className="font-medium">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default UserProfile;
