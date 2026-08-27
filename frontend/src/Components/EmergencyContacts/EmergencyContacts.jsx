import React from 'react';
import { FaPhoneAlt, FaFireExtinguisher, FaAmbulance, FaShieldAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const EmergencyContacts = () => {
  const services = [
    {
      id: 1,
      name: "National Emergency",
      number: "999",
      icon: <FaPhoneAlt />,
      color: "from-error to-error-dark",
      light: "bg-error/20",
      desc: "Police, Ambulance, Fire",
      ring: "ring-error/30",
    },
    {
      id: 2,
      name: "Police Control",
      number: "100",
      icon: <FaShieldAlt />,
      color: "from-info to-info-dark",
      light: "bg-info/20",
      desc: "Law Enforcement",
      ring: "ring-info/30",
    },
    {
      id: 3,
      name: "Fire Service",
      number: "102",
      icon: <FaFireExtinguisher />,
      color: "from-warning to-warning-dark",
      light: "bg-warning/20",
      desc: "Fire & Rescue",
      ring: "ring-warning/30",
    },
    {
      id: 4,
      name: "Ambulance",
      number: "101",
      icon: <FaAmbulance />,
      color: "from-success to-success-dark",
      light: "bg-success/20",
      desc: "Medical Emergency",
      ring: "ring-success/30",
    }
  ];

  return (
    <section className="relative py-24 bg-base-100 overflow-hidden">
      {/* Alert Pattern Background */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-error rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-warning rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-error/20 text-error text-sm font-semibold mb-4 animate-pulse">
            Emergency Services
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-base-content mb-4">
            Emergency Contacts
          </h2>
          <p className="text-base-content/60 max-w-2xl mx-auto text-lg">
            Quick access to essential emergency services in your area. Save these numbers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="bg-base-200 rounded-2xl p-7 flex flex-col items-center text-center relative overflow-hidden border border-base-300 hover:border-transparent transition-all duration-300 hover:shadow-xl">
                {/* Top Gradient Bar */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${service.color}`} />

                {/* Pulse Ring */}
                <div className={`w-20 h-20 rounded-full ${service.light} ring-2 ${service.ring} flex items-center justify-center text-3xl mb-5 relative group-hover:scale-110 transition-transform duration-500`}>
                  <span className={`text-white bg-gradient-to-br ${service.color} w-16 h-16 rounded-full flex items-center justify-center`}>
                    {service.icon}
                  </span>
                  <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-current" />
                </div>

                <h3 className="text-xl font-bold text-base-content mb-1">
                  {service.name}
                </h3>
                <p className="text-base-content/50 text-sm mb-2">{service.desc}</p>

                {/* Phone Number Display */}
                <div className={`text-3xl font-black mb-5 bg-gradient-to-r ${service.color} bg-clip-text text-transparent`}>
                  {service.number}
                </div>

                <a
                  href={`tel:${service.number}`}
                  className={`inline-flex items-center gap-2 w-full justify-center px-5 py-3 rounded-xl bg-gradient-to-r ${service.color} text-white font-semibold hover:opacity-90 transition-all shadow-lg group/link`}
                >
                  <FaPhoneAlt className="group-hover/link:animate-pulse" />
                  Call Now
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmergencyContacts;
