import {
  registerUser,
  loginUser,
  registerSchema,
  loginSchema,
  refreshTokenService,
} from "./auth.service.js";
import { formatZodError } from "../utils/zodErrorFormatter.js";
import { ZodError } from "zod";

///////////////
// HTTP Controllers
///////////////

// Registro de usuario
export const register = async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);

    const user = await registerUser(data);

    res.status(201).json({
      message: "Usuario creado",
      user,
    });
  } catch (error) {
    // 👇 ERROR DE ZOD
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: formatZodError(error),
      });
    }

    // 👇 ERROR NORMAL (login, DB, etc)
    res.status(400).json({
      error: error.message,
    });
  }
};

// Login de usuario
export const login = async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);

    const result = await loginUser(data);

    res.status(200).json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: formatZodError(error),
      });
    }

    // 👇 ERROR NORMAL (login, DB, etc)
    res.status(400).json({
      error: error.message,
    });
  }
};

// Refresh token
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const result = await refreshTokenService(refreshToken);

    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
