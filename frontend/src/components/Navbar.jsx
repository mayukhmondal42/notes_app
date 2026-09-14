import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = ({ user, setUser }) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const delay = setTimeout(() => {
      navigate(search.trim() ? `/?search=${encodeURIComponent(search)}` : "/");
    }, 300);
    return () => clearTimeout(delay);
  }, [search, navigate, user]);

  useEffect(() => {
    setSearch("");
  }, [user]);

  return (
    <div className="sticky top-0 z-50 px-4 pt-4">
      <nav className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-6 py-3.5 rounded-[22px] bg-[#1e1e3a]/70 backdrop-blur-[24px] border border-white/15 shadow-xl">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <img src={logo} alt="logo" className="w-6 h-6" />
          </div>
          <span className="font-black tracking-[0.2em] text-white text-[13px]">
            NOTES
          </span>
        </Link>

        {user && (
          <div className="flex items-center gap-3 flex-1 justify-end">
            <div className="relative w-full max-w-[380px]">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes..."
                className="w-full h-[42px] pl-11 pr-4 rounded-full bg-white/15 border border-white/20 text-white placeholder-white/60 text-[14px] font-medium outline-none focus:bg-white/20 focus:border-white/30 focus:ring-2 focus:ring-white/20 transition-all"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 text-[30px]">
                ⌕
              </span>
            </div>

            <div className="w-9 h-9 rounded-full bg-white/20 border border-white/20 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {user.username?.[0]?.toUpperCase()}
            </div>
            <span className="hidden lg:block text-white/90 text-sm font-medium">
              {user.username}
            </span>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                setUser(null);
                navigate("/login");
              }}
              className="h-[42px] px-5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white text-sm font-medium transition shrink-0"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
