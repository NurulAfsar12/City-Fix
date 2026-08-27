import React from "react";
import { motion } from "framer-motion";
import { FaShieldAlt, FaClock, FaChartBar, FaUsers } from "react-icons/fa";

const features = [
  {
    icon: <FaShieldAlt />,
    title: "Transparency",
    description:
      "Improves transparency by allowing citizens to see the status of all reported issues.",
    gradient: "from-primary to-primary-dark",
    borderGlow: "group-hover:shadow-primary/25",
  },
  {
    icon: <FaClock />,
    title: "Reduced Response Time",
    description:
      "Reduces the response time for municipal services by tracking each issue efficiently.",
    gradient: "from-success to-success-dark",
    borderGlow: "group-hover:shadow-success/25",
  },
  {
    icon: <FaChartBar />,
    title: "Data Analytics",
    description:
      "Collects and analyzes infrastructure data to help authorities make informed decisions.",
    gradient: "from-secondary to-secondary-dark",
    borderGlow: "group-hover:shadow-secondary/25",
  },
  {
    icon: <FaUsers />,
    title: "Community Engagement",
    description:
      "Engages citizens in improving their city by allowing them to report and track issues.",
    gradient: "from-accent to-accent-dark",
    borderGlow: "group-hover:shadow-accent/25",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-base-100">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-semibold mb-4">
            Why Choose Us
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-base-content mb-4">
            Platform Features
          </h2>
          <p className="text-base-content/60 max-w-2xl mx-auto text-lg">
            Everything you need to report, track, and resolve city issues efficiently.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              className="group relative"
            >
              {/* Gradient Border Effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-500 ${feature.borderGlow}`} />

              <div className="relative p-8 bg-base-200 rounded-2xl h-full flex flex-col items-center text-center group-hover:translate-y-[-2px] transition-all duration-500">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white text-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  {feature.icon}
                </div>

                <h3 className="text-xl font-bold text-base-content mb-3">
                  {feature.title}
                </h3>
                <p className="text-base-content/60 leading-relaxed">
                  {feature.description}
                </p>

                {/* Bottom accent */}
                <div className={`mt-6 w-12 h-1 rounded-full bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 group-hover:w-full transition-all duration-500`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
