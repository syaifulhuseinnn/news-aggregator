import axios from "axios";
import { API_URL } from "../../config/config.ts";
import sha1 from "sha1";
import { normalizeTitle } from "../../utils/normalize.ts";
import type {
  GuardianResponse,
  Reference,
} from "../../types/guardian.interface.ts";

export default async function fetchGuardian() {
  const normalizeAuthors = (references: Reference[]) => {
    const authors = references
      .map((ref) => ref.id.split("/").pop() || "")
      .filter((name) => name);
    return authors;
  };
  try {
    const response = await axios.get<GuardianResponse>(API_URL.GUARDIAN);
    const articles = response.data.response.results;
    return articles.map((article) => ({
      source: "guardian",
      title: article.webTitle,
      summary: article.fields.trailText ?? "",
      content: article.fields.body ?? "",
      url: article.webUrl,
      imageUrl: article.fields.thumbnail ?? "",
      publishedAt: new Date(article.webPublicationDate),
      categories: [article.sectionId],
      authors: normalizeAuthors(article.references),
      contentHash: sha1(
        normalizeTitle(article.webTitle) +
          "guardian" +
          article.webPublicationDate,
      ),
    }));
  } catch (error) {
    console.error("Error fetching from Guardian:", error);
    return [];
  }
}
