import React, { useEffect, useState } from "react";
import api from "../api.js";
import NoteModal from "./NoteModal";
import { useLocation } from "react-router-dom";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const location = useLocation();

  const fetchNotes = async () => {
    try {
      const searchParams = new URLSearchParams(location.search);
      const search = searchParams.get("search") || "";
      const { data } = await api.get("/notes");
      const filtered = search
        ? data.filter(
            (n) =>
              n.title.toLowerCase().includes(search.toLowerCase()) ||
              n.description.toLowerCase().includes(search.toLowerCase()),
          )
        : data;
      setNotes(filtered);
    } catch {
      setError("Failed to fetch notes");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [location.search]);

  const handleSaveNote = (newNote) => {
    if (editNote) {
      setNotes(notes.map((n) => (n._id === newNote._id ? newNote : n)));
    } else {
      setNotes([...notes, newNote]);
    }
    setEditNote(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter((n) => n._id !== id));
    } catch {
      setError("Failed to delete note");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#08080c] relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[700px] h-[700px] bg-[#7c5cff]/35 rounded-full blur-[130px]" />
        <div className="absolute top-20 -right-32 w-[800px] h-[800px] bg-[#4a6cf7]/25 rounded-full blur-[140px]" />
        <div className="absolute -bottom-32 left-1/4 w-[600px] h-[600px] bg-[#ff5cc8]/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {error && (
          <p className="text-red-300 bg-red-500/10 border border-red-500/20 p-3 rounded-xl mb-6">
            {error}
          </p>
        )}

        <NoteModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditNote(null);
          }}
          note={editNote}
          onSave={handleSaveNote}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {notes.map((note) => (
            <div
              key={note._id}
              className="group relative rounded-[26px] p-[22px] bg-white/[0.08] backdrop-blur-[28px] border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.25)] hover:bg-white/[0.11] hover:scale-[1.02] transition-all duration-300"
            >
              <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              <h3 className="text-white font-semibold text-[17px]">
                {note.title}
              </h3>
              <p className="text-white/65 text-[14px] mt-3 leading-6 min-h-[70px] line-clamp-4">
                {note.description}
              </p>
              <p className="text-white/30 text-[11px] mt-4">
                {new Date(note.updatedAt).toLocaleString()}
              </p>
              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => {
                    setEditNote(note);
                    setIsModalOpen(true);
                  }}
                  className="flex-1 py-2.5 rounded-full bg-white text-black text-[13px] font-bold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(note._id)}
                  className="flex-1 py-2.5 rounded-full bg-red-500/15 border border-red-400/20 text-red-200 text-[13px] font-bold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-7 right-7 w-14 h-14 rounded-full bg-white text-black text-[28px] shadow-[0_10px_40px_rgba(255,255,255,0.25)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
      >
        <span className="pb-1">+</span>
      </button>
    </div>
  );
};

export default Home;
