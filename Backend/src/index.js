import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import usersRoutes from "./modules/users/users.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Auth
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
