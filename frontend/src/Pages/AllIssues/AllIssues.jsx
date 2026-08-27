import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import IssueCard from "../../Components/IssueCard";
import { FaSearch } from "react-icons/fa";

const PRIORITY_ORDER = { urgent: 4, high: 3, medium: 2, normal: 2, low: 1 };

const AllIssues = () => {
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");
  const [page, setPage] = useState(1);
  const limit = 6;

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on search change
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch all reports (citizens see their own, admin/worker see all)
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["issues"],
    queryFn: async () => {
      const res = await axiosSecure.get("/reports");
      return res.data;
    },
  });

  const allReports = data?.reports || [];

  const categories = useMemo(() => {
    const names = new Set(allReports.map((r) => r.category?.name).filter(Boolean));
    return [...names];
  }, [allReports]);

  const issues = useMemo(() => {
    let list = [...allReports];

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(
        (r) =>
          r.title?.toLowerCase().includes(q) ||
          r.location?.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q)
      );
    }
    if (filterStatus) list = list.filter((r) => r.status === filterStatus);
    if (filterCategory)
      list = list.filter((r) => r.category?.name === filterCategory);
    if (filterPriority)
      list = list.filter(
        (r) =>
          r.priority === filterPriority ||
          (filterPriority === "high" && r.priority === "urgent")
      );

    if (sortBy === "date_desc")
      list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    if (sortBy === "date_asc")
      list.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    if (sortBy === "priority_desc")
      list.sort(
        (a, b) => (PRIORITY_ORDER[b.priority] || 0) - (PRIORITY_ORDER[a.priority] || 0)
      );

    return list;
  }, [allReports, debouncedSearch, filterStatus, filterCategory, filterPriority, sortBy]);

  const totalCount = issues.length;
  const totalPages = Math.ceil(totalCount / limit);
  const pagedIssues = issues.slice((page - 1) * limit, page * limit);

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1); // Reset to page 1 on filter change
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-primary uppercase tracking-wide">
        All Reported Issues
      </h1>

      {/* Search and Filters */}
      <div className="bg-base-200 p-6 rounded-xl shadow-md mb-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search */}
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search by title, location..."
              className="input input-bordered w-full pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 w-full md:w-2/3 justify-end">
            <select
              className="select select-bordered w-full md:w-auto"
              onChange={handleFilterChange(setFilterCategory)}
              value={filterCategory}
            >
              <option value="">All Categories</option>
              {categories.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

            <select
              className="select select-bordered w-full md:w-auto"
              onChange={handleFilterChange(setFilterStatus)}
              value={filterStatus}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_review">In Review</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              className="select select-bordered w-full md:w-auto"
              onChange={handleFilterChange(setFilterPriority)}
              value={filterPriority}
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>

            <select
              className="select select-bordered w-full md:w-auto"
              onChange={handleFilterChange(setSortBy)}
              value={sortBy}
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="priority_desc">Priority (High to Low)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="card bg-base-100 shadow-xl p-4">
              <div className="h-48 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
              <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-8 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : pagedIssues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pagedIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} refetch={refetch} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h3 className="text-2xl font-bold text-gray-400">
            No issues found matching your criteria.
          </h3>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <div className="join">
            <button
              className="join-item btn"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              «
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                className={`join-item btn ${
                  page === idx + 1 ? "btn-active" : ""
                }`}
                onClick={() => setPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
            <button
              className="join-item btn"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllIssues;
