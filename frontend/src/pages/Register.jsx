import { motion } from "framer-motion";
import { ChevronLeft, Mail, Lock, ShieldCheck, School } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL = "https://event-management-api-uy6h.onrender.com/api";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: "member",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMsg("Registration successful! Please login.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setErrorMsg(data.error || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An error occurred during registration. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-lavender flex items-center justify-center p-6">
      <motion.div
        className="w-full max-w-4xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Illustration */}
          <motion.div
            className="hidden lg:block relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="glass-card p-12 rounded-3xl h-[500px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-pink-400 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <School className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-100 bg-clip-text mb-4">
                  Welcome to WDC-Connect
                </h2>
                <p className="text-xl text-[#4A4A4A] max-w-md mx-auto leading-relaxed">
                  Join our safe community dedicated to empower and support women
                  on campus.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link
              to="/login"
              className="flex items-center gap-2 mb-12 text-white/80 hover:text-white inline-flex transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Login
            </Link>

            <div className="glass-card p-10">
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold mb-3">
                  Create Account
                </h1>
                <p className="text-gray-600">
                  Join WDC-Connect in 1 simple step
                </p>

                {errorMsg && (
                  <div className="mt-4 p-3 rounded-xl bg-red-100 text-red-600 text-center text-sm font-medium">
                    {errorMsg}
                  </div>
                )}
                {successMsg && (
                  <div className="mt-4 p-3 rounded-xl bg-green-100 text-green-600 text-center text-sm font-medium">
                    {successMsg}
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-primary-500/20"
                      placeholder="your.email@university.edu"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      required
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-primary-500/20"
                      placeholder="Create strong password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          password: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="gradient-btn w-full py-5 text-lg font-semibold shadow-glow-lg hover:shadow-glow-xl"
                  disabled={!formData.email || !formData.password}
                >
                  Create My Account
                </button>
              </form>

              <div className="mt-10 text-center pt-8 border-t border-white/30">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-primary-600 hover:text-primary-700"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
