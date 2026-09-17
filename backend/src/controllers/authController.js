import bcrypt from "bcryptjs";
import database from "../config/database.js";
import { createToken } from "../middleware/auth.js";

const allowedRoles = new Set(["admin", "user"]);

export async function register(request, response) {
  const nombre = String(request.body.nombre || "").trim();
  const correo = String(request.body.correo || "").trim().toLowerCase();
  const password = String(request.body.password || "");
  const role = String(request.body.role || "user");
  const adminCode = String(request.body.adminCode || "");

  const fields = {};
  if (!nombre) fields.nombre = "El nombre es obligatorio.";
  if (!correo) fields.correo = "El correo es obligatorio.";
  if (password.length < 6) fields.password = "La contraseña debe tener mínimo 6 caracteres.";
  if (Object.keys(fields).length) return response.status(400).json({ error: "Revisa los campos marcados.", fields });
  if (!allowedRoles.has(role)) return response.status(400).json({ error: "El rol solicitado no es válido.", fields: { correo: "El rol seleccionado no es válido." } });
  if (role === "admin" && (!process.env.ADMIN_CODE || adminCode !== process.env.ADMIN_CODE)) return response.status(403).json({ error: "El código de administrador no es válido.", fields: { adminCode: "El código de administrador no es válido." } });

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const result = database.prepare("INSERT INTO users (nombre, correo, password_hash, role) VALUES (?, ?, ?, ?)").run(nombre, correo, passwordHash, role);
    const user = { id: result.lastInsertRowid, nombre, correo, role };
    return response.status(201).json({ user, token: createToken(user) });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") return response.status(409).json({ error: "Ese correo ya está registrado." });
    console.error("Error exacto al registrar usuario:", error);
    return response.status(500).json({ error: `No se pudo crear la cuenta: ${error.message}`, fields: { correo: `Error del servidor: ${error.message}` } });
  }
}

export async function login(request, response) {
  const correo = String(request.body.correo || "").trim().toLowerCase();
  const password = String(request.body.password || "");
  if (!correo) return response.status(400).json({ error: "El correo es obligatorio.", fields: { correo: "El correo es obligatorio." } });
  if (!password) return response.status(400).json({ error: "La contraseña es obligatoria.", fields: { password: "La contraseña es obligatoria." } });
  try {
    const user = database.prepare("SELECT id, nombre, correo, password_hash AS passwordHash, role FROM users WHERE correo = ?").get(correo);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) return response.status(401).json({ error: "Correo o contraseña incorrectos.", fields: { correo: "El correo o la contraseña no coinciden.", password: "El correo o la contraseña no coinciden." } });
    const publicUser = { id: user.id, nombre: user.nombre, correo: user.correo, role: user.role };
    return response.json({ user: publicUser, token: createToken(publicUser) });
  } catch (error) {
    console.error("Error exacto al iniciar sesión:", error);
    return response.status(500).json({ error: `Error del servidor: ${error.message}`, fields: { correo: `Error del servidor: ${error.message}` } });
  }
}

export function getCurrentUser(request, response) {
  const user = database.prepare("SELECT id, nombre, correo, role FROM users WHERE id = ?").get(request.user.id);
  if (!user) return response.status(404).json({ error: "Usuario no encontrado." });
  return response.json({ user });
}
