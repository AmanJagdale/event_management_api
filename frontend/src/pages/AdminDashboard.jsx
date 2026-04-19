import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Quote, Plus, Trash2, Calendar, Users, LayoutDashboard, Settings, LogOut, Heart, ArrowRight, Activity, TrendingUp, Sparkles } from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [file, setFile] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState("");
  const [members, setMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventForm, setEventForm] = useState({ title: "", type: "workshop", category: "", date: "", capacity: 50, description: "", location: "", event_time: "", mentor_name: "" });
  const [eventsList, setEventsList] = useState([]);
  const [showEventsList, setShowEventsList] = useState(false);
  const [participantsModal, setParticipantsModal] = useState({ show: false, participants: [], count: 0, loading: false });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const showMessage = (msg, isError = false) => {
    if (isError) setErrorMsg(msg);
    else setSuccessMsg(msg);
    setTimeout(() => { setErrorMsg(""); setSuccessMsg(""); }, 4000);
  };

  const token = localStorage.getItem("token");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return showMessage("Please select a file.", true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("https://event-management-api-uy6h.onrender.com/api/users/bulk-upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        showMessage("Upload successful!");
        setFile(null);
        const fileInput = document.getElementById("csv-upload");
        if (fileInput) fileInput.value = "";
      } else {
        showMessage(data.error || "Upload failed", true);
      }
    } catch (err) {
      console.error(err);
      showMessage("Upload error.", true);
    }
  };

  const handleDeleteMember = async (e) => {
    e.preventDefault();
    if (!deleteTarget) return;

    try {
      const res = await fetch(`https://event-management-api-uy6h.onrender.com/api/users/${deleteTarget}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        showMessage("Member deleted successfully.");
        if (deleteTarget === localStorage.getItem("userId")) {
          localStorage.clear();
          window.location.href = "/login";
          return;
        }
        setDeleteTarget("");
        if (showMembers) {
          setMembers(members.filter(m => m.id !== deleteTarget));
        }
      } else {
        showMessage(data.error || "Failed to delete member.", true);
      }
    } catch (err) {
      console.error(err);
      showMessage("Error deleting member.", true);
    }
  };

  const fetchMembers = async () => {
    if (showMembers) {
      setShowMembers(false);
      return;
    }
    try {
      const res = await fetch("https://event-management-api-uy6h.onrender.com/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
        setShowMembers(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEventsList = async () => {
    if (showEventsList) {
      setShowEventsList(false);
      return;
    }
    try {
      const res = await fetch("https://event-management-api-uy6h.onrender.com/api/events");
      if (res.ok) {
        const data = await res.json();
        setEventsList(data);
        setShowEventsList(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewParticipants = async (eventId) => {
    setParticipantsModal({ show: true, participants: [], count: 0, loading: true });
    try {
      const res = await fetch(`https://event-management-api-uy6h.onrender.com/api/events/${eventId}/registrations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setParticipantsModal({ show: true, participants: data.participants, count: data.count, loading: false });
      } else {
        showMessage("Failed to fetch participants.", true);
        setParticipantsModal({ show: false, participants: [], count: 0, loading: false });
      }
    } catch (err) {
      console.error(err);
      showMessage("Error fetching participants.", true);
      setParticipantsModal({ show: false, participants: [], count: 0, loading: false });
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://event-management-api-uy6h.onrender.com/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(eventForm)
      });
      if (res.ok) {
        showMessage("Event created successfully!");
        setEventForm({ title: '', type: 'workshop', category: '', date: '', location: '', event_time: '', mentor_name: '', capacity: 50, description: '' });
        setShowEventForm(false);
      } else {
        const data = await res.json();
        showMessage(data.error || "Failed to create event", true);
      }
    } catch (err) {
      console.error(err);
      showMessage("Error creating event", true);
    }
  };

  const scrollToSection = (id) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc] font-sans relative overflow-hidden">
      {/* Decorative Blur Effects for Glassmorphism */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-400/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Pop-up Messages */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50 px-8 py-4 rounded-full bg-white/95 backdrop-blur-md border border-red-200 text-red-600 font-semibold shadow-2xl flex items-center gap-3">
            <Activity size={20} />
            {errorMsg}
          </motion.div>
        )}
        {successMsg && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50 px-8 py-4 rounded-full bg-white/95 backdrop-blur-md border border-green-200 text-green-600 font-semibold shadow-2xl flex items-center gap-3">
            <Sparkles size={20} />
            {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed Sidebar */}
      <aside className="w-72 glass-sidebar flex flex-col z-40 fixed h-screen left-0 top-0">
        <div className="p-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-amber-400 p-[2px] shadow-lg">
            <div className="w-full h-full bg-[#4338ca] rounded-[10px] flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" fill="currentColor" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold font-playfair tracking-wide m-0 leading-tight">Udaan</h1>
            <p className="text-indigo-200 text-[10px] font-bold tracking-widest uppercase mt-0.5">Admin Portal</p>
          </div>
        </div>

        <div className="flex-1 px-6 py-8 space-y-3">
          <button onClick={() => scrollToSection('dashboard')} className={`w-full sidebar-link ${activeTab === 'dashboard' ? 'sidebar-link-active' : ''}`}>
            <LayoutDashboard size={20} className={activeTab === 'dashboard' ? 'text-amber-400' : ''} />
            Overview
          </button>
          <button onClick={() => scrollToSection('members')} className={`w-full sidebar-link ${activeTab === 'members' ? 'sidebar-link-active' : ''}`}>
            <Users size={20} className={activeTab === 'members' ? 'text-amber-400' : ''} />
            Community Space
          </button>
          <button onClick={() => scrollToSection('events')} className={`w-full sidebar-link ${activeTab === 'events' ? 'sidebar-link-active' : ''}`}>
            <Calendar size={20} className={activeTab === 'events' ? 'text-amber-400' : ''} />
            Workshops & Events
          </button>
        </div>

        <div className="p-6 mt-auto">
          <div className="p-4 rounded-2xl bg-indigo-900/40 border border-indigo-400/20 mb-6 drop-shadow-sm">
            <p className="text-sm text-indigo-100 font-medium leading-relaxed mb-3">Empowering women every single day.</p>
            <div className="w-full h-1.5 bg-indigo-950 rounded-full overflow-hidden">
              <div className="w-3/4 h-full bg-gradient-to-r from-pink-500 to-amber-400 rounded-full" />
            </div>
          </div>
          <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }} className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-indigo-900/40 hover:bg-red-500/90 text-white transition-all duration-300 font-bold tracking-wide">
            <LogOut size={18} />
            Sign Out Securely
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-72 p-10 h-screen overflow-y-auto z-10 custom-scrollbar scroll-smooth">
        <div className="max-w-6xl mx-auto space-y-12 pb-16">
          {/* Header */}
          <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end pt-4">
            <div>
              <h2 className="text-[2.5rem] font-bold font-playfair text-[#1e1b4b] mb-2 tracking-tight">Admin Dashboard</h2>
              <p className="text-gray-500 text-lg">Manage members, events, and track community impact.</p>
            </div>
            <div className="hidden md:flex items-center gap-3 bg-white/60 backdrop-blur-sm px-6 py-2.5 rounded-full border border-gray-200 shadow-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-[pulse_2s_ease-in-out_infinite]" />
              <span className="text-sm font-bold text-gray-700 tracking-wide uppercase">System Online</span>
            </div>
          </motion.header>

          {/* Top Widgets Grid */}
          <div id="dashboard" className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card hover:-translate-y-1 transition-all duration-300 !p-7">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#4338ca] shadow-[inset_0_2px_10px_rgba(67,56,202,0.1)] border border-indigo-100">
                  <Users size={28} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Members</p>
                  <h3 className="text-4xl font-bold text-gray-900">{members.length > 0 ? members.length : '1,240'}</h3>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card hover:-translate-y-1 transition-all duration-300 !p-7">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-pink-50 flex items-center justify-center text-[#db2777] shadow-[inset_0_2px_10px_rgba(219,39,119,0.1)] border border-pink-100">
                  <Calendar size={28} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Active Events</p>
                  <h3 className="text-4xl font-bold text-gray-900">24</h3>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card hover:-translate-y-1 transition-all duration-300 !p-7">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shadow-[inset_0_2px_10px_rgba(245,158,11,0.1)] border border-amber-100">
                  <TrendingUp size={28} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Community Impact</p>
                  <h3 className="text-4xl font-bold text-gray-900">85%</h3>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid xl:grid-cols-2 gap-10">

            {/* Column 1: Members */}
            <div className="space-y-10" id="members">
              {/* Member Controls */}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-[1.7rem] font-bold font-playfair text-[#1e1b4b] mb-1">Member Directory</h2>
                    <p className="text-gray-500 text-sm font-medium">View, manage and remove platform members.</p>
                  </div>
                  <div className="p-3.5 bg-[#4338ca]/10 rounded-2xl text-[#4338ca]">
                    <Users size={24} />
                  </div>
                </div>

                <button onClick={fetchMembers} className="w-full py-4 px-6 border-2 border-[#4338ca]/20 text-[#4338ca] bg-[#4338ca]/5 font-bold rounded-xl hover:bg-[#4338ca] hover:text-white hover:border-[#4338ca] transition-all duration-300 mb-8 flex items-center justify-center gap-2 group shadow-sm">
                  {showMembers ? "Hide Members List" : "Load Member Directory"}
                  <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                </button>

                <AnimatePresence>
                  {showMembers && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-8">
                      <div className="max-h-[320px] overflow-y-auto rounded-xl border border-gray-200 shadow-inner bg-white custom-scrollbar">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                          <thead>
                            <tr className="bg-slate-50/80 border-b border-gray-200 sticky top-0 backdrop-blur-md z-10">
                              <th className="p-4.5 py-4 pl-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest">User ID</th>
                              <th className="p-4.5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Email</th>
                              <th className="p-4.5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Role</th>
                              <th className="p-4.5 py-4 pr-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {members.map((m, idx) => (
                              <tr key={m.id} className={`border-b border-gray-50 transition-colors hover:bg-indigo-50/50 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                                <td className="p-4 pl-6 text-gray-500 font-mono text-sm max-w-[120px] truncate" title={m.id}>{m.id}</td>
                                <td className="p-4 text-gray-800 font-semibold">{m.email}</td>
                                <td className="p-4">
                                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${m.role === 'admin' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-indigo-50 text-[#4338ca] border border-indigo-100'}`}>
                                    {m.role}
                                  </span>
                                </td>
                                <td className="p-4 pr-6 text-center">
                                  <button onClick={(e) => { e.preventDefault(); setDeleteTarget(m.id); }} className="p-2.5 text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-all shadow-sm" title="Select for deletion">
                                    <Trash2 size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {members.length === 0 && (
                              <tr><td colSpan="4" className="p-10 text-center text-gray-400 font-medium tracking-wide">No members found.</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="bg-red-50/80 p-6 rounded-2xl border border-red-100 shadow-sm">
                  <h4 className="text-xs font-black text-red-700 mb-4 uppercase tracking-widest flex items-center gap-2">
                    <Trash2 size={16} className="text-red-600" /> Danger Zone: Manual Deletion
                  </h4>
                  <form onSubmit={handleDeleteMember} className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Paste exact User ID"
                      required
                      value={deleteTarget}
                      onChange={(e) => setDeleteTarget(e.target.value)}
                      className="flex-1 px-5 py-3.5 border border-red-200 rounded-xl bg-white focus:ring-4 focus:ring-red-100 outline-none transition-all placeholder:text-gray-400 font-medium text-gray-700"
                    />
                    <button type="submit" className="px-8 py-3.5 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 shadow-[0_4px_14px_0_rgba(239,68,68,0.39)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.23)] transition-all active:scale-95">
                      Delete
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>

            {/* Column 2: Upload CSV & Events */}
            <div className="space-y-10">

              {/* Bulk Upload Members */}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#db2777]" />
                <div className="flex items-center justify-between mb-8 pl-2">
                  <div>
                    <h2 className="text-[1.7rem] font-bold font-playfair text-[#1e1b4b] mb-1">Bulk Onboarding</h2>
                    <p className="text-gray-500 text-sm font-medium">Upload a CSV file to provision multiple accounts.</p>
                  </div>
                  <div className="p-3.5 bg-[#db2777]/10 rounded-2xl text-[#db2777]">
                    <Upload size={24} />
                  </div>
                </div>

                <form onSubmit={handleUpload} className="space-y-5 pl-2">
                  <div className="relative group">
                    <input
                      type="file"
                      id="csv-upload"
                      accept=".csv"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="hidden"
                    />
                    <label htmlFor="csv-upload" className="w-full flex justify-between items-center px-6 py-5 border-2 border-dashed border-pink-200 rounded-2xl bg-pink-50/40 hover:bg-pink-50 hover:border-pink-400 transition-all cursor-pointer text-gray-600 group-hover:text-pink-700">
                      <span className="font-semibold truncate mr-4 tracking-wide">{file ? file.name : "Choose or drag CSV file"}</span>
                      <Upload size={20} className="text-pink-400 group-hover:scale-110 transition-transform" />
                    </label>
                  </div>
                  <button type="submit" className="gradient-btn w-full py-4 text-lg">
                    Execute Upload Batch
                  </button>
                </form>
              </motion.div>

              {/* Event Management */}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card" id="events">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-[1.7rem] font-bold font-playfair text-[#1e1b4b] mb-1">Event Control</h2>
                    <p className="text-gray-500 text-sm font-medium">Launch new workshops and community seminars.</p>
                  </div>
                  <div className="p-3.5 bg-amber-100 rounded-2xl text-amber-600">
                    <Calendar size={24} />
                  </div>
                </div>

                {!showEventForm ? (
                  <button onClick={() => setShowEventForm(true)} className="w-full py-5 px-6 border-2 border-dashed border-[#4338ca]/30 rounded-2xl font-bold text-[#4338ca] hover:bg-[#4338ca]/5 hover:border-[#4338ca]/60 transition-all flex items-center justify-center gap-3 text-lg">
                    <Plus size={22} /> Create New Platform Event
                  </button>
                ) : (
                  <form onSubmit={handleCreateEvent} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <input type="text" placeholder="Event Title" required value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} className="w-full px-5 py-4 border border-indigo-100 rounded-xl bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 outline-none transition-all placeholder:text-gray-400 font-medium text-gray-800" />

                    <div className="grid grid-cols-2 gap-4">
                      <select required value={eventForm.type} onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })} className="w-full px-5 py-4 border border-indigo-100 rounded-xl bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 outline-none transition-all font-medium text-gray-700">
                        <option value="workshop">Workshop</option>
                        <option value="seminar">Seminar</option>
                      </select>
                      <input type="text" placeholder="Category" required value={eventForm.category} onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })} className="w-full px-5 py-4 border border-indigo-100 rounded-xl bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 outline-none transition-all placeholder:text-gray-400 font-medium text-gray-800" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <input type="date" required value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} className="w-full px-5 py-4 border border-indigo-100 rounded-xl bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 outline-none transition-all font-medium text-gray-700" />
                      <input type="time" placeholder="Event Time" required value={eventForm.event_time} onChange={(e) => setEventForm({ ...eventForm, event_time: e.target.value })} className="w-full px-5 py-4 border border-indigo-100 rounded-xl bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 outline-none transition-all font-medium text-gray-700" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="Location" value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} className="w-full px-5 py-4 border border-indigo-100 rounded-xl bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 outline-none transition-all placeholder:text-gray-400 font-medium text-gray-800" />
                      <input type="text" placeholder="Mentor Name" value={eventForm.mentor_name} onChange={(e) => setEventForm({ ...eventForm, mentor_name: e.target.value })} className="w-full px-5 py-4 border border-indigo-100 rounded-xl bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 outline-none transition-all placeholder:text-gray-400 font-medium text-gray-800" />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <input type="number" placeholder="Capacity" required value={eventForm.capacity} onChange={(e) => setEventForm({ ...eventForm, capacity: parseInt(e.target.value) || '' })} className="w-full px-5 py-4 border border-indigo-100 rounded-xl bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 outline-none transition-all placeholder:text-gray-400 font-medium text-gray-800" />
                    </div>

                    <textarea placeholder="Event Description..." value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} rows={4} className="w-full px-5 py-4 border border-indigo-100 rounded-xl bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 outline-none transition-all resize-none placeholder:text-gray-400 font-medium text-gray-800"></textarea>

                    <div className="flex gap-4 pt-2">
                      <button type="submit" className="flex-1 gradient-btn py-4 shadow-[0_4px_14px_0_rgba(219,39,119,0.39)] text-lg">Publish Event</button>
                      <button type="button" onClick={() => setShowEventForm(false)} className="px-8 py-4 border-2 border-gray-200 bg-white rounded-xl font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all">Cancel</button>
                    </div>
                  </form>
                )}
              </motion.div>

              {/* View Events & Participants */}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass-card">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-[1.7rem] font-bold font-playfair text-[#1e1b4b] mb-1">Events Directory</h2>
                    <p className="text-gray-500 text-sm font-medium">View events and track participants.</p>
                  </div>
                  <div className="p-3.5 bg-[#4338ca]/10 rounded-2xl text-[#4338ca]">
                    <Activity size={24} />
                  </div>
                </div>

                <button onClick={fetchEventsList} className="w-full py-4 px-6 border-2 border-[#4338ca]/20 text-[#4338ca] bg-[#4338ca]/5 font-bold rounded-xl hover:bg-[#4338ca] hover:text-white hover:border-[#4338ca] transition-all duration-300 mb-8 flex items-center justify-center gap-2 group shadow-sm">
                  {showEventsList ? "Hide Events List" : "Load Events Directory"}
                  <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                </button>

                <AnimatePresence>
                  {showEventsList && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-8">
                      <div className="max-h-[320px] overflow-y-auto rounded-xl border border-gray-200 shadow-inner bg-white custom-scrollbar">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                          <thead>
                            <tr className="bg-slate-50/80 border-b border-gray-200 sticky top-0 backdrop-blur-md z-10">
                              <th className="p-4 py-4 pl-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Title</th>
                              <th className="p-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                              <th className="p-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Registrations</th>
                              <th className="p-4 py-4 pr-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Participants</th>
                            </tr>
                          </thead>
                          <tbody>
                            {eventsList.map((e, idx) => (
                              <tr key={e.id} className={`border-b border-gray-50 transition-colors hover:bg-indigo-50/50 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                                <td className="p-4 pl-6 text-gray-800 font-semibold max-w-[200px] truncate" title={e.title}>{e.title}</td>
                                <td className="p-4 text-gray-500 text-sm">{new Date(e.date).toLocaleDateString()}</td>
                                <td className="p-4 text-center">
                                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">
                                    {e.current_registrations || 0} / {e.capacity}
                                  </span>
                                </td>
                                <td className="p-4 pr-6 text-center">
                                  <button onClick={() => handleViewParticipants(e.id)} className="px-4 py-2 bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
                                    View
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {eventsList.length === 0 && (
                              <tr><td colSpan="4" className="p-10 text-center text-gray-400 font-medium tracking-wide">No events found.</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Participants Modal */}
      <AnimatePresence>
        {participantsModal.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Event Participants</h3>
                  <p className="text-sm text-gray-500 font-medium mt-1">Total Registered: {participantsModal.count}</p>
                </div>
                <button onClick={() => setParticipantsModal({ show: false, participants: [], count: 0, loading: false })} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                  <Activity className="rotate-45" size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                {participantsModal.loading ? (
                  <div className="py-10 flex justify-center"><div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" /></div>
                ) : (
                  <div className="space-y-3">
                    {participantsModal.participants.length > 0 ? participantsModal.participants.map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                        <span className="font-semibold text-gray-800">{p.email}</span>
                        <span className="text-xs text-gray-500 font-medium bg-white px-3 py-1 rounded-full border border-gray-200">
                          {new Date(p.registered_at).toLocaleDateString()}
                        </span>
                      </div>
                    )) : (
                      <div className="text-center py-10 text-gray-500 font-medium">No registrations yet.</div>
                    )}
                  </div>
                )}
              </div>
              <div className="p-5 border-t border-gray-100 bg-slate-50/50 flex justify-end">
                <button onClick={() => setParticipantsModal({ show: false, participants: [], count: 0, loading: false })} className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition-colors">Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
