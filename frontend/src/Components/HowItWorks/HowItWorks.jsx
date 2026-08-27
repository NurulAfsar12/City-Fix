import React from "react";
import { motion } from "framer-motion";
import {
  FaRegLightbulb,
  FaMapMarkerAlt,
  FaUsers,
  FaCheckCircle,
} from "react-icons/fa";

const steps = [
  {
    title: "Report an Issue",
    description:
      "Citizens submit a report with photos, location, and description of public issues.",
    icon: <FaRegLightbulb />,
    gradient: "from-primary to-primary-dark",
    light: "bg-primary/20",
  },
  {
    title: "Verification & Assignment",
    description:
      "Admins review reports and assign the issue to the appropriate staff for resolution.",
    icon: <FaUsers />,
    gradient: "from-success to-success-dark",
    light: "bg-success/20",
  },
  {
    title: "Track Progress",
    description:
      "Staff update the issue status, and citizens can track the progress in real-time.",
    icon: <FaMapMarkerAlt />,
    gradient: "from-secondary to-secondary-dark",
    light: "bg-secondary/20",
  },
  {
    title: "Resolved & Closed",
    description:
      "Once resolved, admins close the issue, and citizens are notified of completion.",
    icon: <FaCheckCircle />,
    gradient: "from-accent to-accent-dark",
    light: "bg-accent/20",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-base-200 to-base-100">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-semibold mb-4">
            Simple Process
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-base-content mb-4">
            How It Works
          </h2>
          <p className="text-base-content/60 max-w-2xl mx-auto text-lg">
            From reporting to resolution in four simple steps.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting Line (desktop) */}
          <div className="hidden lg:block absolute top-24 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary via-success via-secondary to-accent" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Step Number */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-base-100 border-2 border-base-content/20 text-base-content font-bold text-sm shadow-lg">
                    {index + 1}
                  </span>
                </div>

                {/* Icon */}
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white text-3xl shadow-xl mb-6 transform group-hover:scale-110 transition-transform`}>
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-base-content mb-3">
                  {step.title}
                </h3>
                <p className="text-base-content/60 leading-relaxed">
                  {step.description}
                </p>

                {/* Mobile connecting arrow */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-4">
                    <div className="w-0.5 h-8 bg-gradient-to-b from-current to-transparent opacity-30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
