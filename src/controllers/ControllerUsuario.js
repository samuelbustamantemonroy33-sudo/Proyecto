import { registrarUsuario, listarUsuarios, modificarUsuario, borrarUsuario, buscarUsuarioPorCorreo } from '../services/servicesUsuario.js';

export const listar = (req, res) => {
  listarUsuarios()
    .then((resultado) => res.status(200).json(resultado))
    .catch((error) => res.status(500).json({ mensaje: 'Error al obtener los usuarios', error: error.message }));
};

export const crear = (req, res) => {
  registrarUsuario(req.body)
    .then((nuevoRegistro) => res.status(201).json(nuevoRegistro))
    .catch((error) => res.status(400).json({ mensaje: 'Error al crear el usuario', error: error.message }));
};

export const editar = (req, res) => {
  const { id } = req.params;
  modificarUsuario(req.body, id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado o sin cambios' });
      res.status(200).json({ mensaje: 'Usuario actualizado correctamente' });
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al actualizar el usuario', error: error.message }));
};

export const eliminar = (req, res) => {
  const { id } = req.params;
  borrarUsuario(id)
    .then((filasEliminadas) => {
      if (filasEliminadas === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      res.status(200).json({ mensaje: 'Usuario eliminado correctamente' });
    })
    .catch((error) => res.status(500).json({ mensaje: 'Error al eliminar el usuario', error: error.message }));
};

export const buscarPorCorreo = (req, res) => {
  const { correo } = req.query;
  buscarUsuarioPorCorreo(correo)
    .then((resultado) => {
      if (!resultado) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      res.status(200).json(resultado);
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al buscar el usuario', error: error.message }));
};
