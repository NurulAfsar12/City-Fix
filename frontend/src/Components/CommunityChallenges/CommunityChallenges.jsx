import React from "react";
import { motion } from "framer-motion";
import { FaMedal, FaTrophy, FaUsers, FaFire, FaGift, FaArrowRight } from "react-icons/fa";

const challenges = [
  {
    title: "Top Reporter of the Month",
    subtitle: "Report the most verified issues",
    icon: <FaMedal />,
    color: "from-secondary to-secondary-dark",
    light: "bg-secondary/20",
    textColor: "text-secondary",
    reward: "Gold Badge + Featured on Leaderboard",
    progress: 80,
  },
  {
    title: "Community Helper",
    subtitle: "Upvote 20+ issues from other citizens",
    icon: <FaUsers />,
    color: "from-primary to-primary-dark",
    light: "bg-primary/20",
    textColor: "text-primary",
    reward: "Community Helper Badge",
    progress: 65,
  },
  {
    title: "Rapid Response Hero",
    subtitle: "Report an urgent issue and get it resolved within 24 hours",
    icon: <FaFire />,
    color: "from-error to-error-dark",
    light: "bg-error/20",
    textColor: "text-error",
    reward: "Rapid Response Badge",
    progress: 45,
  },
  {
    title: "Eco Guardian",
    subtitle: "Report 10+ environmental issues (garbage, leaks, pollution)",
    icon: <FaTrophy />,
    color: "from-success to-success-dark",
    light: "bg-success/20",
    textColor: "text-success",
    reward: "Eco Guardian Badge",
    progress: 30,
  },
];

const CommunityChallenges = () => {
  return (
    <section className="py-24 bg-base-100">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-semibold mb-4">
            Gamification
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-base-content mb-4">
            Community Challenges
          </h2>
          <p className="text-base-content/60 max-w-2xl mx-auto text-lg">
            Earn badges, climb the leaderboard, and help make your city cleaner, safer, and smarter.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {challenges.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="group"
            >
              <div className="h-full p-7 bg-base-200 rounded-2xl border border-base-300 hover:border-transparent transition-all duration-300 hover:shadow-xl flex flex-col relative overflow-hidden">
                {/* Background Gradient on Hover */}
                <div className={`absolute inset-0 ${item.light} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-2xl mb-5 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    {item.icon}
                  </div>

                  <h3 className="text-xl font-bold text-base-content mb-2">
                    {item.title}
                  </h3>
                  <p className="text-base-content/60 text-sm mb-5">
                    {item.subtitle}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-5">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-base-content/50">Progress</span>
                      <span className={`font-semibold ${item.textColor}`}>
                        {item.progress}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-base-300 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.progress}%` }}
                        transition={{ duration: 1.5, delay: index * 0.2 }}
                        viewport={{ once: true }}
                        className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                      />
                    </div>
                  </div>

                  {/* Reward */}
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${item.light} text-sm`}>
                    <FaGift className={`${item.textColor} shrink-0`} />
                    <span className="text-base-content/70">Reward: {item.reward}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <button className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-primary to-primary/80 text-base-100 font-semibold hover:shadow-xl hover:shadow-primary/30 transition-all">
            View Community Leaderboard
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunityChallenges;
