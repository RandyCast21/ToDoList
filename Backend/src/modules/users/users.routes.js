import express from "express";
import { changeUsername } from "./users.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.put("/username", authMiddleware, changeUsername);

export default router;
