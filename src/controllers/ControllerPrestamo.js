import { registrarPrestamo, listarPrestamos, modificarPrestamo, borrarPrestamo, consultarPrestamo, devolverPrestamo } from '../services/servicesPrestamo.js';

export const listar = (req, res) => {
  listarPrestamos()
    .then((resultado) => res.status(200).json(resultado))
    .catch((error) => res.status(500).json({ mensaje: 'Error al obtener los préstamos', error: error.message }));
};

export const crear = (req, res) => {
  registrarPrestamo(req.body)
    .then((nuevoRegistro) => res.status(201).json(nuevoRegistro))
    .catch((error) => res.status(400).json({ mensaje: 'Error al crear el préstamo', error: error.message }));
};

export const editar = (req, res) => {
  const { id } = req.params;
  modificarPrestamo(req.body, id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return res.status(404).json({ mensaje: 'Préstamo no encontrado o sin cambios' });
      res.status(200).json({ mensaje: 'Préstamo actualizado correctamente' });
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al actualizar el préstamo', error: error.message }));
};

export const eliminar = (req, res) => {
  const { id } = req.params;
  borrarPrestamo(id)
    .then((filasEliminadas) => {
      if (filasEliminadas === 0) return res.status(404).json({ mensaje: 'Préstamo no encontrado' });
      res.status(200).json({ mensaje: 'Préstamo eliminado correctamente' });
    })
    .catch((error) => res.status(500).json({ mensaje: 'Error al eliminar el préstamo', error: error.message }));
};

export const obtenerPorId = (req, res) => {
  const { id } = req.params;
  consultarPrestamo(id)
    .then((resultado) => {
      if (!resultado) return res.status(404).json({ mensaje: 'Préstamo no encontrado' });
      res.status(200).json(resultado);
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al buscar el préstamo', error: error.message }));
};

export const devolver = (req, res) => {
  const { id } = req.params;
  devolverPrestamo(id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return res.status(404).json({ mensaje: 'Préstamo no encontrado' });
      res.status(200).json({ mensaje: 'Préstamo devuelto correctamente' });
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al devolver el préstamo', error: error.message }));
};
