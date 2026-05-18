import {
  createTaskService,
  getTaskByIdService,
  updateTaskService,
  deleteTaskService,
  getProjectsService,
  getFullTreeService,
  getChildrenService,
  getBreadcrumbService,
  createTaskSchema,
  updateTaskSchema,
} from "./tasks.service.js";

import { formatZodError } from "../../utils/zodErrorFormatter.js";
import { ZodError } from "zod";

//////////////////////
// CREATE
//////////////////////

export const createTask = async (req, res) => {
  try {
    const data = createTaskSchema.parse(req.body);

    const task = await createTaskService(data);

    res.status(201).json({
      message: "Task creada",
      task,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: formatZodError(error),
      });
    }

    res.status(400).json({
      error: error.message,
    });
  }
};

//////////////////////
// READ
//////////////////////

export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await getTaskByIdService(id);

    res.status(200).json(task);
  } catch (error) {
    res.status(404).json({
      error: error.message,
    });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await getProjectsService();

    res.status(200).json(projects);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

export const getFullTree = async (req, res) => {
  try {
    const { ownerId } = req.params;

    const tree = await getFullTreeService(ownerId);

    res.status(200).json(tree);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

export const getChildren = async (req, res) => {
  try {
    const { id } = req.params;

    const children = await getChildrenService(id);

    res.status(200).json(children);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

export const getBreadcrumb = async (req, res) => {
  try {
    const { id } = req.params;

    const breadcrumb = await getBreadcrumbService(id);

    res.status(200).json(breadcrumb);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

//////////////////////
// UPDATE
//////////////////////

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const data = updateTaskSchema.parse(req.body);

    const updatedTask = await updateTaskService(id, data);

    res.status(200).json({
      message: "Task actualizada",
      task: updatedTask,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: formatZodError(error),
      });
    }

    res.status(400).json({
      error: error.message,
    });
  }
};

//////////////////////
// DELETE
//////////////////////

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteTaskService(id);

    res.status(200).json({
      message: "Task eliminada",
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};
