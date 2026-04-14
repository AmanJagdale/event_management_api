import { motion } from "framer-motion";
import { Mail, User, Lock, ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";



export default function Login() {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL = "https://wdc-udaan-backend.onrender.com/api";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("name", data.user.name);
        localStorage.setItem("userId", data.user.id.toString());
        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      } else {
        setErrorMsg(data.error || "Wrong credentials");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-lavender flex items-center justify-center p-6">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Back button */}
        <Link
          to="/"
          className="flex items-center gap-2 text-white/80 hover:text-white mb-8 inline-flex"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <div className="glass-card">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-pink-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow-lg">
              <span className="text-3xl font-bold text-white">W</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-100 text-red-600 text-center text-sm font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-primary-500/20 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
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
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-primary-500/20 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>



            <button
              type="submit"
              className="gradient-btn w-full text-lg font-semibold py-4"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Don't have an account?</p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
            >
              Create Account
              <User className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
