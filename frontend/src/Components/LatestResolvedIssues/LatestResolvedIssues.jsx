import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { FaMapMarkerAlt, FaCheckCircle, FaArrowRight, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { APP_URL } from "../../Utils/constants";

const LatestResolvedIssues = () => {
  const axiosPublic = useAxiosPublic();

  const { data: issuesData = {} } = useQuery({
    queryKey: ["latest-resolved"],
    queryFn: async () => {
      const res = await axiosPublic.get("/public/reports?status=resolved&limit=6");
      return res.data;
    },
  });

  const issues = issuesData.reports || [];

  return (
    <section className="relative py-24 bg-base-100 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-success/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-success/20 text-success text-sm font-semibold mb-4">
            Recently Completed
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-base-content mb-4">
            Latest <span className="text-success">Resolved</span> Issues
          </h2>
          <p className="text-lg text-base-content/60 max-w-2xl mx-auto">
            See how we are making our city better, one fix at a time.
          </p>
        </motion.div>

        {issues.length === 0 ? (
          <div className="text-center py-20">
            <FaCheckCircle className="text-6xl text-base-content/20 mx-auto mb-4" />
            <p className="text-base-content/40 italic text-lg">
              No resolved issues yet. Be the first to witness change!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {issues.map((issue, index) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-base-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={
                      issue.image
                        ? `${APP_URL}${issue.image}`
                        : "https://via.placeholder.com/400x300?text=No+Image"
                    }
                    alt={issue.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-4 right-4 bg-success text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide flex items-center gap-1.5 shadow-lg">
                    <FaCheckCircle /> Resolved
                  </div>
                  <div className="absolute top-4 left-4 bg-base-100/90 backdrop-blur-sm text-base-content text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <FaClock className="text-success" />
                    {issue.resolved_at
                      ? new Date(issue.resolved_at).toLocaleDateString()
                      : "Recently"}
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-lg font-bold text-base-content mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {issue.title}
                  </h3>

                  <div className="flex items-center text-base-content/50 text-sm mb-4">
                    <FaMapMarkerAlt className="mr-1.5 text-success shrink-0" />
                    <span className="line-clamp-1">{issue.location}</span>
                  </div>

                  <p className="text-base-content/60 text-sm mb-6 line-clamp-2 flex-grow">
                    {issue.description}
                  </p>

                  <Link
                    to={`/issue-details/${issue.id}`}
                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-base-100 text-base-content font-semibold rounded-xl hover:bg-primary hover:text-base-100 transition-all border border-base-300 hover:border-primary group/link"
                  >
                    View Details
                    <FaArrowRight className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {issues.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/all-issues"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              View All Resolved Issues <FaArrowRight />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default LatestResolvedIssues;
