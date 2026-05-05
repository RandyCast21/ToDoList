import bcrypt from "bcrypt";
import { z } from "zod";
import { findUserByEmail, createUser } from "./auth.reposPrisma.js";

// Registro de usuario
export const registerUser = async (data) => {
  const { username, email, password } = data;

  // 1. verificar si existe
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("El usuario ya existe");
  }

  // 2. hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. crear usuario completo
  const user = await createUser({
    username,
    email,
    passwordHash: hashedPassword,
    is_active: true
  });

  return user;
};

// Schema de validación (contrato de entrada)
export const registerSchema = z.object({
  username: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});