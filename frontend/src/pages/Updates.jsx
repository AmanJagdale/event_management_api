import { motion } from "framer-motion";
import { Bell } from "lucide-react";

export default function Updates() {
  return (
    <motion.div
      className="glass-card p-8 text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Bell className="w-24 h-24 text-gray-300 mx-auto mb-6" />
      <h2 className="text-3xl font-bold text-gray-700 mb-2">No New Updates</h2>
      <p className="text-gray-500">You're all caught up! Check back later for notifications and announcements.</p>
    </motion.div>
  );
}
