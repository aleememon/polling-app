import "dotenv/config";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(process.env.DATABASE_URL!);

const keepDatabaseAlive = () => {
  const INTERVAL_MS = 10 * 60 * 1000;

  setInterval(async () => {
    try {
      await db.execute(sql`SELECT 1`);
      console.log("⚡ Database heartbeat sent: Neon compute node kept active.");
    } catch (error) {
      console.warn(
        "⚠️ Heartbeat failed (Database might be asleep or unreachable):",
        error,
      );
    }
  }, INTERVAL_MS);
};

keepDatabaseAlive();
