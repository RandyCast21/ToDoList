import { registerUser, registerSchema } from "./auth.service.js";
import { formatZodError } from "../utils/zodErrorFormatter.js";
import { ZodError } from "zod";

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