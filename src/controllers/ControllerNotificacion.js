import { registrarNotificacion, listarNotificaciones, modificarNotificacion, borrarNotificacion, consultarNotificacion, marcarNotificacionLeida } from '../services/servicesNotificacion.js';

export const listar = (req, res) => {
  listarNotificaciones()
    .then((resultado) => res.status(200).json(resultado))
    .catch((error) => res.status(500).json({ mensaje: 'Error al obtener las notificaciones', error: error.message }));
};

export const crear = (req, res) => {
  registrarNotificacion(req.body)
    .then((nuevoRegistro) => res.status(201).json(nuevoRegistro))
    .catch((error) => res.status(400).json({ mensaje: 'Error al crear la notificación', error: error.message }));
};

export const editar = (req, res) => {
  const { id } = req.params;
  modificarNotificacion(req.body, id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return res.status(404).json({ mensaje: 'Notificación no encontrada o sin cambios' });
      res.status(200).json({ mensaje: 'Notificación actualizada correctamente' });
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al actualizar la notificación', error: error.message }));
};

export const eliminar = (req, res) => {
  const { id } = req.params;
  borrarNotificacion(id)
    .then((filasEliminadas) => {
      if (filasEliminadas === 0) return res.status(404).json({ mensaje: 'Notificación no encontrada' });
      res.status(200).json({ mensaje: 'Notificación eliminada correctamente' });
    })
    .catch((error) => res.status(500).json({ mensaje: 'Error al eliminar la notificación', error: error.message }));
};

export const obtenerPorId = (req, res) => {
  const { id } = req.params;
  consultarNotificacion(id)
    .then((resultado) => {
      if (!resultado) return res.status(404).json({ mensaje: 'Notificación no encontrada' });
      res.status(200).json(resultado);
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al buscar la notificación', error: error.message }));
};

export const marcarLeida = (req, res) => {
  const { id } = req.params;
  marcarNotificacionLeida(id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return res.status(404).json({ mensaje: 'Notificación no encontrada' });
      res.status(200).json({ mensaje: 'Notificación marcada como leída' });
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al marcar la notificación como leída', error: error.message }));
};
