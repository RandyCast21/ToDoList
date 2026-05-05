import { registerUser, registerSchema } from "./auth.service.js";

export const register = async (req, res) => {
  try {
    // 1. validar input
    const data = registerSchema.parse(req.body);

    // 2. lógica
    const user = await registerUser(data.email, data.password);

    // 3. respuesta
    res.status(201).json({
      message: "Usuario Creado",
      user,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};
