import { Pool } from "pg";
import "./env.js";
declare const pool: Pool;
declare const connectToDatabase: () => Promise<void>;
export { connectToDatabase, pool };
