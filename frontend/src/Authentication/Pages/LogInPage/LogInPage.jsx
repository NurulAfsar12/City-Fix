import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FaLock, FaUserAstronaut } from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate, useLocation } from "react-router";

export default function LogInPage() {
  const { register, handleSubmit } = useForm();
  const { signInUser, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // Email/Password Login
  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const result = await signInUser(data.email, data.password);

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: `Welcome ${result.user.name || result.user.email}!`,
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        navigate(from, { replace: true });
      });
    } catch (error) {
      console.error("Login Error:", error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text:
          error.response?.data?.message ||
          error.message ||
          "Something went wrong!",
      });
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    navigate("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-base-100 shadow-xl rounded-xl overflow-hidden flex flex-col md:flex-row w-full max-w-4xl"
      >
        {/* LEFT — LOGIN FORM */}
        <div className="w-full md:w-1/2 p-10">
          <h1 className="text-3xl font-bold text-base-content mb-6">Login</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-base-content/70 mb-1">
                Email
              </label>
              <div className="flex items-center gap-3 border-b border-base-300 py-1 focus-within:border-primary">
                <FaUserAstronaut className="text-base-content/50" />
                <input
                  type="email"
                  {...register("email", { required: true })}
                  placeholder="Enter your email"
                  className="w-full outline-none bg-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-base-content/70 mb-1">
                Password
              </label>
              <div className="flex items-center gap-3 border-b border-base-300 py-1 focus-within:border-primary">
                <FaLock className="text-base-content/50" />
                <input
                  type="password"
                  {...register("password", { required: true })}
                  placeholder="Enter password"
                  className="w-full outline-none bg-transparent"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="mt-4 w-full btn btn-primary rounded-full shadow-md text-white border-none"
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>
          </form>

          {/* Register Redirect Button */}
          <motion.div className="mt-6 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/register")}
              className="text-sm link link-primary hover:underline"
            >
              Don't have an account? Register
            </motion.button>
          </motion.div>
        </div>

        {/* RIGHT — ILLUSTRATION */}
        <div className="w-full md:w-1/2 bg-[#1e2130] flex items-center justify-center relative p-10 overflow-hidden">
          <Stars />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <FaUserAstronaut className="text-white text-[120px]" />
            <p className="text-gray-300 mt-4 text-lg tracking-wide">
              Welcome Back, Explorer
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function Stars() {
  const stars = Array.from({ length: 14 });
  return (
    <>
      {stars.map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-red-300 rounded-full opacity-70"
          style={{
            top: `${Math.random() * 95}%`,
            left: `${Math.random() * 95}%`,
          }}
        ></div>
      ))}
    </>
  );
}
