import React from "react";
import { motion } from "framer-motion";
import logoImage from "../../assets/logo.jpg";

const Logo = ({ size = 50, text = "CityFIX" }) => {
  return (
    <motion.div
      className="flex items-center gap-3 cursor-pointer select-none"
      initial={{ scale: 0, opacity: 0, y: -20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.15, rotate: 5 }}
    >
      {/* Logo Image */}
      <motion.img
        src={logoImage}
        alt="CityFIX Logo"
        className="object-contain rounded-full shadow-lg"
        style={{ width: size, height: size }}
        whileHover={{ rotate: 20, scale: 1.2 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      />

      {/* Logo Text */}
      <motion.span
        className="font-extrabold text-2xl bg-clip-text text-transparent"
        style={{
          backgroundImage: "linear-gradient(90deg, #991B1B, #0F172A)",
        }}
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 250 }}
        whileHover={{
          scale: 1.1,
          textShadow: "0px 0px 22px rgba(153,27,27,0.8)",
        }}
      >
        {text}
      </motion.span>
    </motion.div>
  );
};

export default Logo;
