import {
  changeUsernameSchema,
  changeUsernameService,
} from "./users.service.js";
import { formatZodError } from "../../utils/zodErrorFormatter.js";
import { ZodError } from "zod";

export const changeUsername = async (req, res) => {
  try {
    const { username } = changeUsernameSchema.parse(req.body);
    const userId = req.user.id;
    const result = await changeUsernameService(userId, username);

    res.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: formatZodError(error),
      });
    }

    res.status(400).json({ error: error.message });
  }
};
