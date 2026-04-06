import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function EventCard({ event }) {
  return (
    <motion.div
      className="glass-card p-6 hover:shadow-glow-lg transition-all duration-300 group cursor-pointer overflow-hidden"
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-3 h-12 bg-gradient-to-b from-primary-400 to-pink-400 rounded-xl flex-shrink-0"></div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full capitalize">
              {event.type}
            </span>
            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
              {event.status || "Live"}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary-600 transition-colors mb-1 line-clamp-2">
            {event.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {event.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          {new Date(event.date).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          {event.category || "General"}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm font-medium text-primary-600">
          <span>{event.current_registrations || 0}/{event.capacity || 0} filled</span>
          <Users className="w-4 h-4" />
        </div>
        <Link
          to={`/events/${event.id}`}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold group-hover:translate-x-1 transition-all duration-200"
        >
          View Details
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
