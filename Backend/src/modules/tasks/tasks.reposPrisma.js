import { prisma } from "../../db/db.prisma.js";

//////////////////////
// CREATE
//////////////////////

export const createTaskRepo = async (data) => {
  return await prisma.tasks.create({
    data: {
      owner_user: data.ownerUser,
      parent_id: data.parent_id ?? null,
      title: data.title,
      description: data.description,
      priority: data.priority,
      difficulty: data.difficulty,
      status: data.status,
      order_index: data.order_index ?? 0,
      depth: data.depth,
    },
  });
};

//////////////////////
// READ - BY ID
//////////////////////

export const findTaskById = async (id) => {
  return await prisma.tasks.findUnique({
    where: { id },
  });
};

//////////////////////
// UPDATE
//////////////////////

export const updateTaskRepo = async (id, data) => {
  return await prisma.tasks.update({
    where: { id },
    data,
  });
};

//////////////////////
// DELETE
//////////////////////

export const deleteTaskRepo = async (id) => {
  return await prisma.tasks.delete({
    where: { id },
  });
};

//////////////////////
// GET ROOT PROJECTS
//////////////////////

export const findRootProjects = async (ownerId) => {
  return await prisma.tasks.findMany({
    where: {
      owner_user: ownerId,
      parent_id: null,
    },
    orderBy: {
      order_index: "asc",
    },
  });
};

//////////////////////
// GET CHILDREN
//////////////////////

export const findTasksByParentId = async (parentId) => {
  return await prisma.tasks.findMany({
    where: {
      parent_id: parentId,
    },
    orderBy: {
      order_index: "asc",
    },
  });
};
