import express from "express";
import {
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  getProjects,
  getFullTree,
  getChildren,
  getBreadcrumb,
} from "./tasks.controller.js";

const router = express.Router();

// CREATE
router.post("/tasks", createTask);

// READ (Debe haber jerarquía para que no tome como id la ruta)
router.get("/tasks/projects", getProjects);
router.get("/tasks/tree/:ownerId", getFullTree);
router.get("/tasks/:id", getTaskById);
router.get("/tasks/:id/children", getChildren);
router.get("/tasks/:id/breadcrumb", getBreadcrumb);

// UPDATE
router.put("/tasks/:id", updateTask);

// DELETE
router.delete("/tasks/:id", deleteTask);

export default router;
