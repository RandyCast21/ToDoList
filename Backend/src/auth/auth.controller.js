import { registerUser, registerSchema } from "./auth.service.js";

export const register = async (req, res) => {
  try {
    // 1. validar input
    const data = registerSchema.parse(req.body);

    // 2. lógica de negocio
    const user = await registerUser(data);

    // 3. respuesta segura
    res.status(201).json({
      message: "Usuario creado",
      user,
    });

  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};