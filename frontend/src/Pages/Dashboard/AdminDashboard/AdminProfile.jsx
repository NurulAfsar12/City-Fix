import React, { useContext } from "react";
import { AuthContext } from "../../../Authentication/Context/AuthContext";
import UserProfile from "../CitizenDashboard/UserProfile";

const AdminProfile = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-extrabold">My Profile</h2>
      <UserProfile />
    </div>
  );
};

export default AdminProfile;
