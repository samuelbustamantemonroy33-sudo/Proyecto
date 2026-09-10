const text = (name, label, required = false, extra = {}) => ({ name, label, type: "text", required, ...extra });
const date = (name, label, required = false) => ({ name, label, type: "date", required });
const number = (name, label, required = false) => ({ name, label, type: "number", required });
const relation = (name, label, entity, required = false) => ({ name, label, type: "relation", required, relation: entity });
const textarea = (name, label, required = false) => ({ name, label, type: "textarea", required });

export const entities = [
  { key: "libros", label: "Libros", endpoint: "/libros/", displayField: "titulo", fields: [text("titulo", "Título", true), text("isbn", "ISBN", true), number("anio_publicacion", "Año de publicación", true), number("num_paginas", "Páginas", true), textarea("sinopsis", "Sinopsis"), relation("id_editorial", "Editorial", "editoriales"), relation("id_idioma", "Idioma", "idiomas")], special: "book" },
  { key: "autores", label: "Autores", endpoint: "/autores/", displayField: "nombre", fields: [text("nombre", "Nombre", true), text("apellido", "Apellido", true), text("nacionalidad", "Nacionalidad"), date("fecha_nacimiento", "Fecha de nacimiento"), textarea("biografia", "Biografía")] },
  { key: "editoriales", label: "Editoriales", endpoint: "/editoriales/", displayField: "nombre_editorial", fields: [text("nombre_editorial", "Nombre", true), text("telefono", "Teléfono"), text("email", "Correo electrónico", false, { inputType: "email" }), text("pagina_web", "Página web"), relation("id_pais", "País", "paises")] },
  { key: "categorias", label: "Categorías", endpoint: "/categorias/", displayField: "nombre", fields: [text("nombre", "Nombre", true), textarea("descripcion", "Descripción")] },
  { key: "idiomas", label: "Idiomas", endpoint: "/idiomas/", displayField: "nombre", fields: [text("nombre", "Nombre", true)] },
  { key: "paises", label: "Países", endpoint: "/paises/", displayField: "nombre_pais", fields: [text("nombre_pais", "Nombre", true)] },
  { key: "ejemplares", label: "Ejemplares", endpoint: "/ejemplares/", displayField: "codigo_inventario", fields: [text("codigo_inventario", "Código de inventario", true), text("ubicacion_estante", "Ubicación"), date("fecha_adquisicion", "Fecha de adquisición"), text("codigo_barras", "Código de barras"), relation("id_libro", "Libro", "libros"), relation("id_estado_ejemplar", "Estado", "estados_ejemplar")] },
  { key: "prestamos", label: "Préstamos", endpoint: "/prestamos/", displayField: "fecha_prestamo", fields: [date("fecha_prestamo", "Fecha de préstamo", true), date("fecha_devolucion_esperada", "Devolución esperada", true), date("fecha_devolucion_real", "Devolución real"), textarea("observaciones", "Observaciones"), relation("id_ejemplar", "Ejemplar", "ejemplares"), relation("id_cliente", "Cliente", "usuarios"), relation("id_registrado_por", "Registrado por", "usuarios"), relation("id_estado_prestamo", "Estado", "estados_prestamo")], special: "loan" },
  { key: "reservas", label: "Reservas", endpoint: "/reservas/", displayField: "fecha_reserva", fields: [date("fecha_reserva", "Fecha de reserva", true), date("fecha_expiracion", "Fecha de expiración", true), relation("id_libro", "Libro", "libros"), relation("id_cliente", "Cliente", "usuarios"), relation("id_estado_reserva", "Estado", "estados_reserva")], special: "reservation" },
  { key: "multas", label: "Multas", endpoint: "/multas/", displayField: "motivo", fields: [number("monto", "Monto", true), text("motivo", "Motivo", true), date("fecha_generada", "Fecha generada", true), date("fecha_pago", "Fecha de pago"), relation("id_prestamo", "Préstamo", "prestamos"), relation("id_estado_multa", "Estado", "estados_multa")], special: "fine" },
  { key: "notificaciones", label: "Notificaciones", endpoint: "/notificaciones/", displayField: "mensaje", fields: [textarea("mensaje", "Mensaje", true), number("referencia_id", "ID de referencia"), text("tipo_referencia", "Tipo de referencia"), date("fecha_envio", "Fecha de envío"), { name: "leida", label: "Leída", type: "boolean", required: false }, relation("id_cliente", "Cliente", "usuarios"), relation("id_tipo_notificacion", "Tipo", "tipos_notificacion")], special: "notification" },
  { key: "usuarios", label: "Usuarios", endpoint: "/usuarios/", displayField: "nombre", fields: [text("numero_documento", "Número de documento", true), text("nombre", "Primer nombre", true), text("segundo_nombre", "Segundo nombre"), text("primer_apellido", "Primer apellido", true), text("segundo_apellido", "Segundo apellido"), text("telefono", "Teléfono", true), text("email", "Correo electrónico", true, { inputType: "email" }), text("direccion", "Dirección", true), date("fecha_registro", "Fecha de registro", true), relation("id_rol", "Rol", "roles"), relation("id_tipo_documento", "Tipo de documento", "tipos_documento"), relation("id_estado_cliente", "Estado", "estados_usuario")] },
  { key: "roles", label: "Roles", endpoint: "/roles/", displayField: "nombre_rol", fields: [text("nombre_rol", "Nombre", true), textarea("descripcion_rol", "Descripción")] },
  { key: "tipos_documento", label: "Tipos de documento", endpoint: "/tipos_documento/", displayField: "nombre", fields: [text("codigo", "Código", true, { maxLength: 5 }), text("nombre", "Nombre", true)] },
  { key: "tipos_notificacion", label: "Tipos de notificación", endpoint: "/tipos_notificacion/", displayField: "nombre", fields: [text("nombre", "Nombre", true)] },
  { key: "estados_usuario", label: "Estados de usuario", endpoint: "/estados_usuario/", displayField: "nombre_estado_usuario", fields: [text("nombre_estado_usuario", "Nombre", true)] },
  { key: "estados_ejemplar", label: "Estados de ejemplar", endpoint: "/estados_ejemplar/", displayField: "nombre_estado", fields: [text("nombre_estado", "Nombre", true)] },
  { key: "estados_prestamo", label: "Estados de préstamo", endpoint: "/estados_prestamo/", displayField: "nombre_estado", fields: [text("nombre_estado", "Nombre", true)] },
  { key: "estados_reserva", label: "Estados de reserva", endpoint: "/estados_reserva/", displayField: "nombre_estado", fields: [text("nombre_estado", "Nombre", true)] },
  { key: "estados_multa", label: "Estados de multa", endpoint: "/estados_multa/", displayField: "nombre_estado", fields: [text("nombre_estado", "Nombre", true)] }
];

export const entityByKey = Object.fromEntries(entities.map((entity) => [entity.key, entity]));

export const navigationGroups = [
  { label: "Catálogo", items: ["libros", "autores", "editoriales", "categorias", "idiomas", "paises"] },
  { label: "Inventario", items: ["ejemplares"] },
  { label: "Operaciones", items: ["prestamos", "reservas", "multas", "notificaciones"] },
  { label: "Administración", items: ["usuarios", "roles", "tipos_documento", "tipos_notificacion"] },
  { label: "Estados", items: ["estados_usuario", "estados_ejemplar", "estados_prestamo", "estados_reserva", "estados_multa"] }
];
