import { motion } from "framer-motion";
import { Mail, Phone, Hash, User, Lock, ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const loginTabs = ["Email", "Mobile", "Student ID"];

export default function Login() {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
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
        alert(data.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during login. Please try again.");
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Login method tabs */}
            <div className="flex bg-white/50 rounded-2xl p-1">
              {loginTabs.map((tab, index) => (
                <button
                  key={tab}
                  type="button"
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === index
                      ? "bg-gradient-to-r from-primary-500 to-pink-400 text-white shadow-glow"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setActiveTab(index)}
                >
                  {tab === "Email" && <Mail className="w-4 h-4 inline mr-2" />}
                  {tab === "Mobile" && (
                    <Phone className="w-4 h-4 inline mr-2" />
                  )}
                  {tab === "Student ID" && (
                    <Hash className="w-4 h-4 inline mr-2" />
                  )}
                  {tab}
                </button>
              ))}
            </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                className="w-full px-4 py-4 border border-gray-200 rounded-2xl bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-primary-500/20 focus:border-transparent transition-all duration-200 appearance-none bg-no-repeat bg-right"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
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
