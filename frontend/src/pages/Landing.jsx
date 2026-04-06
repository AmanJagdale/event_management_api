import { motion } from "framer-motion";
import { ArrowRight, Shield, Heart, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-purple-100">
      {/* Navigation */}
      <nav className="px-6 md:px-12 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">W</span>
          </div>
          <h1 className="text-2xl font-bold text-purple-900">WDC-Connect</h1>
        </div>
        <Link to="/login" className="btn-primary text-sm">
          Get Started
        </Link>
      </nav>

      {/* Hero */}
      <div className="px-6 md:px-12 lg:px-24 py-20 md:py-32 max-w-6xl mx-auto">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-purple-900 mb-6 leading-tight"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Safe • Support •{" "}
            <span className="bg-white/30 px-6 py-3 rounded-xl inline-block">
              Empower
            </span>
          </motion.h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Women Development Cell platform for campus safety, events, and
            community support. Your voice matters.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link to="/login" className="btn-primary text-lg px-12 py-4">
              Join Now <ArrowRight className="w-5 h-5 ml-2 inline" />
            </Link>
            <Link
              to="/register"
              className="px-12 py-4 border-2 border-purple-200 bg-white/50 backdrop-blur-md rounded-xl text-purple-900 font-semibold hover:bg-white hover:shadow-lg transition-all duration-300"
            >
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                24/7 Safety
              </h3>
              <p className="text-white/80">
                Emergency support always available
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Community</h3>
              <p className="text-white/80">5000+ active members</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Events</h3>
              <p className="text-white/80">Weekly workshops & sessions</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
