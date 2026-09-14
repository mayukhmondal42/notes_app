import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import notesRoutes from "./routes/notes.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;


const __dirname = path.resolve();

app.use(cors({
  origin: process.env.NODE_ENV === "production" 
    ? true  
    : "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

app.use("/api/users", authRoutes);
app.use("/api/notes", notesRoutes);


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/dist")));
  
  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
  });
});