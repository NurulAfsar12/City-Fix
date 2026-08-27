import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { FiArrowUpRight, FiPlay } from "react-icons/fi";
import heroImage from "../../assets/hero-city.png";

const HeroSection = () => {
  const floatingShapes = [
    { size: "w-20 h-20", color: "bg-primary/20", x: "10%", y: "15%", delay: 0 },
    { size: "w-14 h-14", color: "bg-secondary/20", x: "85%", y: "20%", delay: 0.3 },
    { size: "w-12 h-12", color: "bg-accent/20", x: "75%", y: "75%", delay: 0.6 },
    { size: "w-16 h-16", color: "bg-accent/20", x: "15%", y: "70%", delay: 0.9 },
    { size: "w-8 h-8", color: "bg-success/20", x: "50%", y: "10%", delay: 1.2 },
  ];

  return (
    <section className="relative bg-gradient-to-br from-base-200 via-base-100 to-base-200 overflow-hidden">
      {/* Floating Shapes */}
      {floatingShapes.map((shape, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${shape.color} ${shape.size} blur-xl`}
          style={{ left: shape.x, top: shape.y }}
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: shape.delay,
          }}
        />
      ))}

      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-20 md:py-28 flex flex-col-reverse md:flex-row items-center gap-12 relative z-10">
        {/* Text Content */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-semibold mb-6"
          >
            Public Infrastructure Issue Reporting
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-base-content leading-tight mb-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            CityFIX
          </motion.h1>

          <motion.p
            className="text-base-content/70 mb-8 text-lg md:text-xl max-w-xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            A digital platform enabling citizens to report real-world public
            issues like broken streetlights, potholes, water leakage, garbage
            overflow, damaged footpaths, and more.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Link
              to="/dashboard/citizen/report-issue"
              className="group inline-flex items-center gap-2 bg-primary text-base-100 font-semibold px-7 py-3.5 rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
            >
              Report Issue
              <span className="w-7 h-7 rounded-full bg-base-100 text-primary flex items-center justify-center group-hover:rotate-45 transition-transform">
                <FiArrowUpRight />
              </span>
            </Link>

            <Link
              to="/all-issues"
              className="group inline-flex items-center gap-2 border-2 border-base-content/20 text-base-content font-semibold px-7 py-3.5 rounded-full hover:bg-base-content/5 transition-all"
            >
              <FiPlay className="text-sm" />
              View All Issues
            </Link>
          </motion.div>
        </div>

        {/* Hero Image */}
        <motion.div
          className="flex-1 w-full"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-primary-dark/30 rounded-3xl blur-2xl" />
            <img
              src={heroImage}
              alt="City Infrastructure"
              className="rounded-2xl shadow-2xl w-full object-cover relative"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
