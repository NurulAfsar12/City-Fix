import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { FaUsers, FaClipboardCheck, FaCheckDouble, FaArrowUp } from "react-icons/fa";
import CountUp from "react-countup";
import { motion } from "framer-motion";

const StatCard = ({ icon, count, label, gradient, delay, trend }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="relative h-full p-8 rounded-2xl bg-base-100 border border-base-300 hover:border-transparent transition-all duration-500 hover:shadow-2xl text-center overflow-hidden">
        {/* Hover Gradient Overlay */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${gradient} rounded-2xl`} />

        {/* Top Accent Bar */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-gradient-to-r ${gradient} group-hover:w-full transition-all duration-500`} />

        <div className="relative z-10 pt-2">
          {/* Icon with Glow */}
          <div className="relative inline-flex mb-6">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
              {icon}
            </div>
            <div className={`absolute -inset-3 rounded-2xl bg-gradient-to-br ${gradient} opacity-10 blur-xl group-hover:opacity-30 transition-opacity duration-500`} />
          </div>

          {/* Count */}
          <h3 className="text-5xl font-black mb-1 group-hover:text-white transition-colors duration-500 flex items-center justify-center gap-0.5">
            <CountUp end={count} duration={2.5} separator="," />
            <span className="text-3xl font-bold opacity-60 group-hover:opacity-100 transition-opacity">+</span>
          </h3>

          {/* Label */}
          <p className="text-base font-medium text-base-content/60 group-hover:text-white/80 transition-colors duration-500 mt-2 mb-4">
            {label}
          </p>

          {/* Growth Trend */}
          <div className="inline-flex items-center gap-1 text-xs font-semibold text-success group-hover:text-white/70 transition-colors bg-success/10 group-hover:bg-white/10 px-3 py-1 rounded-full">
            <FaArrowUp size={10} />
            {trend} this month
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StatsSection = () => {
  const axiosPublic = useAxiosPublic();

  const { data: stats = {} } = useQuery({
    queryKey: ["public-stats"],
    queryFn: async () => {
      const res = await axiosPublic.get("/public/stats");
      return res.data;
    },
  });

  const statItems = [
    {
      icon: <FaUsers />,
      count: stats.total_users || 0,
      label: "Active Citizens",
      gradient: "from-primary to-primary-dark",
      trend: "+12%",
    },
    {
      icon: <FaClipboardCheck />,
      count: stats.total_reports || 0,
      label: "Issues Reported",
      gradient: "from-secondary to-secondary-dark",
      trend: "+8%",
    },
    {
      icon: <FaCheckDouble />,
      count: stats.resolved_reports || 0,
      label: "Issues Resolved",
      gradient: "from-success to-success-dark",
      trend: "+15%",
    },
  ];

  return (
    <section className="relative py-28 overflow-hidden">
      {/* Layered Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-base-200 via-base-100 to-base-200" />

      {/* Decorative Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-accent/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-success/5 rounded-full blur-3xl" />

        {/* Dot Grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-5 py-1.5 rounded-full bg-primary/15 text-primary text-sm font-semibold tracking-wide mb-5">
            Our Impact
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-base-content mb-4 leading-tight">
            Making a Difference{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent">
              Together
            </span>
          </h2>
          <p className="text-base-content/50 max-w-xl mx-auto text-lg">
            See how CityFIX is transforming communities through active citizen participation.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {statItems.map((item, index) => (
            <StatCard
              key={index}
              icon={item.icon}
              count={item.count}
              label={item.label}
              gradient={item.gradient}
              trend={item.trend}
              delay={index * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
