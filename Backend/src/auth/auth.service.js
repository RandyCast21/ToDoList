import bcrypt from "bcrypt";
import { z } from "zod";
import { findUserByEmail, createUser } from "./auth.repository.js";

// Registro de usuario
export const registerUser = async (email, password) => {
  // 1. verificar si existe
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("El Usuario ya existe");
  }

  // 2. hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // 3. guardar en DB
  const user = await createUser(email, hashedPassword);

  return user;
};

// Validación de Esquema
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
