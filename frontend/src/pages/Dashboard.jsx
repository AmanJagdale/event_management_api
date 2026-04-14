import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, Calendar, AlertCircle, Heart } from "lucide-react";
import EventCard from "../components/EventCard";

export default function Dashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("https://wdc-udaan-backend.onrender.com/api/events")
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-pink-500 bg-clip-text text-transparent mb-3">
              Good Morning, {localStorage.getItem("name") || "Member"}!
            </h1>
            <p className="text-xl text-gray-600">
              Here's what's happening today 💜
            </p>
          </div>
          <div className="glass-card p-6 text-center">
            <Heart className="w-12 h-12 text-pink-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">Stay Safe</p>
          </div>
        </div>
      </motion.div>

      {/* Events Preview */}
      <motion.section
        className="glass-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Upcoming Events</h2>
          <a
            href="/events"
            className="text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1"
          >
            View All <span>→</span>
          </a>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.slice(0, 3).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </motion.section>
    </div>
  );
}
