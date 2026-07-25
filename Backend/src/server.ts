import "dotenv/config";

console.log("1. Env loaded");

import app from "./app";
import { connectDB } from "./config/db";

console.log("2. Imports loaded");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("3. Connecting DB...");

    await connectDB();

    console.log("4. DB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server Start Error:", error);
  }
};

startServer();