import "dotenv/config";
import cors from "cors";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_request, response) => response.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/users", userRoutes);
app.use((_request, response) => response.status(404).json({ error: "Ruta no encontrada." }));
app.use((error, _request, response, _next) => {
	console.error("Error de API:", error);
	return response.status(500).json({ error: "Error interno del servidor." });
});

export default app;
