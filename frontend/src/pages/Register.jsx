import { motion } from "framer-motion";
import {
  ChevronLeft,
  Mail,
  Phone,
  Hash,
  User,
  Lock,
  ShieldCheck,
  School,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const roles = [
  { id: "member", label: "Member", icon: User },
  { id: "admin", label: "Admin", icon: ShieldCheck },
];

export default function Register() {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    agreeTerms: false,
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const registerTabs = ["Personal Info", "Verification", "Password"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }
    
    try {
      let finalRole = formData.role;
      // You can add logic to securely process roles in backend if needed.
      const response = await fetch("https://wdc-udaan-backend.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: finalRole,
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
                  Join WDC-Connect in 3 simple steps
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

                {/* Progress */}
                <div className="flex items-center justify-center gap-2 mt-8 mb-2">
                  {[1, 2, 3].map((stepNum) => (
                    <div
                      key={stepNum}
                      className={`w-10 h-2 rounded-full ${
                        stepNum <= activeTab + 1
                          ? "bg-gradient-to-r from-primary-500 to-pink-400"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-center gap-6 text-xs text-gray-500">
                  {registerTabs.map((tab, index) => (
                    <span
                      key={tab}
                      className={`font-medium ${activeTab >= index ? "text-primary-600" : ""}`}
                    >
                      {tab}
                    </span>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Personal Info */}
                {activeTab === 0 && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          required
                          className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-primary-500/20"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                      </div>
                    </div>


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

                    <button
                      type="button"
                      className="gradient-btn w-full py-4 text-lg"
                      onClick={() => setActiveTab(1)}
                    >
                      Continue to Verification
                    </button>
                  </>
                )}

                {/* Step 2: Role */}
                {activeTab === 1 && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-6 text-center">
                        Select your role
                      </label>
                      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                        {roles.map((role) => (
                          <motion.button
                            key={role.id}
                            type="button"
                            className={`glass-card p-6 hover:shadow-glow-lg transition-all flex flex-col items-center gap-3 border-2 ${
                              formData.role === role.id
                                ? "border-primary-300 ring-2 ring-primary-500/30"
                                : "border-transparent"
                            }`}
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                role: role.id,
                              }))
                            }
                            whileHover={{ y: -3 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-pink-400 rounded-2xl flex items-center justify-center shadow-glow">
                              <role.icon className="w-8 h-8 text-white" />
                            </div>
                            <span className="font-semibold text-gray-800">
                              {role.label}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/30">
                      <button
                        type="button"
                        className="gradient-btn w-full py-4 text-lg"
                        onClick={() => setActiveTab(2)}
                        disabled={!formData.role}
                      >
                        Continue to Password
                      </button>
                    </div>
                  </>
                )}

                {/* Step 3: Password */}
                {activeTab === 2 && (
                  <>
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="password"
                          required
                          className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-primary-500/20"
                          placeholder="Repeat password"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              confirmPassword: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="terms"
                        type="checkbox"
                        required
                        className="w-5 h-5 text-primary-600 bg-white/50 border-gray-300 rounded focus:ring-primary-500"
                        checked={formData.agreeTerms}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            agreeTerms: e.target.checked,
                          }))
                        }
                      />
                      <label
                        htmlFor="terms"
                        className="ml-3 text-sm text-gray-700 cursor-pointer"
                      >
                        I agree to the{" "}
                        <span className="text-primary-600 hover:underline font-medium">
                          Terms of Service
                        </span>{" "}
                        and{" "}
                        <span className="text-primary-600 hover:underline font-medium">
                          Privacy Policy
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="gradient-btn w-full py-5 text-lg font-semibold shadow-glow-lg hover:shadow-glow-xl"
                      disabled={!formData.agreeTerms}
                    >
                      Create My Account
                    </button>
                  </>
                )}
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
