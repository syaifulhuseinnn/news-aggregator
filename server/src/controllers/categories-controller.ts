import type { Request, Response } from "express";
import { Article } from "../models/article.ts";

export async function getCategories(req: Request, res: Response) {
  const categories = (await Article.distinct("categories"))
    .filter(Boolean)
    .sort();
  res.json(categories);
}
