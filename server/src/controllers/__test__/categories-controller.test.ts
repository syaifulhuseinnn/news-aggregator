import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";
import { getCategories } from "../categories-controller.js";
import { Article } from "../../models/article.js";
import { memo } from "../../services/cache/memory.js";

// Mock needs to be before any imports
vi.mock("../../models/article.js", () => ({
  Article: {
    distinct: vi.fn(),
  },
}));

vi.mock("../../services/cache/memory.js", () => ({
  memo: vi.fn((key, fn) => fn()),
}));

// Get the mocked version of Article
const MockedArticle = vi.mocked(Article, true);

describe("Categories Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };
    vi.clearAllMocks();
  });

  it("should return sorted categories list", async () => {
    MockedArticle.distinct.mockResolvedValue(["tech", "business", "sports"]);

    await getCategories(req as Request, res as Response);

    expect(MockedArticle.distinct).toHaveBeenCalledWith("categories");
    expect(res.json).toHaveBeenCalledWith(["business", "sports", "tech"]);
  });

  it("should return empty array when no categories exist", async () => {
    MockedArticle.distinct.mockResolvedValue([]);

    await getCategories(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith([]);
  });

  it("should filter out falsy values", async () => {
    MockedArticle.distinct.mockResolvedValue([
      "tech",
      null,
      "sports",
      "",
      "business",
    ]);

    await getCategories(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(["business", "sports", "tech"]);
  });

  it("should handle database errors", async () => {
    const error = new Error("Database error");
    MockedArticle.distinct.mockRejectedValue(error);

    await getCategories(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });

  it("should sort categories alphabetically", async () => {
    MockedArticle.distinct.mockResolvedValue(["beta", "zebra", "alpha"]);

    await getCategories(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(["alpha", "beta", "zebra"]);
  });
});
