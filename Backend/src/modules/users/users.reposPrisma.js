import { prisma } from "../../db/db.prisma.js";

// Actualizar el nombre de usuario
export const updateUsername = async (userId, username) => {
  return await prisma.users.update({
    where: { id: userId },
    data: { username },
    select: {
      id: true,
      username: true,
      email: true,
    },
  });
};
