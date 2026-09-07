import { registrarEstadoUsuario, listarEstadosUsuario, modificarEstadoUsuario, borrarEstadoUsuario, consultarEstadoUsuarioNombre } from '../services/servicesEstadoUsuario.js';

export const listar = (peticion, respuesta) => {
  listarEstadosUsuario()
    .then((resultado) => respuesta.status(200).json(resultado))
    .catch((error) => respuesta.status(500).json({ mensaje: 'Error al obtener los estados de usuario', error: error.message }));
};

export const crear = (peticion, respuesta) => {
  registrarEstadoUsuario(peticion.body)
    .then((nuevoRegistro) => respuesta.status(201).json(nuevoRegistro))
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al crear el estado del usuario', error: error.message }));
};

export const editar = (peticion, respuesta) => {
  const { id } = peticion.params;
  modificarEstadoUsuario(peticion.body, id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return respuesta.status(404).json({ mensaje: 'Estado del usuario no encontrado o sin cambios' });
      respuesta.status(200).json({ mensaje: 'Estado del usuario actualizado correctamente' });
    })
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al actualizar el estado del usuario', error: error.message }));
};

export const eliminar = (peticion, respuesta) => {
  const { id } = peticion.params;
  borrarEstadoUsuario(id)
    .then((filasEliminadas) => {
      if (filasEliminadas === 0) return respuesta.status(404).json({ mensaje: 'Estado del usuario no encontrado' });
      respuesta.status(200).json({ mensaje: 'Estado del usuario eliminado correctamente' });
    })
    .catch((error) => respuesta.status(500).json({ mensaje: 'Error al eliminar el estado del usuario', error: error.message }));
};

export const buscarPorNombre = (peticion, respuesta) => {
  const { nombre } = peticion.query;
  consultarEstadoUsuarioNombre(nombre)
    .then((resultado) => {
      if (!resultado) return respuesta.status(404).json({ mensaje: 'Estado del usuario no encontrado' });
      respuesta.status(200).json(resultado);
    })
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al buscar el estado del usuario', error: error.message }));
};
