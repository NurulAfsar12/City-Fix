import React from "react";
import { motion } from "framer-motion";
import { FaMedal, FaTrophy, FaAward, FaStar } from "react-icons/fa";

const awards = [
  {
    icon: <FaTrophy />,
    title: "Best Civic Innovation 2024",
    description:
      "Recognized for modernizing public issue reporting and improving city services.",
    color: "text-secondary",
    bg: "bg-secondary/10",
    border: "border-secondary/20",
    ribbon: "bg-secondary",
  },
  {
    icon: <FaMedal />,
    title: "Smart City Excellence Award",
    description:
      "Awarded for contributing significantly to smart-city transformation.",
    color: "text-info",
    bg: "bg-info/10",
    border: "border-info/20",
    ribbon: "bg-info",
  },
  {
    icon: <FaAward />,
    title: "GovTech Innovation Award",
    description:
      "Honored for efficient issue resolution workflows for government staff.",
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/20",
    ribbon: "bg-accent",
  },
  {
    icon: <FaStar />,
    title: "Top User Satisfaction Platform",
    description:
      "Rated 4.9/5 by thousands of citizens for transparency and reliability.",
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/20",
    ribbon: "bg-warning",
  },
];

const Awards = () => {
  return (
    <section className="py-24 bg-base-200">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-semibold mb-4">
            Recognition
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-base-content mb-4">
            Recognitions & Awards
          </h2>
          <p className="text-base-content/60 max-w-2xl mx-auto text-lg">
            Our platform has been recognized globally for innovation and impact.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {awards.map((award, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="relative group"
            >
              {/* Ribbon */}
              <div className={`absolute -top-2 -right-2 w-12 h-12 ${award.ribbon} rounded-bl-2xl rounded-tr-2xl flex items-center justify-center text-white text-lg shadow-lg z-10 group-hover:scale-110 transition-transform`}>
                {award.icon}
              </div>

              {/* Card */}
              <div className={`p-7 bg-base-100 rounded-2xl border ${award.border} hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center text-center pt-8`}>
                {/* Medal Circle */}
                <div className={`w-20 h-20 rounded-full ${award.bg} border-2 ${award.border} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <span className={`text-4xl ${award.color}`}>
                    {award.icon}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-base-content mb-3">
                  {award.title}
                </h3>

                <p className="text-base-content/60 text-sm leading-relaxed">
                  {award.description}
                </p>

                {/* Year Badge */}
                <span className={`mt-5 inline-block px-3 py-1 rounded-full text-xs font-semibold ${award.bg} ${award.color}`}>
                  2024
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Awards;
