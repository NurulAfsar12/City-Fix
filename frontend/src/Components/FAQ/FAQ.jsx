import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiMinus, FiHelpCircle } from "react-icons/fi";

const faqs = [
  {
    question: "How do I report an issue?",
    answer:
      "You can report an issue by clicking the 'Report Issue' button in your dashboard and filling out the required details including title, category, description, and optionally upload a photo.",
    category: "General",
  },
  {
    question: "Can I track my reported issues?",
    answer:
      "Yes! Once you submit an issue, it will appear in your 'My Issues' section where you can track its status from Pending → In-Progress → Resolved → Closed.",
    category: "General",
  },
  {
    question: "What are the benefits of premium subscription?",
    answer:
      "Premium users can report unlimited issues, boost priority issues for faster resolution, and enjoy priority support.",
    category: "Subscription",
  },
  {
    question: "Who can resolve the reported issues?",
    answer:
      "Issues are assigned to staff members by admins, who then verify and update the status until it's resolved and closed.",
    category: "General",
  },
  {
    question: "Can I upvote someone else's issue?",
    answer:
      "Yes! You can upvote any issue reported by others to show public importance, but you cannot upvote your own issues.",
    category: "General",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-base-200">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-semibold mb-4">
            Got Questions?
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-base-content mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base-content/60 max-w-2xl mx-auto text-lg">
            Everything you need to know about using CityFIX.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`rounded-2xl transition-all duration-300 overflow-hidden ${
                openIndex === index
                  ? "bg-base-100 shadow-xl border border-primary/20"
                  : "bg-base-100/80 shadow-md border border-base-300 hover:border-base-content/20"
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    openIndex === index
                      ? "bg-primary text-base-100"
                      : "bg-base-300 text-base-content/50"
                  }`}>
                    <FiHelpCircle size={16} />
                  </span>
                  <h3 className="text-base md:text-lg font-semibold text-base-content">
                    {faq.question}
                  </h3>
                </div>
                <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  openIndex === index
                    ? "bg-primary text-base-100 rotate-45"
                    : "bg-base-300 text-base-content/50"
                }`}>
                  {openIndex === index ? <FiMinus /> : <FiPlus />}
                </span>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pt-0 border-t border-primary/10">
                      <div className="pl-11">
                        <p className="text-base-content/70 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
