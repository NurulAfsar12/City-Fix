import React from "react";

const iconColors = {
  primary: "bg-primary text-white",
  secondary: "bg-secondary text-white",
  success: "bg-success text-white",
  warning: "bg-warning text-white",
  info: "bg-info text-white",
  error: "bg-error text-white",
};

const StatsCard = ({ icon, title, value, color = "primary" }) => {
  return (
    <div className="bg-base-100 p-6 rounded-2xl shadow-md border border-base-200 flex items-center gap-4">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${iconColors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-base-content/60 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-extrabold text-base-content">{value}</h3>
      </div>
    </div>
  );
};

export default StatsCard;
