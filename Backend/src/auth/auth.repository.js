import { db } from "../db/supabase.db.js";

// Leer
export const findUserByEmail = async (email) => {
  const result = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  return result.rows[0];
};

// Crear
export const createUser = async (email, passwordHash) => {
  const result = await db.query(
    "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
    [email, passwordHash],
  );

  return result.rows[0];
};
