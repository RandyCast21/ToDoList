import { prisma } from "../db/db.prisma.js";

// Buscar usuario por email
export const findUserByEmail = async (email) => {
  return await prisma.users.findUnique({
    where: { email },
  });
};

// Buscar usuario por ID
export const findUserById = async (id) => {
  return await prisma.users.findUnique({
    where: { id },
  });
};

// Crear usuario completo
export const createUser = async (data) => {
  return await prisma.users.create({
    data: {
      username: data.username,
      email: data.email,
      password_hash: data.passwordHash,
      is_active: data.is_active ?? true,
    },
    select: {
      id: true,
      username: true,
      email: true,
      is_active: true,
      created_at: true,
    },
  });
};
