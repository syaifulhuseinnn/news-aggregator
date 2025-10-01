import type { Request, Response } from "express";
import { Article } from "../models/article.ts";

export async function getArticles(req: Request, res: Response) {
  const page = Math.max(1, Number(req.query.page ?? 1));
  const limit = Math.max(1, Math.min(50, Number(req.query.limit ?? 10)));
  const category = (req.query.category as string) || "";
  const search = (req.query.search as string) || "";
  const key = `articles:list:${page}:${limit}:${category}:${search}`;
  const q: any = {};
  if (category) q.categories = category;
  if (search) q.$text = { $search: search };
  const total = await Article.countDocuments(q);
  const items = await Article.find(q)
    .sort({ publishedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
  const data = { page, limit, total, items };
  res.setHeader("X-Total-Count", total);
  res.json(data);
}
