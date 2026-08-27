import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { APP_URL } from "../../../Utils/constants";
import { FaEye } from "react-icons/fa";

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

const MyIssues = () => {
  const axiosSecure = useAxiosSecure();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["my-issues"],
    queryFn: async () => {
      const res = await axiosSecure.get("/reports");
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

  const reports = data?.reports || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-extrabold">My Issues</h2>
        <Link to="/dashboard/citizen/report-issue" className="btn btn-primary text-white btn-sm">
          + Report New Issue
        </Link>
      </div>

      {reports.length === 0 ? (
        <div className="bg-base-100 rounded-2xl p-12 text-center border border-base-200">
          <p className="text-base-content/50 italic mb-4">
            You haven't reported any issues yet.
          </p>
          <Link to="/dashboard/citizen/report-issue" className="btn btn-primary text-white">
            Report Your First Issue
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-2xl shadow-md border border-base-200">
          <table className="table">
            <thead>
              <tr>
                <th>Issue</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
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
                  <td className="capitalize">{report.priority}</td>
                  <td>
                    <span
                      className={`badge badge-sm text-white uppercase ${statusBadge(report.status)}`}
                    >
                      {report.status.replace("_", " ")}
                    </span>
                  </td>
                  <td>{new Date(report.created_at).toLocaleDateString()}</td>
                  <td>
                    <Link
                      to={`/issue-details/${report.id}`}
                      className="btn btn-ghost btn-xs gap-1"
                    >
                      <FaEye /> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyIssues;
