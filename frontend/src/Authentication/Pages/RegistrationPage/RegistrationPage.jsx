import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { FaRocket } from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../../Context/AuthContext";

export default function RegistrationForm() {
  const { register, handleSubmit } = useForm();
  const { registerUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);

    // Password validation regex
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=]).{8,}$/;

    if (!passwordRegex.test(data.password)) {
      Swal.fire({
        icon: "warning",
        title: "Weak Password",
        html: `Password must contain:<br/>
              • At least 8 characters<br/>
              • One uppercase letter<br/>
              • One lowercase letter<br/>
              • One number<br/>
              • One special character`,
      });
      setLoading(false);
      return;
    }

    try {
      await registerUser({
        name: `${data.firstName} ${data.secondName}`.trim(),
        email: data.email,
        phone: data.phone || null,
        password: data.password,
        password_confirmation: data.confirmPassword,
      });

      // SweetAlert success
      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: `Welcome ${data.firstName}!`,
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/");
    } catch (error) {
      console.error("Registration Error:", error);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text:
          error.response?.data?.message ||
          error.message ||
          "Something went wrong!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-base-100 shadow-xl rounded-xl overflow-hidden flex flex-col md:flex-row w-full max-w-5xl"
      >
        {/* LEFT SIDE — FORM */}
        <div className="w-full md:w-1/2 p-10">
          <h1 className="text-3xl font-bold text-base-content mb-6">
            Registration
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-base-content/70 mb-1">
                  First Name
                </label>
                <input
                  {...register("firstName", { required: true })}
                  className="w-full border-b border-base-300 focus:border-primary outline-none py-1 bg-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-base-content/70 mb-1">
                  Second Name
                </label>
                <input
                  {...register("secondName", { required: true })}
                  className="w-full border-b border-base-300 focus:border-primary outline-none py-1 bg-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-base-content/70 mb-1">
                Email
              </label>
              <input
                {...register("email", { required: true })}
                type="email"
                className="w-full border-b border-base-300 focus:border-primary outline-none py-1 bg-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-base-content/70 mb-1">
                Phone (optional)
              </label>
              <input
                {...register("phone")}
                type="tel"
                className="w-full border-b border-base-300 focus:border-primary outline-none py-1 bg-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-base-content/70 mb-1">
                Password
              </label>
              <input
                {...register("password", { required: true })}
                type="password"
                className="w-full border-b border-base-300 focus:border-primary outline-none py-1 bg-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-base-content/70 mb-1">
                Confirm Password
              </label>
              <input
                {...register("confirmPassword", { required: true })}
                type="password"
                className="w-full border-b border-base-300 focus:border-primary outline-none py-1 bg-transparent"
              />
            </div>

            {/* Register Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="mt-4 w-full btn btn-primary rounded-full shadow-md text-white border-none"
            >
              {loading ? "Registering..." : "Register"}
            </motion.button>
          </form>

          {/* Go to Login Button */}
          <motion.div className="mt-6 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
              className="text-sm link link-primary hover:underline"
            >
              Already have an account? Login
            </motion.button>
          </motion.div>
        </div>

        {/* RIGHT SIDE — ROCKET ART */}
        <div className="w-full md:w-1/2 bg-[#1e2130] flex items-center justify-center relative p-10">
          <Shapes />

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative flex flex-col items-center"
          >
            <FaRocket className="text-white text-[120px]" />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="w-4 h-20 bg-gradient-to-b from-red-400 to-transparent rounded-full"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

/* LITTLE CONFETTI SHAPES */
function Shapes() {
  const shapes = Array.from({ length: 12 });
  const rotations = ["12deg", "45deg", "90deg", "180deg"];

  return (
    <>
      {shapes.map((_, i) => (
        <div
          key={i}
          className={`absolute w-4 h-4 border-2
          ${
            i % 3 === 0
              ? "border-pink-400"
              : i % 3 === 1
              ? "border-red-300"
              : "border-green-300"
          }
          `}
          style={{
            top: `${Math.random() * 90}%`,
            left: `${Math.random() * 90}%`,
            transform: `rotate(${rotations[i % 4]})`,
          }}
        ></div>
      ))}
    </>
  );
}
