import express from "express";
import cors from "cors";
import articlesRouter from "./routes/articles.ts";
// import "./services/ingest.ts";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/articles", articlesRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the News Aggregator API");
});

export default app;
