import { z } from "zod";

import {
  createTaskRepo,
  findTaskById,
  updateTaskRepo,
  deleteTaskRepo,
  findRootProjects,
  findTasksByParentId,
} from "./tasks.reposPrisma.js";

//////////////////////
// ENUMS
//////////////////////

export const priorityEnum = z.enum(["low", "medium", "high"]);

export const statusEnum = z.enum(["todo", "in_progress", "done"]);

//////////////////////
// CREATE TASK
//////////////////////

export const createTaskSchema = z.object({
  ownerUser: z.string().uuid(),

  parent_id: z.string().uuid().nullable().optional(),

  title: z.string().min(1).max(120),

  description: z.string().max(2000).optional(),

  priority: priorityEnum.default("low"),

  difficulty: z.number().int().min(1).max(5),

  status: statusEnum.default("todo"),

  order_index: z.number().int().optional(),
});

//////////////////////
// UPDATE TASK
//////////////////////

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(120).optional(),

  description: z.string().max(2000).optional(),

  priority: priorityEnum.optional(),

  difficulty: z.number().int().min(1).max(5).optional(),

  status: statusEnum.optional(),

  order_index: z.number().int().optional(),
});

//////////////////////
// CREATE TASK
//////////////////////

export const createTaskService = async (data) => {
  const validatedData = createTaskSchema.parse(data);

  let depth = 0;

  // Si tiene padre -> calcular depth
  if (validatedData.parent_id) {
    const parentTask = await findTaskById(validatedData.parent_id);

    if (!parentTask) {
      throw new Error("Parent task no existe");
    }

    depth = parentTask.depth + 1;
  }

  const task = await createTaskRepo({
    ...validatedData,
    depth,
  });

  return task;
};

//////////////////////
// GET TASK
//////////////////////

export const getTaskByIdService = async (id) => {
  const task = await findTaskById(id);

  if (!task) {
    throw new Error("Task no encontrada");
  }

  return task;
};

//////////////////////
// UPDATE TASK
//////////////////////

export const updateTaskService = async (id, data) => {
  const validatedData = updateTaskSchema.parse(data);

  const existingTask = await findTaskById(id);

  if (!existingTask) {
    throw new Error("Task no encontrada");
  }

  const updatedTask = await updateTaskRepo(id, validatedData);

  return updatedTask;
};

//////////////////////
// DELETE TASK CASCADE
//////////////////////

const deleteTaskRecursive = async (taskId) => {
  // 1. obtener hijos
  const children = await findTasksByParentId(taskId);

  // 2. eliminar hijos recursivamente
  for (const child of children) {
    await deleteTaskRecursive(child.id);
  }

  // 3. eliminar task actual
  await deleteTaskRepo(taskId);
};

export const deleteTaskService = async (id) => {
  // verificar existencia
  const task = await findTaskById(id);

  if (!task) {
    throw new Error("Task no encontrada");
  }

  // eliminar árbol completo
  await deleteTaskRecursive(id);

  return true;
};

//////////////////////
// GET ROOT PROJECTS
//////////////////////

export const getProjectsService = async () => {
  return await findRootProjects();
};

//////////////////////
// BUILD TREE
//////////////////////

const buildTaskTree = async (task) => {
  const children = await findTasksByParentId(task.id);

  const childrenTree = await Promise.all(children.map(buildTaskTree));

  return {
    ...task,
    children: childrenTree,
  };
};

//////////////////////
// GET FULL TREE
//////////////////////

export const getFullTreeService = async (ownerId) => {
  const rootProjects = await findRootProjects(ownerId);

  const tree = await Promise.all(rootProjects.map(buildTaskTree));

  return tree;
};

//////////////////////
// GET CHILDREN
//////////////////////

export const getChildrenService = async (id) => {
  return await findTasksByParentId(id);
};

//////////////////////
// GET BREADCRUMB
//////////////////////

export const getBreadcrumbService = async (id) => {
  const breadcrumb = [];

  let currentTask = await findTaskById(id);

  if (!currentTask) {
    throw new Error("Task no encontrada");
  }

  while (currentTask) {
    breadcrumb.unshift(currentTask);

    if (!currentTask.parent_id) {
      break;
    }

    currentTask = await findTaskById(currentTask.parent_id);
  }

  return breadcrumb;
};
