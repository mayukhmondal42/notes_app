import React, { useEffect, useState } from "react";
import api from "../api.js";

const NoteModal = ({ isOpen, onClose, note, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle(note ? note.title : "");
    setDescription(note ? note.description : "");
    setError("");
  }, [note]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { title, description };
      let data;
      if (note) {
        const res = await api.put(`/notes/${note._id}`, payload);
        data = res.data;
      } else {
        const res = await api.post("/notes", payload);
        data = res.data;
      }
      setTitle("");
      setDescription("");
      setError("");
      onSave(data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save note");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-[16px]">
      <div className="relative w-full max-w-[440px] rounded-[32px] p-7 bg-white/[0.10] backdrop-blur-[32px] border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.3)] overflow-hidden">
        <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-500/20 rounded-full blur-[40px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-500/20 rounded-full blur-[40px] pointer-events-none" />

        <h2 className="relative text-[22px] font-bold text-white tracking-tight">
          {note ? "Edit Note" : "Create Note"}
        </h2>
        <p className="relative text-white/50 text-[13px] mt-1 mb-6">
          {note ? "Update your liquid glass note" : "New transparent note"}
        </p>

        {error && (
          <div className="relative mb-4 p-3 rounded-xl bg-red-500/15 border border-red-400/20 text-red-200 text-[13px]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
            className="w-full px-4 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-white placeholder-white/40 text-[15px] outline-none focus:bg-white/15 focus:border-white/30 focus:ring-2 focus:ring-white/20 backdrop-blur-xl transition"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Note Description..."
            rows={5}
            className="w-full px-4 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-white placeholder-white/40 text-[14px] leading-6 outline-none focus:bg-white/15 focus:border-white/30 focus:ring-2 focus:ring-white/20 backdrop-blur-xl resize-none transition"
            required
          />
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-[44px] rounded-full bg-white/10 border border-white/15 text-white/80 hover:bg-white/15 hover:text-white text-sm font-medium backdrop-blur transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-[44px] rounded-full bg-white text-black text-sm font-bold shadow-[0_8px_20px_rgba(255,255,255,0.25)] hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {note ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
