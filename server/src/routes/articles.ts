import { Router } from "express";
import {
  getArticleById,
  getArticles,
} from "../controllers/articles-controller.ts";

const router = Router();

router.get("/", getArticles);
router.get("/:id", getArticleById);

export default router;
