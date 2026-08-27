import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import StatsCard from "../../../Components/Dashboard/StatsCard";
import { APP_URL } from "../../../Utils/constants";
import {
  FaClipboardList,
  FaClock,
  FaTools,
  FaCheckDouble,
} from "react-icons/fa";

const CitizenStats = () => {
  const axiosSecure = useAxiosSecure();

  const { data, isLoading } = useQuery({
    queryKey: ["citizen-dashboard"],
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
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl shadow-lg p-8 text-white">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-2">
          Welcome back, citizen!
        </h2>
        <p className="opacity-90">
          Track your reported issues and help make your city better.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
      </div>

      {/* Recent Reports */}
      <div className="bg-base-100 rounded-2xl shadow-md border border-base-200 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-base-200">
          <h3 className="text-lg font-bold">Recent Reports</h3>
          <Link to="/dashboard/citizen/my-issues" className="btn btn-xs btn-primary text-white">
            View All
          </Link>
        </div>

        {recentReports.length === 0 ? (
          <p className="p-6 text-center text-base-content/50 italic">
            No reports yet — submit your first issue!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Issue</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((report) => (
                  <tr key={report.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-10 h-10">
                            <img
                              src={
                                report.image
                                  ? `${APP_URL}${report.image}`
                                  : "https://via.placeholder.com/40?text=—"
                              }
                              alt={report.title}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold line-clamp-1">{report.title}</div>
                          <div className="text-sm opacity-50 line-clamp-1">{report.location}</div>
                        </div>
                      </div>
                    </td>
                    <td>{report.category?.name}</td>
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

export default CitizenStats;
