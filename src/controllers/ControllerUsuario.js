import { registrarUsuario, listarUsuarios, modificarUsuario, borrarUsuario, buscarUsuarioPorCorreo } from '../services/servicesUsuario.js';

export const listar = (peticion, respuesta) => {
  listarUsuarios()
    .then((resultado) => respuesta.status(200).json(resultado))
    .catch((error) => respuesta.status(500).json({ mensaje: 'Error al obtener los usuarios', error: error.message }));
};

export const crear = (peticion, respuesta) => {
  registrarUsuario(peticion.body)
    .then((nuevoRegistro) => respuesta.status(201).json(nuevoRegistro))
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al crear el usuario', error: error.message }));
};

export const editar = (peticion, respuesta) => {
  const { id } = peticion.params;
  modificarUsuario(peticion.body, id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return respuesta.status(404).json({ mensaje: 'Usuario no encontrado o sin cambios' });
      respuesta.status(200).json({ mensaje: 'Usuario actualizado correctamente' });
    })
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al actualizar el usuario', error: error.message }));
};

export const eliminar = (peticion, respuesta) => {
  const { id } = peticion.params;
  borrarUsuario(id)
    .then((filasEliminadas) => {
      if (filasEliminadas === 0) return respuesta.status(404).json({ mensaje: 'Usuario no encontrado' });
      respuesta.status(200).json({ mensaje: 'Usuario eliminado correctamente' });
    })
    .catch((error) => respuesta.status(500).json({ mensaje: 'Error al eliminar el usuario', error: error.message }));
};

export const buscarPorCorreo = (peticion, respuesta) => {
  const { correo } = peticion.query;
  buscarUsuarioPorCorreo(correo)
    .then((resultado) => {
      if (!resultado) return respuesta.status(404).json({ mensaje: 'Usuario no encontrado' });
      respuesta.status(200).json(resultado);
    })
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al buscar el usuario', error: error.message }));
};
