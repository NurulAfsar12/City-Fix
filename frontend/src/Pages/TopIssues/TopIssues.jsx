import React from "react";
import { useQuery } from "@tanstack/react-query";
import IssueCard from "../../Components/IssueCard";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const TopIssues = () => {
  const axiosSecure = useAxiosSecure();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["topIssues"],
    queryFn: async () => {
      const res = await axiosSecure.get("/reports");
      return (res.data.reports || []).filter(
        (r) => r.priority === "high" || r.priority === "urgent"
      );
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-primary uppercase">
          Top Issues
        </h2>
        <p className="text-base-content/70 mt-2">
          High priority issues that need immediate attention
        </p>
        <div className="w-24 h-1 bg-primary mx-auto mt-4 rounded"></div>
      </div>

      {data && data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((issue) => (
            <IssueCard key={issue.id} issue={issue} refetch={refetch} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-base-200 rounded-lg">
          <h3 className="text-2xl font-bold text-base-content/60">
            No Top Issues Found
          </h3>
          <p className="text-base-content/50 mt-2">
            Check back later for high priority updates.
          </p>
        </div>
      )}
    </div>
  );
};

export default TopIssues;
