import cron from "node-cron";
import fetchNewsApi from "./aggregator/newsapi.ts";
import { Article } from "../models/article.ts";
import fetchGuardian from "./aggregator/guardian.ts";

async function ingestOnce() {
  const batches = await Promise.all([fetchNewsApi(), fetchGuardian()]);
  const docs = batches.flat();
  for (const doc of docs) {
    await Article.updateOne(
      { contentHash: doc.contentHash },
      { $set: doc, $setOnInsert: { fetchedAt: new Date() } },
      { upsert: true },
    );
  }

  return { count: `Fetched ${docs.length} articles`, at: new Date() };
}

ingestOnce()
  .then((res) => console.log(res))
  .catch(console.error);

cron.schedule("*/30 * * * *", () => {
  console.log("Running a task every 30 minutes");
  ingestOnce()
    .then((res) => console.log(res))
    .catch(console.error);
});

export default ingestOnce;
