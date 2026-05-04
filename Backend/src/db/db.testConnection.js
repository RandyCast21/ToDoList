import { db } from "./db.supabase.js";

const test = async () => {
  const res = await db.query("SELECT NOW()");
  console.log("DB conectada:", res.rows);
};

test();