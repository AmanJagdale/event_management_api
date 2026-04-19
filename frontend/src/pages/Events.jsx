import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Calendar, MapPin } from "lucide-react";
import EventCard from "../components/EventCard";

const categories = ["All", "Workshop", "Session", "Counseling", "Seminar"];

export default function Events() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    const token = localStorage.getItem("token"); // Get your login token

    fetch("https://event-management-api-uy6h.onrender.com/api/events", {
      headers: {
        "Authorization": `Bearer ${token}`, // Send the token to the backend
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch events");
        return res.json();
      })
      .then(data => {
        console.log("Events received:", data); // Check your console to see the data
        setEvents(data);
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || event.type === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="glass-card p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-pink-500 bg-clip-text text-transparent mb-3">
              Campus Events
            </h1>
            <p className="text-xl text-gray-600">
              Discover workshops, sessions and community events
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                className="w-80 pl-12 pr-6 py-3 border border-gray-200 rounded-2xl bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-primary-500/20 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-wrap gap-3 mb-6">
          {categories.map((category) => (
            <motion.button
              key={category}
              className={`px-6 py-3 rounded-2xl font-medium transition-all duration-200 border-2 ${activeCategory === category
                ? "bg-gradient-to-r from-primary-500 to-pink-400 text-white border-transparent shadow-glow"
                : "border-gray-200 bg-white/50 hover:border-primary-200 hover:shadow-md"
                }`}
              onClick={() => setActiveCategory(category)}
              whileTap={{ scale: 0.98 }}
            >
              {category}
            </motion.button>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Sort by: </span>
            <select
              className="bg-transparent border-none focus:outline-none font-medium text-primary-600"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Date</option>
              <option value="participants">Popularity</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{filteredEvents.length} events found</span>
          </div>
        </div>
      </motion.div>

      {/* Events Grid */}
      <motion.section
        className="glass-card p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <AnimatePresence>
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Calendar className="w-24 h-24 text-gray-300 mx-auto mb-8" />
              <h3 className="text-2xl font-bold text-gray-500 mb-2">
                No events found
              </h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Try adjusting your search or filter criteria. New events are
                added weekly.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    </div>
  );
}
