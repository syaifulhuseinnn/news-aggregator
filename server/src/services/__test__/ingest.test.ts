import { describe, it, expect, vi, beforeEach } from "vitest";
import { Article } from "../../models/article.js";
import type { Mock } from "vitest";

// Mock the modules
vi.mock("../../models/article", () => ({
  Article: {
    updateOne: vi.fn(),
  },
}));

vi.mock("../aggregator/newsapi", () => ({
  default: vi.fn(),
}));

vi.mock("../aggregator/guardian", () => ({
  default: vi.fn(),
}));

// Prevent automatic execution of ingestOnce
vi.mock("node-cron", () => ({
  default: {
    schedule: vi.fn(),
  },
}));

// Import mocked modules after the vi.mock declarations
import fetchNewsApi from "../aggregator/newsapi.js";
import fetchGuardian from "../aggregator/guardian.js";
import { ingestOnce } from "../ingest.js"; // Import just the function, not default

describe("Ingest Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01"));
  });

  it("should successfully ingest articles from all sources", async () => {
    const mockArticles1 = [
      { title: "Test 1", contentHash: "hash1" },
      { title: "Test 2", contentHash: "hash2" },
    ];
    const mockArticles2 = [{ title: "Test 3", contentHash: "hash3" }];

    (fetchNewsApi as Mock).mockResolvedValue(mockArticles1);
    (fetchGuardian as Mock).mockResolvedValue(mockArticles2);
    (Article.updateOne as Mock).mockResolvedValue({ acknowledged: true });

    const result = await ingestOnce();

    expect(fetchNewsApi).toHaveBeenCalledTimes(1);
    expect(fetchGuardian).toHaveBeenCalledTimes(1);
    expect(Article.updateOne).toHaveBeenCalledTimes(3);
    expect(result).toEqual({
      count: "Fetched 3 articles",
      at: new Date("2024-01-01"),
    });

    // Verify each article was processed
    expect(Article.updateOne).toHaveBeenCalledWith(
      { contentHash: "hash1" },
      {
        $set: mockArticles1[0],
        $setOnInsert: { fetchedAt: expect.any(Date) },
      },
      { upsert: true },
    );
    expect(Article.updateOne).toHaveBeenCalledWith(
      { contentHash: "hash2" },
      {
        $set: mockArticles1[1],
        $setOnInsert: { fetchedAt: expect.any(Date) },
      },
      { upsert: true },
    );
    expect(Article.updateOne).toHaveBeenCalledWith(
      { contentHash: "hash3" },
      {
        $set: mockArticles2[0],
        $setOnInsert: { fetchedAt: expect.any(Date) },
      },
      { upsert: true },
    );
  });

  it("should handle empty results from sources", async () => {
    (fetchNewsApi as Mock).mockResolvedValue([]);
    (fetchGuardian as Mock).mockResolvedValue([]);

    const result = await ingestOnce();

    expect(Article.updateOne).not.toHaveBeenCalled();
    expect(result).toEqual({
      count: "Fetched 0 articles",
      at: new Date("2024-01-01"),
    });
  });

  it("should continue if one source fails", async () => {
    const mockArticles = [{ title: "Test", contentHash: "hash1" }];

    (fetchNewsApi as Mock).mockRejectedValue(new Error("API Error"));
    (fetchGuardian as Mock).mockResolvedValue(mockArticles);

    const result = await ingestOnce();

    expect(Article.updateOne).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      count: "Fetched 1 articles",
      at: new Date("2024-01-01"),
    });
  });

  it("should use correct upsert parameters", async () => {
    const mockArticle = { title: "Test", contentHash: "hash1" };
    (fetchNewsApi as Mock).mockResolvedValue([mockArticle]);
    (fetchGuardian as Mock).mockResolvedValue([]);

    await ingestOnce();

    expect(Article.updateOne).toHaveBeenCalledWith(
      { contentHash: "hash1" },
      {
        $set: mockArticle,
        $setOnInsert: { fetchedAt: new Date("2024-01-01") },
      },
      { upsert: true },
    );
  });

  it("should handle database errors", async () => {
    const mockArticle = { title: "Test", contentHash: "hash1" };
    (fetchNewsApi as Mock).mockResolvedValue([mockArticle]);
    (fetchGuardian as Mock).mockResolvedValue([]);
    (Article.updateOne as Mock).mockRejectedValue(new Error("DB Error"));

    await expect(ingestOnce()).rejects.toThrow("DB Error");
  });
});
