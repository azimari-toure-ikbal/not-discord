import { loadEnvConfig } from "@next/env";
import type { Config } from "drizzle-kit";
import { cwd } from "process";

loadEnvConfig(cwd());

export default {
  schema: "./lib/drizzle/schema/*",
  out: "./lib/drizzle/db/migrations",
  driver: "mysql2",
  dbCredentials: {
    connectionString: process.env.PLANETSCALE_DATABASE_URL!, // it exists, trust me
  },
  breakpoints: true,
} satisfies Config;
