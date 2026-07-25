import { defineConfig } from "drizzle-kit";
import path from "path";
import {
  getMigrationConnectionString,
  isLocalConnection,
  stripSslMode,
} from "./src/connection-string";

const url = getMigrationConnectionString();
const isLocal = isLocalConnection(url);

export default defineConfig({
  schema: path.join(__dirname, "./src/schema/index.ts"),
  dialect: "postgresql",
  dbCredentials: {
    url: isLocal ? url : stripSslMode(url),
    ...(isLocal ? {} : { ssl: { rejectUnauthorized: false } }),
  },
});
