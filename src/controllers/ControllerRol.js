import { registrarRol, listarRoles, modificarRol, borrarRol, consultarRolNombre } from '../services/servicesRol.js';

export const listar = (req, res) => {
  listarRoles()
    .then((resultado) => res.status(200).json(resultado))
    .catch((error) => res.status(500).json({ mensaje: 'Error al obtener los roles', error: error.message }));
};

export const crear = (req, res) => {
  registrarRol(req.body)
    .then((nuevoRegistro) => res.status(201).json(nuevoRegistro))
    .catch((error) => res.status(400).json({ mensaje: 'Error al crear el rol', error: error.message }));
};

export const editar = (req, res) => {
  const { id } = req.params;
  modificarRol(req.body, id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return res.status(404).json({ mensaje: 'Rol no encontrado o sin cambios' });
      res.status(200).json({ mensaje: 'Rol actualizado correctamente' });
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al actualizar el rol', error: error.message }));
};

export const eliminar = (req, res) => {
  const { id } = req.params;
  borrarRol(id)
    .then((filasEliminadas) => {
      if (filasEliminadas === 0) return res.status(404).json({ mensaje: 'Rol no encontrado' });
      res.status(200).json({ mensaje: 'Rol eliminado correctamente' });
    })
    .catch((error) => res.status(500).json({ mensaje: 'Error al eliminar el rol', error: error.message }));
};

export const buscarPorNombre = (req, res) => {
  const { nombre } = req.query;
  consultarRolNombre(nombre)
    .then((resultado) => {
      if (!resultado) return res.status(404).json({ mensaje: 'Rol no encontrado' });
      res.status(200).json(resultado);
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al buscar el rol', error: error.message }));
};
