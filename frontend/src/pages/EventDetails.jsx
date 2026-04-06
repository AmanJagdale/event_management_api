import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  User,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { events } from "../data/events";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function EventDetails() {
  const { id } = useParams();
  const event = events.find((e) => e.id === parseInt(id)) || events[0];

  const [quantity, setQuantity] = useState(1);

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-12">
        <div className="max-w-4xl mx-auto glass-card p-12 text-center">
          <Calendar className="w-24 h-24 text-gray-300 mx-auto mb-8" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Event not found
          </h2>
          <p className="text-gray-600 mb-8">
            The event you're looking for doesn't exist.
          </p>
          <Link to="/events" className="gradient-btn">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <div className="p-6 md:p-12 lg:p-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="max-w-6xl mx-auto"
        >
          {/* Back & Header */}
          <div className="flex items-center gap-4 mb-12">
            <Link
              to="/events"
              className="p-3 bg-white/50 backdrop-blur-xl rounded-2xl hover:shadow-glow transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-4 py-2 bg-gradient-to-r from-primary-500 to-pink-400 text-white text-sm font-semibold rounded-xl shadow-glow">
                  {event.type.toUpperCase()}
                </span>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg">
                  {event.status === "live" ? "Live Now" : "Upcoming"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Event Details */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="glass-card p-8">
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text mb-6 leading-tight">
                  {event.title}
                </h1>
                <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                  {event.description}
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-12">
                  <div className="glass-card p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="w-6 h-6 text-primary-500" />
                      <span className="font-semibold text-gray-800">
                        {event.date}
                      </span>
                    </div>
                    <p className="text-gray-600">Date & Time</p>
                  </div>

                  <div className="glass-card p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="w-6 h-6 text-primary-500" />
                      <span className="font-semibold text-gray-800">
                        {event.location}
                      </span>
                    </div>
                    <p className="text-gray-600">Venue</p>
                  </div>
                </div>

                {event.speakers && (
                  <div className="glass-card p-6 mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      Speakers <Users className="w-5 h-5" />
                    </h3>
                    <div className="space-y-3">
                      {event.speakers.map((speaker, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-white/30 rounded-xl"
                        >
                          <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-pink-400 rounded-xl flex items-center justify-center">
                            <span className="font-semibold text-white text-sm">
                              S
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {speaker}
                            </p>
                            <p className="text-sm text-gray-600">Speaker</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/30">
                  <button className="gradient-btn flex-1 text-lg font-semibold py-4">
                    Register Now <Users className="w-5 h-5 ml-2 inline" />
                  </button>
                  <button className="flex-1 py-4 px-6 border-2 border-primary-200 text-primary-600 font-semibold rounded-2xl hover:bg-primary-50 hover:shadow-glow transition-all">
                    Add to Calendar
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:sticky lg:top-24 h-fit space-y-6"
            >
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">
                    Participants
                  </h3>
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold text-primary-600">
                      {event.participants}
                    </span>
                    <Users className="w-6 h-6 text-primary-500" />
                  </div>
                </div>
                <div className="flex -space-x-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 border-3 border-white rounded-full"
                      style={{
                        backgroundImage: `url(https://images.unsplash.com/photo-${1600 + i}?w=40&h=40&fit=crop&crop=face)`,
                        backgroundSize: "cover",
                      }}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  And {event.participants - 5}+ others
                </p>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Share Event
                </h3>
                <div className="flex gap-3">
                  <button className="flex-1 p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-glow transition-all">
                    <Share2 className="w-5 h-5 mx-auto" />
                  </button>
                  <button className="flex-1 p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-glow transition-all">
                    WhatsApp
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
