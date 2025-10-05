import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express, { type Request, type Response } from "express";
import articleRoutes from "../articles.js";
import * as articleController from "../../controllers/articles-controller.js";
import type { Mock } from "vitest";

// Mock the article controller
vi.mock("../../controllers/articles-controller.js", () => ({
  getArticles: vi.fn(),
  getArticleById: vi.fn(),
}));

describe("Article Routes", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/api/articles", articleRoutes);
    vi.clearAllMocks();
  });

  describe("GET /api/articles", () => {
    it("should return articles with default pagination", async () => {
      const mockArticles = {
        items: [
          { id: "1", title: "Test Article 1" },
          { id: "2", title: "Test Article 2" },
        ],
        page: 1,
        limit: 10,
        total: 2,
      };

      (articleController.getArticles as Mock).mockImplementation(
        (req: Request, res: Response) => {
          res.json(mockArticles);
        },
      );

      const response = await request(app)
        .get("/api/articles")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toEqual(mockArticles);
      expect(articleController.getArticles).toHaveBeenCalledTimes(1);
    });

    it("should handle query parameters correctly", async () => {
      (articleController.getArticles as Mock).mockImplementation(
        (req: Request, res: Response) => {
          res.json({ query: req.query });
        },
      );

      const response = await request(app)
        .get("/api/articles")
        .query({
          page: 2,
          limit: 20,
          category: "tech",
          search: "test",
        })
        .expect(200);

      expect(articleController.getArticles).toHaveBeenCalledTimes(1);
      expect(response.body.query).toEqual({
        page: "2",
        limit: "20",
        category: "tech",
        search: "test",
      });
    });

    it("should handle controller errors", async () => {
      (articleController.getArticles as Mock).mockImplementation(() => {
        throw new Error("Database error");
      });

      await request(app).get("/api/articles").expect(500);
    });
  });

  describe("GET /api/articles/:id", () => {
    it("should return a single article when found", async () => {
      const mockArticle = {
        id: "123",
        title: "Test Article",
        content: "Content",
      };

      (articleController.getArticleById as Mock).mockImplementation(
        (req: Request, res: Response) => {
          res.json(mockArticle);
        },
      );

      const response = await request(app)
        .get("/api/articles/123")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toEqual(mockArticle);
      expect(articleController.getArticleById).toHaveBeenCalledTimes(1);
    });

    it("should return 404 when article is not found", async () => {
      (articleController.getArticleById as Mock).mockImplementation(
        (req: Request, res: Response) => {
          res.status(404).json({ message: "Article not found" });
        },
      );

      const response = await request(app)
        .get("/api/articles/nonexistent")
        .expect(404);

      expect(response.body).toEqual({ message: "Article not found" });
    });

    it("should handle invalid ID format", async () => {
      (articleController.getArticleById as Mock).mockImplementation(
        (req: Request, res: Response) => {
          res.status(400).json({ message: "Invalid article ID" });
        },
      );

      await request(app).get("/api/articles/invalid-id").expect(400);
    });

    it("should handle controller errors", async () => {
      (articleController.getArticleById as Mock).mockImplementation(() => {
        throw new Error("Database error");
      });

      await request(app).get("/api/articles/123").expect(500);
    });
  });
});
