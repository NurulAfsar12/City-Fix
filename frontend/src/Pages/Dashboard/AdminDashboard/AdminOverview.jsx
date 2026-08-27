import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import StatsCard from "../../../Components/Dashboard/StatsCard";
import {
  FaClipboardList,
  FaClock,
  FaTools,
  FaCheckDouble,
  FaExclamationTriangle,
} from "react-icons/fa";

const AdminOverview = () => {
  const axiosSecure = useAxiosSecure();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
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
  const recentReports = data?.recent_reports || [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-neutral to-primary-dark rounded-2xl shadow-lg p-8 text-white">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-2">
          Admin Dashboard
        </h2>
        <p className="opacity-90">
          Oversee all reported issues and manage your field staff.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          icon={<FaClipboardList />}
          title="Total Reports"
          value={stats.total_reports ?? 0}
          color="primary"
        />
        <StatsCard
          icon={<FaClock />}
          title="Pending"
          value={stats.pending_reports ?? 0}
          color="warning"
        />
        <StatsCard
          icon={<FaTools />}
          title="In Progress"
          value={stats.in_progress_reports ?? 0}
          color="info"
        />
        <StatsCard
          icon={<FaCheckDouble />}
          title="Resolved"
          value={stats.resolved_reports ?? 0}
          color="success"
        />
        <StatsCard
          icon={<FaExclamationTriangle />}
          title="Urgent"
          value={stats.urgent_reports ?? 0}
          color="error"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StatsCard
          icon={<span className="font-bold">C</span>}
          title="Total Citizens"
          value={stats.total_citizens ?? 0}
          color="secondary"
        />
        <StatsCard
          icon={<span className="font-bold">W</span>}
          title="Total Workers"
          value={stats.total_workers ?? 0}
          color="success"
        />
        <StatsCard
          icon={<span className="font-bold">K</span>}
          title="Active Categories"
          value={stats.total_categories ?? 0}
          color="info"
        />
      </div>

      {/* Recent Reports */}
      <div className="bg-base-100 rounded-2xl shadow-md border border-base-200 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-base-200">
          <h3 className="text-lg font-bold">Recent Reports</h3>
          <Link to="/dashboard/admin/all-issues" className="btn btn-xs btn-primary text-white">
            View All
          </Link>
        </div>

        {recentReports.length === 0 ? (
          <p className="p-6 text-center text-base-content/50 italic">
            No reports yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Issue</th>
                  <th>Reporter</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((report) => (
                  <tr key={report.id}>
                    <td>
                      <div>
                        <div className="font-bold line-clamp-1">{report.title}</div>
                        <div className="text-sm opacity-50 line-clamp-1">{report.location}</div>
                      </div>
                    </td>
                    <td>{report.user?.name}</td>
                    <td>
                      <span
                        className={`badge badge-sm text-white uppercase ${
                          report.status === "resolved"
                            ? "badge-success"
                            : report.status === "pending"
                            ? "badge-warning"
                            : report.status === "rejected"
                            ? "badge-error"
                            : "badge-info"
                        }`}
                      >
                        {report.status.replace("_", " ")}
                      </span>
                    </td>
                    <td>{new Date(report.created_at).toLocaleDateString()}</td>
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

export default AdminOverview;
