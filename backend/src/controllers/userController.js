import database from "../config/database.js";

export function listUsers(_request, response) {
  const users = database.prepare("SELECT id, nombre, correo, role, created_at AS createdAt FROM users ORDER BY nombre COLLATE NOCASE").all();
  return response.json({ users });
}
