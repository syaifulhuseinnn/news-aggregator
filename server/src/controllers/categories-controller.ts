import type { Request, Response } from "express";
import { Article } from "../models/article.ts";
import { memo } from "../services/cache/memory.ts";

export async function getCategories(_req: Request, res: Response) {
  try {
    const data = await memo(
      "categories:list",
      async () => {
        const cats = await Article.distinct("categories");
        return (cats as string[]).filter(Boolean).sort();
      },
      300_000,
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
