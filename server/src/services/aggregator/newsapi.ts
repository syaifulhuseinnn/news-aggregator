import axios from "axios";
import { API_URL } from "../../config/config.ts";
import type { NEWSAPIResponse } from "../../types/newsapi.interface.ts";
import sha1 from "sha1";
import { normalizeTitle } from "../../utils/normalize.ts";

export default async function fetchNewsApi() {
  const categories = [
    "business",
    "entertainment",
    "health",
    "science",
    "sports",
    "technology",
  ];
  const urls = categories.map((category) =>
    axios.get<NEWSAPIResponse>(`${API_URL.NEWSAPI}&category=${category}`),
  );

  try {
    const responses = await Promise.all(urls);
    // Attach category to each article based on the order of categories and responses
    const articlesWithCategory = responses.flatMap((response, idx) =>
      response.data.articles.map((article) => ({
        ...article,
        category: categories[idx],
      })),
    );

    return articlesWithCategory.map((article) => ({
      source: "newsapi",
      title: article.title,
      summary: article.description ?? "",
      url: article.url,
      imageUrl: article.urlToImage ?? "",
      publishedAt: new Date(article.publishedAt),
      categories: [article.category],
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
