import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api.js";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/users/login", {
        email,
        password,
      });
      localStorage.setItem("token", data.token);
      setUser(data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] w-full bg-[#08080c] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[700px] h-[700px] bg-[#7c5cff]/35 rounded-full blur-[130px]" />
        <div className="absolute top-20 -right-32 w-[800px] h-[800px] bg-[#4a6cf7]/25 rounded-full blur-[140px]" />
        <div className="absolute -bottom-32 left-1/4 w-[600px] h-[600px] bg-[#ff5cc8]/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-[380px] rounded-[32px] p-8 bg-white/[0.08] backdrop-blur-[32px] border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.25)]">
        <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

        <h2 className="text-[26px] font-bold text-white tracking-tight">
          Welcome back
        </h2>
        <p className="text-white/50 text-[13px] mt-1 mb-7">
          Login to your notes
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-400/20 text-red-200 text-[13px] text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full h-[46px] px-4 rounded-2xl bg-white/10 border border-white/15 text-white placeholder-white/40 text-[14px] outline-none focus:bg-white/15 focus:border-white/30 focus:ring-2 focus:ring-white/20 transition"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full h-[46px] px-4 rounded-2xl bg-white/10 border border-white/15 text-white placeholder-white/40 text-[14px] outline-none focus:bg-white/15 focus:border-white/30 focus:ring-2 focus:ring-white/20 transition"
            required
          />
          <button className="w-full h-[46px] rounded-full bg-white text-black text-[14px] font-bold shadow-[0_8px_20px_rgba(255,255,255,0.2)] hover:bg-gray-100 hover:scale-[1.01] active:scale-[0.99] transition-all">
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-white/50 text-[13px]">
          Don't have an account?{" "}
          <Link
            className="text-white font-semibold hover:underline"
            to="/register"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
