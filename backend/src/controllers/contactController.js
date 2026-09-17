import database from "../config/database.js";
import { validateContact } from "../utils/contactValidation.js";

function contactsFor(user) {
  return user.role === "admin"
    ? database.prepare("SELECT id, user_id AS userId, nombre, telefono, correo, etiqueta FROM contacts ORDER BY nombre COLLATE NOCASE").all()
    : database.prepare("SELECT id, user_id AS userId, nombre, telefono, correo, etiqueta FROM contacts WHERE user_id = ? ORDER BY nombre COLLATE NOCASE").all(user.id);
}

function contactScope(user, id) {
  return user.role === "admin" ? { query: "id = ?", parameters: [id] } : { query: "id = ? AND user_id = ?", parameters: [id, user.id] };
}

export function listContacts(request, response) {
  return response.json({ contacts: contactsFor(request.user) });
}

export function createContact(request, response) {
  const { contact, errors } = validateContact(request.body);
  if (Object.keys(errors).length) return response.status(400).json({ error: "Revisa los datos del contacto.", fields: errors });
  const result = database.prepare("INSERT INTO contacts (user_id, nombre, telefono, correo, etiqueta) VALUES (?, ?, ?, ?, ?)").run(request.user.id, contact.nombre, contact.telefono, contact.correo, contact.etiqueta);
  return response.status(201).json({ contact: { id: result.lastInsertRowid, userId: request.user.id, ...contact } });
}

export function updateContact(request, response) {
  const { contact, errors } = validateContact(request.body);
  if (Object.keys(errors).length) return response.status(400).json({ error: "Revisa los datos del contacto.", fields: errors });
  const scope = contactScope(request.user, request.params.id);
  const existing = database.prepare(`SELECT id, user_id AS userId FROM contacts WHERE ${scope.query}`).get(...scope.parameters);
  if (!existing) return response.status(404).json({ error: "Contacto no encontrado." });
  database.prepare("UPDATE contacts SET nombre = ?, telefono = ?, correo = ?, etiqueta = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(contact.nombre, contact.telefono, contact.correo, contact.etiqueta, request.params.id);
  return response.json({ contact: { id: Number(request.params.id), userId: existing.userId, ...contact } });
}

export function deleteContact(request, response) {
  const scope = contactScope(request.user, request.params.id);
  const result = database.prepare(`DELETE FROM contacts WHERE ${scope.query}`).run(...scope.parameters);
  if (!result.changes) return response.status(404).json({ error: "Contacto no encontrado." });
  return response.status(204).send();
}
