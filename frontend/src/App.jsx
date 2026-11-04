import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import api from "./api.js";

function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(() => {
    const saved = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    return !saved && !!token;
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/users/me")
      .then(({ data }) => {
        const normalized = {
          _id: data._id || data.id,
          id: data._id || data.id,
          username: data.username,
          email: data.email,
        };
        setUser(normalized);
        localStorage.setItem("user", JSON.stringify(normalized));
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => setLoading(false));
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08080c] flex items-center justify-center">
        <div className="text-white/60 animate-pulse">Loading notes app...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080c] flex flex-col">
      <Navbar user={user} setUser={setUser} />
      <div className="flex-1">
        <Routes>
          <Route
            path="/login"
            element={
              user ? <Navigate to="/" replace /> : <Login setUser={setUser} />
            }
          />
          <Route
            path="/register"
            element={
              user ? (
                <Navigate to="/" replace />
              ) : (
                <Register setUser={setUser} />
              )
            }
          />
          <Route
            path="/"
            element={user ? <Home /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
export default App;
