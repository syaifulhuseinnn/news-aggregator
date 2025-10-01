import axios from "axios";
import { API_URL } from "../../config/config.ts";
import type { NEWSAPIResponse } from "../../types/newsapi.interface.ts";
import sha1 from "sha1";
import { normalizeTitle } from "../../utils/normalize.ts";

export default async function fetchNewsApi() {
  try {
    const response = await axios.get<NEWSAPIResponse>(API_URL.NEWSAPI);
    const articles = response.data.articles;
    return articles.map((article) => ({
      source: "newsapi",
      title: article.title,
      summary: article.description ?? "",
      url: article.url,
      imageUrl: article.urlToImage ?? "",
      publishedAt: new Date(article.publishedAt),
      categories: [],
      authors: article.author ? [article.author] : [],
      contentHash: sha1(
        normalizeTitle(article.title) + "newsapi" + article.publishedAt,
      ),
    }));
  } catch (error) {
    console.error("Error fetching from NewsAPI:", error);
    return [];
  }
}
