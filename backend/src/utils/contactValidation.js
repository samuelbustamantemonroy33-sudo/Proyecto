export function validateContact(body) {
  const contact = {
    nombre: String(body.nombre || "").trim(),
    telefono: String(body.telefono || "").trim(),
    correo: String(body.correo || "").trim(),
    etiqueta: String(body.etiqueta || "").trim(),
  };
  const errors = {};
  if (!contact.nombre) errors.nombre = "El nombre es obligatorio.";
  if (!contact.telefono) errors.telefono = "El teléfono es obligatorio.";
  if (!contact.correo || !contact.correo.includes("@")) errors.correo = "El correo debe ser válido.";
  return { contact, errors };
}
