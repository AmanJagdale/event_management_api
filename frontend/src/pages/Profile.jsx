import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Hash } from "lucide-react";

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch("https://wdc-udaan-backend.onrender.com/api/users/profile", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(console.error);
  }, []);

  if (!profile) return <p className="p-8 text-gray-500">Loading profile data...</p>;

  return (
    <motion.div
      className="glass-card p-8 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-6 mb-8 border-b border-gray-100 pb-8">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-500 to-pink-500 flex items-center justify-center text-white text-4xl shadow-glow">
          {profile.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{profile.name}</h1>
          <p className="text-gray-500 capitalize">{profile.role}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-4 bg-white/50 p-4 rounded-xl border border-gray-100">
          <Mail className="w-6 h-6 text-primary-500" />
          <div>
            <p className="text-sm text-gray-500">Email Address</p>
            <p className="font-semibold text-gray-800">{profile.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/50 p-4 rounded-xl border border-gray-100">
          <Phone className="w-6 h-6 text-indigo-500" />
          <div>
            <p className="text-sm text-gray-500">Mobile Number</p>
            <p className="font-semibold text-gray-800">{profile.phone || "Not Set"}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/50 p-4 rounded-xl border border-gray-100">
          <Hash className="w-6 h-6 text-pink-500" />
          <div>
            <p className="text-sm text-gray-500">Student ID</p>
            <p className="font-semibold text-gray-800">{profile.student_id || "Not Set"}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
