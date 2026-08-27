import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import {
  FaUserPlus,
  FaTrash,
  FaSearch,
} from "react-icons/fa";

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

const AdminAllIssues = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [assignModal, setAssignModal] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState("");
  const [notes, setNotes] = useState("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-all-issues"],
    queryFn: async () => {
      const res = await axiosSecure.get("/reports");
      return res.data;
    },
  });

  const { data: workersData } = useQuery({
    queryKey: ["workers"],
    enabled: !!assignModal,
    queryFn: async () => {
      const res = await axiosSecure.get("/workers");
      return res.data;
    },
  });

  const workers = workersData?.workers || [];

  // Assign a report to a worker
  const assignMutation = useMutation({
    mutationFn: async ({ reportId }) => {
      const res = await axiosSecure.post("/assignments", {
        report_id: reportId,
        worker_id: Number(selectedWorker),
        notes: notes || null,
      });
      return res.data;
    },
    onSuccess: () => {
      setAssignModal(null);
      setSelectedWorker("");
      setNotes("");
      refetch();
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Report assigned successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Assignment Failed",
        text: error.response?.data?.message || "Something went wrong!",
      });
    },
  });

  // Change report status
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await axiosSecure.patch(`/reports/${id}/status`, { status });
      return res.data;
    },
    onSuccess: (res) => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: res.message || "Status updated!",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response?.data?.message || "Something went wrong!",
      });
    },
  });

  // Delete a report
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/reports/${id}`);
      return res.data;
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      Swal.fire("Deleted!", "The issue has been deleted.", "success");
    },
    onError: (error) => {
      Swal.fire(
        "Error!",
        error.response?.data?.message || "Something went wrong.",
        "error"
      );
    },
  });

  const handleDelete = (report) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${report.title}"!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(report.id);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const reports = data?.reports || [];

  const filteredReports = search
    ? reports.filter(
        (r) =>
          r.title?.toLowerCase().includes(search.toLowerCase()) ||
          r.location?.toLowerCase().includes(search.toLowerCase())
      )
    : reports;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-extrabold">All Issues</h2>
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search issues..."
            className="input input-bordered w-full pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <div className="bg-base-100 rounded-2xl p-12 text-center border border-base-200">
          <p className="text-base-content/50 italic">No issues found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-2xl shadow-md border border-base-200">
          <table className="table">
            <thead>
              <tr>
                <th>Issue</th>
                <th>Reporter</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id}>
                  <td>
                    <div>
                      <div className="font-bold line-clamp-1">{report.title}</div>
                      <div className="text-sm opacity-50 line-clamp-1">
                        {report.category?.name} — {report.location}
                      </div>
                    </div>
                  </td>
                  <td>{report.user?.name}</td>
                  <td className="capitalize">{report.priority}</td>
                  <td>
                    <select
                      className={`select select-xs w-full uppercase font-semibold text-white border-none ${statusBadge(report.status)}`}
                      value={report.status}
                      onChange={(e) =>
                        statusMutation.mutate({
                          id: report.id,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="in_review">In Review</option>
                      <option value="assigned">Assigned</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td>
                  {report.assignment?.worker ? (
                    <div>
                      <div className="font-semibold text-sm">
                        {report.assignment.worker.name}
                      </div>
                      <div className="text-xs opacity-50">
                        {report.assignment.status.replace("_", " ")}
                      </div>
                    </div>
                  ) : (
                    <span className="badge badge-ghost badge-sm">Not assigned</span>
                  )}
                </td>
                  <td>
                    <div className="flex gap-1">
                      {!["resolved", "rejected"].includes(report.status) && (
                        <button
                          onClick={() => setAssignModal(report)}
                          disabled={
                            report.status === "assigned" ||
                            report.status === "in_progress"
                          }
                          className="btn btn-primary btn-xs text-white gap-1"
                          title={
                            report.status === "assigned" ||
                            report.status === "in_progress"
                              ? "Already assigned"
                              : "Assign to worker"
                          }
                        >
                          <FaUserPlus />
                          {report.assignment?.worker
                            ? ` ${report.assignment.worker.name.split(" ")[0]}`
                            : " Assign"}
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(report)}
                        className="btn btn-error btn-xs text-white gap-1"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Assign Modal */}
      {assignModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-1">Assign to Worker</h3>
            <p className="text-sm text-base-content/60 mb-4 line-clamp-1">
              {assignModal.title}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-base-content/70 mb-1">
                  Select Staff Member
                </label>
                <select
                  className="select select-bordered w-full"
                  value={selectedWorker}
                  onChange={(e) => setSelectedWorker(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Choose a worker
                  </option>
                  {workers.map((worker) => (
                    <option key={worker.id} value={worker.id}>
                      {worker.name} ({worker.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-base-content/70 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any instructions for the worker..."
                  className="textarea textarea-bordered w-full"
                />
              </div>
            </div>

            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setAssignModal(null);
                  setSelectedWorker("");
                  setNotes("");
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary text-white"
                disabled={!selectedWorker || assignMutation.isPending}
                onClick={() =>
                  assignMutation.mutate({ reportId: assignModal.id })
                }
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAllIssues;
