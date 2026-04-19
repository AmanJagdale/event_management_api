import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Clock, User, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventRes = await fetch(`https://event-management-api-uy6h.onrender.com/api/events/${id}`);
        if (eventRes.ok) {
          const eventData = await eventRes.json();
          setEvent(eventData);
        }

        if (token) {
          const regRes = await fetch(`https://event-management-api-uy6h.onrender.com/api/events/${id}/check-registration`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (regRes.ok) {
            const regData = await regRes.json();
            setIsRegistered(regData.isRegistered);
          }
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id, token]);

  const handleRegister = async () => {
    try {
      const res = await fetch(`https://event-management-api-uy6h.onrender.com/api/events/${id}/register`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setIsRegistered(true);
        setEvent(prev => ({ ...prev, current_registrations: prev.current_registrations + 1 }));
      } else {
        const data = await res.json();
        alert(data.error || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-12">
        <div className="max-w-4xl mx-auto glass-card p-12 text-center">
          <Calendar className="w-24 h-24 text-gray-300 mx-auto mb-8" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Event not found</h2>
          <p className="text-gray-600 mb-8">The event you're looking for doesn't exist.</p>
          <Link to="/events" className="gradient-btn">Back to Events</Link>
        </div>
      </div>
    );
  }

  const isFull = event.current_registrations >= event.capacity;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <div className="p-6 md:p-12 lg:p-24">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ staggerChildren: 0.1 }} className="max-w-6xl mx-auto">
          {/* Back & Header */}
          <div className="flex items-center gap-4 mb-12">
            <Link to="/events" className="p-3 bg-white/50 backdrop-blur-xl rounded-2xl hover:shadow-glow transition-all">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-4 py-2 bg-gradient-to-r from-primary-500 to-pink-400 text-white text-sm font-semibold rounded-xl shadow-glow">
                  {event.type?.toUpperCase()}
                </span>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg">
                  {new Date(event.date) >= new Date() ? "Upcoming" : "Finished"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Event Details */}
            <motion.div className="space-y-8" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
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
                        {new Date(event.date).toLocaleDateString()} {event.event_time ? `at ${event.event_time}` : ""}
                      </span>
                    </div>
                    <p className="text-gray-600">Date & Time</p>
                  </div>

                  <div className="glass-card p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="w-6 h-6 text-primary-500" />
                      <span className="font-semibold text-gray-800">
                        {event.location || "Online / TBD"}
                      </span>
                    </div>
                    <p className="text-gray-600">Venue</p>
                  </div>
                </div>

                {event.mentor_name && (
                  <div className="glass-card p-6 mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      Mentor <User className="w-5 h-5" />
                    </h3>
                    <div className="flex items-center gap-3 p-3 bg-white/30 rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-pink-400 rounded-xl flex items-center justify-center">
                        <span className="font-semibold text-white text-sm">{event.mentor_name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{event.mentor_name}</p>
                        <p className="text-sm text-gray-600">Lead Speaker</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/30">
                  <button 
                    onClick={handleRegister} 
                    disabled={isRegistered || isFull || !token} 
                    className={`flex-1 text-lg font-semibold py-4 rounded-xl transition-all ${isRegistered ? "bg-emerald-100 text-emerald-700 cursor-not-allowed" : isFull ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "gradient-btn"}`}
                  >
                    {isRegistered ? "Already Registered" : isFull ? "Event Full" : !token ? "Login to Register" : "Register Now"} 
                    {(!isRegistered && !isFull && token) && <Users className="w-5 h-5 ml-2 inline" />}
                  </button>
                  <button className="flex-1 py-4 px-6 border-2 border-primary-200 text-primary-600 font-semibold rounded-2xl hover:bg-primary-50 hover:shadow-glow transition-all">
                    Add to Calendar
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="lg:sticky lg:top-24 h-fit space-y-6">
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Capacity Status</h3>
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold text-primary-600">{event.current_registrations}</span>
                    <span className="text-gray-400 font-medium text-lg">/ {event.capacity}</span>
                    <Users className="w-6 h-6 text-primary-500 ml-2" />
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-100 rounded-full h-3 mb-4 overflow-hidden shadow-inner">
                  <div 
                    className={`h-3 rounded-full transition-all duration-1000 ${isFull ? "bg-red-500" : "bg-gradient-to-r from-primary-400 to-pink-400"}`}
                    style={{ width: `${Math.min((event.current_registrations / event.capacity) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 font-medium">
                  {event.capacity - event.current_registrations > 0 
                    ? `${event.capacity - event.current_registrations} slots remaining`
                    : "Fully booked"}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
