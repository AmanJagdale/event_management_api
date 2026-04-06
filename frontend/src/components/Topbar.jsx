import { Bell, User, Menu } from "lucide-react";
import { motion } from "framer-motion";

export default function Topbar({ setSidebarOpen }) {
  const user = {
    name: localStorage.getItem("name") || "Member",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  };

  return (
    <motion.div
      className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-glow"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="px-6 md:px-8 py-4 flex items-center justify-between">
        {/* Mobile menu button */}
        <motion.button
          className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
          onClick={() => setSidebarOpen(true)}
          whileTap={{ scale: 0.95 }}
        >
          <Menu className="w-6 h-6" />
        </motion.button>

        {/* Greeting */}
        <div className="hidden md:block">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-pink-500 bg-clip-text text-transparent">
            Welcome back, {user.name} 💜
          </h1>
          <p className="text-gray-500">Today</p>
        </div>
      </div>
    </motion.div>
  );
}
