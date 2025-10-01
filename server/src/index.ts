import { CONFIG, MONGODB_URI } from "./config/config.ts";
import app from "./app.ts";
import mongoose from "mongoose";

async function main() {
  try {
    await mongoose.connect(MONGODB_URI);
    app.listen(CONFIG.PORT, () =>
      console.log(`Server is running on port ${CONFIG.PORT}`),
    );
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
