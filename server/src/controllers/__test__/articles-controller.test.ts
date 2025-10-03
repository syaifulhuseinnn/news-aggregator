import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";
import { getArticles, getArticleById } from "../articles-controller.ts";
import { Article } from "../../models/article.ts";

// Mock the Article model
vi.mock("../../models/article.ts", () => ({
  Article: {
    find: vi.fn(() => ({
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      lean: vi.fn().mockResolvedValue([]),
    })),
    countDocuments: vi.fn().mockResolvedValue(0),
    findById: vi.fn(() => ({
      lean: vi.fn().mockResolvedValue(null),
    })),
  },
}));

// Get the mocked version of Article
const MockedArticle = vi.mocked(Article, true);

describe("Articles Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      query: {},
      params: {},
    };
    res = {
      json: vi.fn(),
      setHeader: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };
    vi.clearAllMocks();
  });

  describe("getArticles", () => {
    it("should return articles with default pagination", async () => {
      await getArticles(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        total: 0,
        items: [],
      });
      expect(res.setHeader).toHaveBeenCalledWith("X-Total-Count", 0);
    });

    it("should handle custom page and limit", async () => {
      req.query = { page: "2", limit: "20" };

      await getArticles(req as Request, res as Response);

      expect(res.setHeader).toHaveBeenCalledWith("X-Total-Count", 0);
    });

    it("should filter by category", async () => {
      req.query = { category: "tech" };

      await getArticles(req as Request, res as Response);

      expect(res.setHeader).toHaveBeenCalledWith("X-Total-Count", 0);
    });

    it("should handle search query", async () => {
      req.query = { search: "test" };

      await getArticles(req as Request, res as Response);

      expect(res.setHeader).toHaveBeenCalledWith("X-Total-Count", 0);
    });
  });

  describe("getArticleById", () => {
    it("should return article when found", async () => {
      const mockArticleData = { id: "123", title: "Test Article" };
      MockedArticle.findById.mockImplementationOnce(() => ({
        lean: vi.fn().mockResolvedValue(mockArticleData),
      }));
      req.params = { id: "123" };

      await getArticleById(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(mockArticleData);
    });

    it("should return 404 when article not found", async () => {
      req.params = { id: "nonexistent" };

      await getArticleById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Article not found" });
    });
  });
});
