import { registrarEstadoUsuario, listarEstadosUsuario, modificarEstadoUsuario, borrarEstadoUsuario, consultarEstadoUsuarioNombre } from '../services/servicesEstadoUsuario.js';

export const listar = (req, res) => {
  listarEstadosUsuario()
    .then((resultado) => res.status(200).json(resultado))
    .catch((error) => res.status(500).json({ mensaje: 'Error al obtener los estados de usuario', error: error.message }));
};

export const crear = (req, res) => {
  registrarEstadoUsuario(req.body)
    .then((nuevoRegistro) => res.status(201).json(nuevoRegistro))
    .catch((error) => res.status(400).json({ mensaje: 'Error al crear el estado del usuario', error: error.message }));
};

export const editar = (req, res) => {
  const { id } = req.params;
  modificarEstadoUsuario(req.body, id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return res.status(404).json({ mensaje: 'Estado del usuario no encontrado o sin cambios' });
      res.status(200).json({ mensaje: 'Estado del usuario actualizado correctamente' });
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al actualizar el estado del usuario', error: error.message }));
};

export const eliminar = (req, res) => {
  const { id } = req.params;
  borrarEstadoUsuario(id)
    .then((filasEliminadas) => {
      if (filasEliminadas === 0) return res.status(404).json({ mensaje: 'Estado del usuario no encontrado' });
      res.status(200).json({ mensaje: 'Estado del usuario eliminado correctamente' });
    })
    .catch((error) => res.status(500).json({ mensaje: 'Error al eliminar el estado del usuario', error: error.message }));
};

export const buscarPorNombre = (req, res) => {
  const { nombre } = req.query;
  consultarEstadoUsuarioNombre(nombre)
    .then((resultado) => {
      if (!resultado) return res.status(404).json({ mensaje: 'Estado del usuario no encontrado' });
      res.status(200).json(resultado);
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al buscar el estado del usuario', error: error.message }));
};
