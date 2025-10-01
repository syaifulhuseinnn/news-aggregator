import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema(
  {
    source: { type: String, required: true },
    title: { type: String, required: true },
    summary: { type: String },
    url: { type: String, required: true },
    imageUrl: { type: String },
    publishedAt: { type: Date, required: true },
    categories: [{ type: String }],
    authors: [{ type: String }],
    contentHash: { type: String, index: true, unique: true },
    fetchedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export type ArticleDoc = mongoose.InferSchemaType<typeof ArticleSchema> & {
  _id: mongoose.Types.ObjectId;
};
export const Article = mongoose.model("Article", ArticleSchema);
