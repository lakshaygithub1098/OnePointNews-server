// 📁 server/index.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import newsRoutes from "./routes/news.js";
import interactionsRoute from "./routes/interactions.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/api/news", newsRoutes);
app.use("/api/interactions", interactionsRoute);

// ✅ Optional: Root route to show backend is live
app.get("/", (req, res) => {
  res.send("✅ One Point News Backend is live");
});

// ✅ Port setup
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB Error:", err));
