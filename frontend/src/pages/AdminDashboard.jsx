import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Quote, Plus, Trash2, Calendar, Users } from "lucide-react";

export default function AdminDashboard() {
  const [file, setFile] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState("");
  const [members, setMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventForm, setEventForm] = useState({ title: "", type: "workshop", category: "", date: "", capacity: 50, description: "" });

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
      const res = await fetch("https://wdc-udaan-backend.onrender.com/api/users/admin/upload-members", {
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
      const res = await fetch(`https://wdc-udaan-backend.onrender.com/api/users/${deleteTarget}`, {
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
      const res = await fetch("https://wdc-udaan-backend.onrender.com/api/users", {
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

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://wdc-udaan-backend.onrender.com/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(eventForm)
      });
      if (res.ok) {
        showMessage("Event created successfully!");
        setEventForm({ title: '', type: 'workshop', category: '', date: '', capacity: 50, description: '' });
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

  return (
    <div className="space-y-8 relative">
      {errorMsg && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-xl bg-red-100 text-red-600 font-bold shadow-lg">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-xl bg-green-100 text-green-600 font-bold shadow-lg">
          {successMsg}
        </div>
      )}
      {/* Header */}
      <motion.div
        className="glass-card p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-pink-500 bg-clip-text text-transparent mb-3">
              Admin Dashboard
            </h1>
            <p className="text-xl text-gray-600">
              Manage platform settings, bulk upload members, and quotes.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Bulk Upload Members */}
        <motion.div
          className="glass-card p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Upload className="w-8 h-8 text-primary-500" />
            <h2 className="text-2xl font-bold text-gray-800">Bulk Upload Members</h2>
          </div>
          <p className="text-gray-600 mb-6">Upload a CSV file to add multiple members at once.</p>
          
          <form onSubmit={handleUpload} className="space-y-4">
            <input
              type="file"
              id="csv-upload"
              accept=".csv"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-primary-50 file:text-primary-700
                hover:file:bg-primary-100 transition-colors"
            />
            <button
              type="submit"
              className="gradient-btn w-full py-3"
            >
              Upload CSV
            </button>
          </form>
        </motion.div>


        {/* Member Management */}
        <motion.div
          className="glass-card p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-8 h-8 text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-800">Member Controls</h2>
          </div>
          <button onClick={fetchMembers} className="w-full py-3 px-6 border-2 border-primary-200 text-primary-600 font-semibold rounded-2xl hover:bg-primary-50 transition-all duration-200 mb-6">
            {showMembers ? "Hide Members" : "View All Members"}
          </button>
          
          {showMembers && (
            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-2">
              {members.map(m => (
                <div key={m.id} className="p-3 bg-white/50 rounded-xl border border-gray-100 flex justify-between items-center text-sm">
                  <div>
                    <p className="font-bold text-gray-800">ID: {m.id} | {m.name}</p>
                    <p className="text-gray-500">{m.email} - {m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleDeleteMember} className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="User ID to delete"
                required
                value={deleteTarget}
                onChange={(e) => setDeleteTarget(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl bg-white/50 focus:ring-4 focus:ring-red-500/20"
              />
              <button type="submit" className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all">
                Delete
              </button>
            </div>
          </form>
        </motion.div>

        {/* Event Management */}
        <motion.div
          className="glass-card p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-8 h-8 text-indigo-500" />
            <h2 className="text-2xl font-bold text-gray-800">Event Management</h2>
          </div>
          <p className="text-gray-600 mb-6">Create and broadcast new workshops to the platform.</p>
          {!showEventForm ? (
            <button onClick={() => setShowEventForm(true)} className="gradient-btn w-full py-3 mb-4">
              + Create New Event
            </button>
          ) : (
            <form onSubmit={handleCreateEvent} className="space-y-4 mb-4">
              <input type="text" placeholder="Event Title" required value={eventForm.title} onChange={(e) => setEventForm({...eventForm, title: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-white/50 focus:ring-4 focus:ring-indigo-500/20" />
              <select required value={eventForm.type} onChange={(e) => setEventForm({...eventForm, type: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-white/50 focus:ring-4 focus:ring-indigo-500/20">
                <option value="workshop">Workshop</option>
                <option value="seminar">Seminar</option>
              </select>
              <input type="text" placeholder="Category (e.g. Session)" required value={eventForm.category} onChange={(e) => setEventForm({...eventForm, category: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-white/50 focus:ring-4 focus:ring-indigo-500/20" />
              <input type="date" required value={eventForm.date} onChange={(e) => setEventForm({...eventForm, date: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-white/50 focus:ring-4 focus:ring-indigo-500/20" />
              <input type="number" placeholder="Capacity" required value={eventForm.capacity} onChange={(e) => setEventForm({...eventForm, capacity: parseInt(e.target.value) || ''})} className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-white/50 focus:ring-4 focus:ring-indigo-500/20" />
              <textarea placeholder="Description" value={eventForm.description} onChange={(e) => setEventForm({...eventForm, description: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-white/50 focus:ring-4 focus:ring-indigo-500/20"></textarea>
              <div className="flex gap-2 w-full">
                <button type="submit" className="flex-1 gradient-btn py-3">Create</button>
                <button type="button" onClick={() => setShowEventForm(false)} className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-2xl font-bold hover:bg-gray-50">Cancel</button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
