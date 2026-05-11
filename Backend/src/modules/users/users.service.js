import { updateUsername } from "./users.reposPrisma.js";
import { z } from "zod";

export const changeUsernameService = async (userId, username) => {
  return await updateUsername(userId, username);
};

//////////////////
// Validaciones
//////////////////

//Esquema Cambio de Nombre de Usuario
export const changeUsernameSchema = z.object({
  username: z.string().min(1).max(25),
});
