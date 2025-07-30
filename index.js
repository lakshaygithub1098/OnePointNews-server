// 📁 server/index.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios"; // ✅ required for API call

import newsRoutes from "./routes/news.js";
import interactionsRoute from "./routes/interactions.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ API routes
app.use("/api/news", newsRoutes);
app.use("/api/interactions", interactionsRoute);

// ✅ Root route: returns news JSON directly from Guardian API
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      `https://content.guardianapis.com/search?api-key=${process.env.GUARDIAN_API_KEY}&show-fields=thumbnail,headline,short-url,body`
    );

    const newsData = response.data.response.results;
    res.json(newsData); // ✅ return array of news articles
  } catch (error) {
    console.error("❌ Error fetching news from Guardian API:", error.message);
    res.status(500).json({ message: "Failed to fetch news" });
  }
});

// ✅ MongoDB connection and server start
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
