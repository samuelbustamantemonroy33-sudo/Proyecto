import { registrarTipoNotificacion, listarTiposNotificacion, modificarTipoNotificacion, borrarTipoNotificacion, consultarTipoNotificacionNombre } from '../services/servicesTipoNotificacion.js';

export const listar = (peticion, respuesta) => {
  listarTiposNotificacion()
    .then((resultado) => respuesta.status(200).json(resultado))
    .catch((error) => respuesta.status(500).json({ mensaje: 'Error al obtener los tipos de notificación', error: error.message }));
};

export const crear = (peticion, respuesta) => {
  registrarTipoNotificacion(peticion.body)
    .then((nuevoRegistro) => respuesta.status(201).json(nuevoRegistro))
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al crear el tipo de notificación', error: error.message }));
};

export const editar = (peticion, respuesta) => {
  const { id } = peticion.params;
  modificarTipoNotificacion(peticion.body, id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return respuesta.status(404).json({ mensaje: 'Tipo de notificación no encontrado o sin cambios' });
      respuesta.status(200).json({ mensaje: 'Tipo de notificación actualizado correctamente' });
    })
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al actualizar el tipo de notificación', error: error.message }));
};

export const eliminar = (peticion, respuesta) => {
  const { id } = peticion.params;
  borrarTipoNotificacion(id)
    .then((filasEliminadas) => {
      if (filasEliminadas === 0) return respuesta.status(404).json({ mensaje: 'Tipo de notificación no encontrado' });
      respuesta.status(200).json({ mensaje: 'Tipo de notificación eliminado correctamente' });
    })
    .catch((error) => respuesta.status(500).json({ mensaje: 'Error al eliminar el tipo de notificación', error: error.message }));
};

export const buscarPorNombre = (peticion, respuesta) => {
  const { nombre } = peticion.query;
  consultarTipoNotificacionNombre(nombre)
    .then((resultado) => {
      if (!resultado) return respuesta.status(404).json({ mensaje: 'Tipo de notificación no encontrado' });
      respuesta.status(200).json(resultado);
    })
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al buscar el tipo de notificación', error: error.message }));
};
