import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express, { type Request, type Response } from "express";
import categoryRoutes from "../categories.js";
import * as categoryController from "../../controllers/categories-controller.js";
import type { Mock } from "vitest";

// Mock the categories controller
vi.mock("../../controllers/categories-controller.js", () => ({
  getCategories: vi.fn(),
}));

describe("Category Routes", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/api/categories", categoryRoutes);
    vi.clearAllMocks();
  });

  describe("GET /api/categories", () => {
    it("should return list of categories", async () => {
      const mockCategories = ["technology", "sports", "politics"];

      (categoryController.getCategories as Mock).mockImplementation(
        (req: Request, res: Response) => {
          res.json(mockCategories);
        },
      );

      const response = await request(app)
        .get("/api/categories")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toEqual(mockCategories);
      expect(categoryController.getCategories).toHaveBeenCalledTimes(1);
    });

    it("should return empty array when no categories exist", async () => {
      (categoryController.getCategories as Mock).mockImplementation(
        (req: Request, res: Response) => {
          res.json([]);
        },
      );

      const response = await request(app)
        .get("/api/categories")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toEqual([]);
      expect(categoryController.getCategories).toHaveBeenCalledTimes(1);
    });

    it("should handle controller errors", async () => {
      (categoryController.getCategories as Mock).mockImplementation(() => {
        throw new Error("Database error");
      });

      await request(app).get("/api/categories").expect(500);
      expect(categoryController.getCategories).toHaveBeenCalledTimes(1);
    });
  });
});
