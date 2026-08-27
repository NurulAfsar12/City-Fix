import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const ManageStaff = () => {
  const axiosSecure = useAxiosSecure();

  const { data, isLoading } = useQuery({
    queryKey: ["workers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/workers");
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

  const workers = data?.workers || [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-extrabold">Manage Staff</h2>

      {workers.length === 0 ? (
        <div className="bg-base-100 rounded-2xl p-12 text-center border border-base-200">
          <p className="text-base-content/50 italic">No staff members yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-2xl shadow-md border border-base-200">
          <table className="table">
            <thead>
              <tr>
                <th>Staff Member</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((worker) => (
                <tr key={worker.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-secondary text-secondary-content rounded-full w-10">
                          <span className="font-bold">
                            {(worker.name || "W").charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="font-bold">{worker.name}</div>
                    </div>
                  </td>
                  <td>{worker.email}</td>
                  <td>{worker.phone || "—"}</td>
                  <td>
                    <span className="badge badge-info badge-sm uppercase font-semibold text-white">
                      Worker
                    </span>
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

export default ManageStaff;
