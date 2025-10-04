import type { Request, Response } from "express";
import { Article } from "../models/article.js";
import { memo } from "../services/cache/memory.js";

export async function getArticles(req: Request, res: Response) {
  const page = Math.max(1, Number(req.query.page ?? 1));
  const limit = Math.max(1, Math.min(50, Number(req.query.limit ?? 10)));
  const category = (req.query.category as string) || "";
  const search = (req.query.search as string) || "";
  const key = `articles:list:${page}:${limit}:${category}:${search}`;
  const data = await memo(
    key,
    async () => {
      const q: any = {};
      if (category) q.categories = category;
      if (search) q.$text = { $search: search };
      const total = await Article.countDocuments(q);
      const items = await Article.find(q)
        .sort({ publishedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
      return { page, limit, total, items };
    },
    60_000,
  );

  res.setHeader("X-Total-Count", data.total);
  res.json(data);
}

export async function getArticleById(req: Request, res: Response) {
  const id = req.params.id;
  const key = `articles:detail:${id}`;
  const data = await memo(
    key,
    async () => {
      const doc = await Article.findById(id).lean();
      if (!doc) return null;
      return doc;
    },
    60_000,
  );
  if (!data) return res.status(404).json({ message: "Article not found" });
  res.json(data);
}
