import dotenv from "dotenv";

dotenv.config({ debug: true });

interface Config {
  PORT: number;
}

const CONFIG: Config = {
  PORT: Number(process.env.PORT),
};

const API_KEYS = {
  NEWSAPI: process.env.NEWS_API_KEY || "",
  GUARDIAN: process.env.GUARDIAN_API_KEY || "",
};

const API_URL = {
  NEWSAPI: `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEYS.NEWSAPI}`,
  GUARDIAN: `https://content.guardianapis.com/search?order-by=newest&show-fields=trailText,thumbnail&api-key=${API_KEYS.GUARDIAN}`,
};

const MONGODB_URI = process.env.MONGODB_URI || "";

export { CONFIG, API_KEYS, API_URL, MONGODB_URI };
