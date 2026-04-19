import { Link, useLocation, useNavigate, useResolvedPath } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Calendar,
  AlertTriangle,
  Bell,
  User,
  LayoutDashboard,
  Megaphone,
  FileText,
  LogOut,
} from "lucide-react";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate(); // Must be imported above
  const role = localStorage.getItem("role");

  const navItems = [
    { name: "Dashboard", path: "/home", icon: LayoutDashboard },
    { name: "Events", path: "/events", icon: Calendar },
    { name: "Updates", path: "/updates", icon: Bell },
    { name: "Profile", path: "/profile", icon: User },
  ];

  if (role === "admin") {
    navItems.splice(1, 0, { name: "Admin Dashboard", path: "/admin", icon: FileText });
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const isActive = (path) => {
    return useResolvedPath(path).pathname === location.pathname;
  };

  return (
    <>
      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg md:hidden"
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", bounce: 0 }}
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-md">
                  <span className="text-2xl font-bold text-white">W</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    WDC UDAAN
                  </h1>
                  <p className="text-sm text-gray-500">Empower Her</p>
                </div>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`sidebar-link ${isActive(item.path) ? "sidebar-link-active" : ""}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="absolute bottom-6 left-6 right-6">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors font-medium border border-transparent hover:border-red-100"
                >
                  <LogOut className="w-5 h-5" />
                  Log Out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.aside
        className="fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg hidden md:block"
        initial={{ x: -280 }}
        animate={{ x: 0 }}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-12 pb-6 border-b border-gray-100">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-md">
              <span className="text-2xl font-bold text-white">W</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                WDC UDAAN
              </h1>
              <p className="text-sm text-gray-500">Empower Her</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-link ${isActive(item.path) ? "sidebar-link-active" : ""}`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors font-medium border border-transparent hover:border-red-100 mt-6"
            >
              <LogOut className="w-5 h-5" />
              Log Out
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
