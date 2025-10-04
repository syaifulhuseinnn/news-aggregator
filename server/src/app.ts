import express from "express";
import cors from "cors";
import articlesRouter from "./routes/articles.js";
import categoriesRouter from "./routes/categories.js";
import "./services/ingest.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/articles", articlesRouter);
app.use("/api/categories", categoriesRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the News Aggregator API");
});

export default app;
