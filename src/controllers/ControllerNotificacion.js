import { registrarNotificacion, listarNotificaciones, modificarNotificacion, borrarNotificacion, consultarNotificacion, marcarNotificacionLeida } from '../services/servicesNotificacion.js';

export const listar = (peticion, respuesta) => {
  listarNotificaciones()
    .then((resultado) => respuesta.status(200).json(resultado))
    .catch((error) => respuesta.status(500).json({ mensaje: 'Error al obtener las notificaciones', error: error.message }));
};

export const crear = (peticion, respuesta) => {
  registrarNotificacion(peticion.body)
    .then((nuevoRegistro) => respuesta.status(201).json(nuevoRegistro))
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al crear la notificación', error: error.message }));
};

export const editar = (peticion, respuesta) => {
  const { id } = peticion.params;
  modificarNotificacion(peticion.body, id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return respuesta.status(404).json({ mensaje: 'Notificación no encontrada o sin cambios' });
      respuesta.status(200).json({ mensaje: 'Notificación actualizada correctamente' });
    })
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al actualizar la notificación', error: error.message }));
};

export const eliminar = (peticion, respuesta) => {
  const { id } = peticion.params;
  borrarNotificacion(id)
    .then((filasEliminadas) => {
      if (filasEliminadas === 0) return respuesta.status(404).json({ mensaje: 'Notificación no encontrada' });
      respuesta.status(200).json({ mensaje: 'Notificación eliminada correctamente' });
    })
    .catch((error) => respuesta.status(500).json({ mensaje: 'Error al eliminar la notificación', error: error.message }));
};

export const obtenerPorId = (peticion, respuesta) => {
  const { id } = peticion.params;
  consultarNotificacion(id)
    .then((resultado) => {
      if (!resultado) return respuesta.status(404).json({ mensaje: 'Notificación no encontrada' });
      respuesta.status(200).json(resultado);
    })
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al buscar la notificación', error: error.message }));
};

export const marcarLeida = (peticion, respuesta) => {
  const { id } = peticion.params;
  marcarNotificacionLeida(id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return respuesta.status(404).json({ mensaje: 'Notificación no encontrada' });
      respuesta.status(200).json({ mensaje: 'Notificación marcada como leída' });
    })
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al marcar la notificación como leída', error: error.message }));
};
