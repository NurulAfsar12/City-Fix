import React from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import Timeline from "../../Components/Timeline";
import Swal from "sweetalert2";
import { APP_URL } from "../../Utils/constants";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUser,
  FaEnvelope,
  FaTrash,
  FaUserTie,
} from "react-icons/fa";

const IssueDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    data: issue,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["issue", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/reports/${id}`);
      return res.data.report;
    },
  });

  const { data: updatesData } = useQuery({
    queryKey: ["issue-updates", id],
    enabled: !!issue,
    queryFn: async () => {
      const res = await axiosSecure.get(`/reports/${id}/updates`);
      return res.data;
    },
  });  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/reports/${id}`);
          Swal.fire("Deleted!", "The issue has been deleted.", "success");
          navigate("/dashboard/citizen");
          refetch();
        } catch (error) {
          Swal.fire("Error!", "Something went wrong.", "error");
        }
      }
    });
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  if (!issue)
    return (
      <div className="text-center py-20 text-xl text-gray-500">
        Issue not found.
      </div>
    );

  const {
    title,
    description,
    category,
    status,
    priority,
    location,
    image,
    created_at: createdAt,
    user: reporter,
    assignment,
  } = issue;

  const isOwner = user?.email === reporter?.email;
  const isAdmin = user?.role === "admin";

  const timeline = (updatesData?.updates || []).map((u) => ({
    status: u.status ?? issue.status,
    message: u.update_text,
    date: u.created_at,
    updatedBy: u.user?.name || "CityFIX Staff",
  }));

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <div className="flex flex-wrap gap-2 mb-2">
            <span
              className={`badge ${
                status === "resolved"
                  ? "badge-success"
                  : status === "pending"
                  ? "badge-warning"
                  : status === "rejected"
                  ? "badge-error"
                  : "badge-neutral"
              } uppercase font-bold text-white`}
            >
              {status.replace("_", " ")}
            </span>
            <span
              className={`badge ${
                priority === "high" || priority === "urgent"
                  ? "badge-error"
                  : "badge-info"
              } uppercase font-bold text-white`}
            >
              {priority} Priority
            </span>
            <span className="badge badge-ghost uppercase font-semibold">
              {category?.name}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-base-content">
            {title}
          </h1>
          <div className="flex items-center gap-4 mt-2 text-base-content/60">
            <p className="flex items-center gap-1">
              <FaMapMarkerAlt className="text-primary" /> {location}
            </p>
            <p className="flex items-center gap-1">
              <FaCalendarAlt /> {new Date(createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {(isAdmin || isOwner) && (
          <div className="flex gap-2">
            <button
              className="btn btn-outline btn-error gap-2"
              onClick={handleDelete}
            >
              <FaTrash /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image & Description */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-2xl overflow-hidden shadow-xl border border-base-200">
            <img
              src={
                image
                  ? `${APP_URL}${image}`
                  : "https://via.placeholder.com/800x500?text=No+Image"
              }
              alt={title}
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="bg-base-100 p-6 rounded-xl shadow-lg border border-base-200">
            <h2 className="text-2xl font-bold mb-4 text-base-content border-b pb-2">
              Description
            </h2>
            <p className="text-base-content/70 leading-relaxed text-lg">
              {description}
            </p>
          </div>

          {/* Timeline Component */}
          <Timeline timeline={timeline} />
        </div>

        {/* Right Column: Staff & User Info */}
        <div className="space-y-6">
          {/* Reporter Info */}
          <div className="bg-base-100 p-6 rounded-xl shadow-md border border-base-200">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-base-content/80">
              <FaUser className="text-primary" /> Reported By
            </h3>
            <div className="flex items-center gap-3">
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-12">
                  <span className="text-xl font-bold">
                    {(reporter?.name || "U").charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div>
                <p className="font-semibold">{reporter?.name}</p>
                <p className="text-xs text-base-content/60">Citizen</p>
              </div>
            </div>
          </div>

          {/* Assigned Worker Info */}
          <div className="bg-base-100 p-6 rounded-xl shadow-md border border-base-200">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-base-content/80">
              <FaUserTie className="text-secondary" /> Assigned Staff
            </h3>
            {assignment?.worker ? (
              <div className="flex items-center gap-3">
                <div className="avatar placeholder">
                  <div className="bg-secondary text-secondary-content rounded-full w-12">
                    <span className="text-xl font-bold">
                      {assignment.worker.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold">{assignment.worker.name}</p>
                  <p className="text-sm text-base-content/60">Staff Member</p>
                  <p className="text-xs text-base-content/40 mt-1 flex items-center gap-1">
                    <FaEnvelope /> {assignment.worker.email}
                  </p>
                </div>
              </div>
            ) : (
              <div className="alert alert-warning text-sm">
                <span>No staff assigned yet.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetails;
