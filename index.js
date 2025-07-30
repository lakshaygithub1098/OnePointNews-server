// 📁 server/index.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";

import newsRoutes from "./routes/news.js";
import interactionsRoute from "./routes/interactions.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/news", newsRoutes);
app.use("/api/interactions", interactionsRoute);

// ✅ Main route to fetch news from Guardian API
app.get("/", async (req, res) => {
  try {
    console.log("🔑 NEWS_API_KEY:", process.env.NEWS_API_KEY);

    const response = await axios.get(
      "https://content.guardianapis.com/search", {
        params: {
          "api-key": process.env.NEWS_API_KEY,
          "show-fields": "thumbnail,headline,short-url,body",
          "page-size": 10
        }
      }
    );

    const articles = response.data.response.results;
    res.json(articles);
  } catch (error) {
    console.error("❌ Failed to fetch news:", error.message);
    res.status(500).json({ message: "Failed to fetch news" });
  }
});

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
