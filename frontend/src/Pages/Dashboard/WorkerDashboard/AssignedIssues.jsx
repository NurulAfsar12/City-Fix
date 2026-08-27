import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { FaSpinner, FaCheck, FaPlay, FaCommentDots } from "react-icons/fa";

const AssignedIssues = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [noteModal, setNoteModal] = useState(null);
  const [note, setNote] = useState("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["my-assignments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/assignments");
      return res.data;
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await axiosSecure.patch(`/assignments/${id}/status`, {
        status,
      });
      return res.data;
    },
    onSuccess: (data) => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["worker-dashboard"] });
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: data.message || "Status updated!",
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

  const updateMutation = useMutation({
    mutationFn: async ({ reportId, message }) => {
      const res = await axiosSecure.post(`/reports/${reportId}/updates`, {
        update_text: message,
      });
      return res.data;
    },
    onSuccess: () => {
      setNoteModal(null);
      setNote("");
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Progress note added!",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.response?.data?.message || "Something went wrong!",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const assignments = data?.assignments || [];

  const advance = (assignment) => {
    const next =
      assignment.status === "assigned" ? "in_progress" : "completed";
    statusMutation.mutate({ id: assignment.id, status: next });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-extrabold">Assigned Issues</h2>

      {assignments.length === 0 ? (
        <div className="bg-base-100 rounded-2xl p-12 text-center border border-base-200">
          <p className="text-base-content/50 italic">
            No assignments yet. Check back later!
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-2xl shadow-md border border-base-200">
          <table className="table">
            <thead>
              <tr>
                <th>Report</th>
                <th>Priority</th>
                <th>Report Status</th>
                <th>Assignment Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
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
                  <td className="capitalize">
                    {assignment.report?.priority}
                  </td>
                  <td>
                    <span
                      className={`badge badge-sm text-white uppercase ${
                        assignment.report?.status === "resolved"
                          ? "badge-success"
                          : assignment.report?.status === "in_progress"
                          ? "badge-info"
                          : "badge-neutral"
                      }`}
                    >
                      {(assignment.report?.status || "").replace("_", " ")}
                    </span>
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
                    <div className="flex gap-1">
                      {assignment.status !== "completed" && (
                        <button
                          onClick={() => advance(assignment)}
                          disabled={statusMutation.isPending}
                          className="btn btn-primary btn-xs text-white gap-1"
                        >
                          {assignment.status === "assigned" ? (
                            <>
                              <FaPlay /> Start
                            </>
                          ) : (
                            <>
                              <FaCheck /> Complete
                            </>
                          )}
                        </button>
                      )}
                      <button
                        onClick={() =>
                          setNoteModal(assignment.report?.id)
                        }
                        className="btn btn-ghost btn-xs gap-1"
                      >
                        <FaCommentDots /> Note
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Progress Note Modal */}
      {noteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Add Progress Note</h3>
            <textarea
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Describe the progress on this issue..."
              className="textarea textarea-bordered w-full"
            />
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setNoteModal(null);
                  setNote("");
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary text-white"
                disabled={!note.trim() || updateMutation.isPending}
                onClick={() =>
                  updateMutation.mutate({
                    reportId: noteModal,
                    message: note.trim(),
                  })
                }
              >
                {updateMutation.isPending ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  "Save Note"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedIssues;
