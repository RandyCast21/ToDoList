import bcrypt from "bcrypt";
import { z } from "zod";
import jwt from "jsonwebtoken";

import {
  findUserByEmail,
  findUserById,
  createUser,
} from "./auth.reposPrisma.js";

//////////////////
// CRUD Auth
//////////////////

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
    is_active: true,
  });

  return user;
};

// Login User
export const loginUser = async (data) => {
  const { email, password } = data;

  // 1. buscar usuario
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("Usuario no existe");
  }

  // 2. comparar password
  const isValid = await bcrypt.compare(password, user.password_hash);

  if (!isValid) {
    throw new Error("Password incorrecto");
  }

  // 3. aquí se genera el JWT; Access para esta vez, refresh para la duracion
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
    },
  };
};

//////////////////
// Validaciones
//////////////////

//Esquema de Regristro
export const registerSchema = z.object({
  username: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

//////////////////
// JWT
//////////////////

// Creacion Access Token (Corto Plazo - Instancia Corta)
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );
};

//  Creacion Refresh Token (Largo Plazo - Instancia Larga)
export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
    },
    process.env.REFRESH_SECRET,
    {
      expiresIn: "15d",
    },
  );
};

// Validacion de Refresh Token y Generacion de nuevo Access Token
export const refreshTokenService = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Refresh token requerido");
  }

  try {
    // 1. validar refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    // 2. buscar usuario
    const user = await findUserById(decoded.id);

    if (!user) {
      throw new Error("Usuario no existe");
    }

    // 3. generar nuevo access token
    const newAccessToken = generateAccessToken(user);

    return {
      accessToken: newAccessToken,
    };
  } catch (err) {
    throw new Error("Refresh token inválido o expirado");
  }
};
