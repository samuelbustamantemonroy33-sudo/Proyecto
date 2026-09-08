import { registrarEstadoEjemplar, listarEstadosEjemplar, modificarEstadoEjemplar, borrarEstadoEjemplar, consultarEstadoEjemplarNombre } from '../services/servicesEstadoEjemplar.js';

export const listar = (req, res) => {
  listarEstadosEjemplar()
    .then((resultado) => res.status(200).json(resultado))
    .catch((error) => res.status(500).json({ mensaje: 'Error al obtener los estados de ejemplar', error: error.message }));
};

export const crear = (req, res) => {
  registrarEstadoEjemplar(req.body)
    .then((nuevoRegistro) => res.status(201).json(nuevoRegistro))
    .catch((error) => res.status(400).json({ mensaje: 'Error al crear el estado del ejemplar', error: error.message }));
};

export const editar = (req, res) => {
  const { id } = req.params;
  modificarEstadoEjemplar(req.body, id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return res.status(404).json({ mensaje: 'Estado del ejemplar no encontrado o sin cambios' });
      res.status(200).json({ mensaje: 'Estado del ejemplar actualizado correctamente' });
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al actualizar el estado del ejemplar', error: error.message }));
};

export const eliminar = (req, res) => {
  const { id } = req.params;
  borrarEstadoEjemplar(id)
    .then((filasEliminadas) => {
      if (filasEliminadas === 0) return res.status(404).json({ mensaje: 'Estado del ejemplar no encontrado' });
      res.status(200).json({ mensaje: 'Estado del ejemplar eliminado correctamente' });
    })
    .catch((error) => res.status(500).json({ mensaje: 'Error al eliminar el estado del ejemplar', error: error.message }));
};

export const buscarPorNombre = (req, res) => {
  const { nombre } = req.query;
  consultarEstadoEjemplarNombre(nombre)
    .then((resultado) => {
      if (!resultado) return res.status(404).json({ mensaje: 'Estado del ejemplar no encontrado' });
      res.status(200).json(resultado);
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al buscar el estado del ejemplar', error: error.message }));
};
