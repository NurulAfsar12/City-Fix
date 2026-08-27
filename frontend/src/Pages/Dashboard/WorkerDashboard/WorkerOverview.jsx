import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import StatsCard from "../../../Components/Dashboard/StatsCard";
import {
  FaTasks,
  FaClipboardCheck,
  FaSpinner,
  FaCheckDouble,
} from "react-icons/fa";

const WorkerOverview = () => {
  const axiosSecure = useAxiosSecure();

  const { data, isLoading } = useQuery({
    queryKey: ["worker-dashboard"],
    queryFn: async () => {
      const res = await axiosSecure.get("/dashboard");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const stats = data?.statistics || {};
  const recentAssignments = data?.recent_assignments || [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-secondary to-secondary-dark rounded-2xl shadow-lg p-8 text-white">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-2">
          Staff Dashboard
        </h2>
        <p className="opacity-90">
          Here are your assigned tasks. Keep the city running!
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<FaTasks />}
          title="Total Assignments"
          value={stats.total_assignments ?? 0}
          color="primary"
        />
        <StatsCard
          icon={<FaClipboardCheck />}
          title="Newly Assigned"
          value={stats.assigned_assignments ?? 0}
          color="warning"
        />
        <StatsCard
          icon={<FaSpinner />}
          title="In Progress"
          value={stats.in_progress_assignments ?? 0}
          color="info"
        />
        <StatsCard
          icon={<FaCheckDouble />}
          title="Completed"
          value={stats.completed_assignments ?? 0}
          color="success"
        />
      </div>

      {/* Recent Assignments */}
      <div className="bg-base-100 rounded-2xl shadow-md border border-base-200 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-base-200">
          <h3 className="text-lg font-bold">Recent Assignments</h3>
          <Link to="/dashboard/worker/assigned-issues" className="btn btn-xs btn-primary text-white">
            View All
          </Link>
        </div>

        {recentAssignments.length === 0 ? (
          <p className="p-6 text-center text-base-content/50 italic">
            No assignments yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Report</th>
                  <th>Status</th>
                  <th>Assigned At</th>
                </tr>
              </thead>
              <tbody>
                {recentAssignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td>
                      <div>
                        <div className="font-bold line-clamp-1">
                          {assignment.report?.title}
                        </div>
                        <div className="text-sm opacity-50 line-clamp-1">
                          {assignment.report?.location}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge badge-sm text-white uppercase ${
                          assignment.status === "completed"
                            ? "badge-success"
                            : assignment.status === "in_progress"
                            ? "badge-info"
                            : "badge-warning"
                        }`}
                      >
                        {assignment.status.replace("_", " ")}
                      </span>
                    </td>
                    <td>
                      {new Date(assignment.assigned_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerOverview;
