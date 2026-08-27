import React from "react";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router";
import { APP_URL } from "../Utils/constants";

const statusBadge = (status) => {
  switch (status) {
    case "resolved":
      return "badge-success";
    case "pending":
      return "badge-warning";
    case "rejected":
      return "badge-error";
    case "in_progress":
      return "badge-info";
    default:
      return "badge-neutral";
  }
};

const IssueCard = ({ issue, refetch }) => {
  const {
    id,
    title,
    description,
    category,
    status,
    priority,
    location,
    image,
    created_at: createdAt,
  } = issue;

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
      <figure className="relative h-48 overflow-hidden">
        <img
          src={image ? `${APP_URL}${image}` : "https://via.placeholder.com/400x300?text=No+Image"}
          alt={title}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <div
            className={`badge ${statusBadge(status)} badge-sm uppercase font-semibold text-white`}
          >
            {status.replace("_", " ")}
          </div>
          {(priority === "high" || priority === "urgent") && (
            <div className="badge badge-error badge-sm uppercase font-semibold text-white">
              {priority} Priority
            </div>
          )}
        </div>
      </figure>
      <div className="card-body p-4">
        <div className="flex justify-between items-start">
          <p className="text-sm text-base-content/60 font-semibold uppercase tracking-wider">
            {category?.name}
          </p>
          <p className="text-xs text-base-content/40 flex items-center gap-1">
            <FaCalendarAlt /> {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>

        <h2
          className="card-title text-xl font-bold text-base-content line-clamp-1"
          title={title}
        >
          {title}
        </h2>
        <p className="text-base-content/70 text-sm line-clamp-2">{description}</p>

        <div className="flex items-center gap-1 text-base-content/60 text-sm mt-2">
          <FaMapMarkerAlt className="text-primary" />
          <span className="truncate">{location}</span>
        </div>

        <div className="card-actions justify-end items-center mt-4 border-t pt-4">
          <Link to={`/issue-details/${id}`} className="btn btn-sm btn-neutral">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;
