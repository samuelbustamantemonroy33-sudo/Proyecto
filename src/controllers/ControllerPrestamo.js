import { registrarPrestamo, listarPrestamos, modificarPrestamo, borrarPrestamo, consultarPrestamo, devolverPrestamo } from '../services/servicesPrestamo.js';

export const listar = (peticion, respuesta) => {
  listarPrestamos()
    .then((resultado) => respuesta.status(200).json(resultado))
    .catch((error) => respuesta.status(500).json({ mensaje: 'Error al obtener los préstamos', error: error.message }));
};

export const crear = (peticion, respuesta) => {
  registrarPrestamo(peticion.body)
    .then((nuevoRegistro) => respuesta.status(201).json(nuevoRegistro))
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al crear el préstamo', error: error.message }));
};

export const editar = (peticion, respuesta) => {
  const { id } = peticion.params;
  modificarPrestamo(peticion.body, id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return respuesta.status(404).json({ mensaje: 'Préstamo no encontrado o sin cambios' });
      respuesta.status(200).json({ mensaje: 'Préstamo actualizado correctamente' });
    })
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al actualizar el préstamo', error: error.message }));
};

export const eliminar = (peticion, respuesta) => {
  const { id } = peticion.params;
  borrarPrestamo(id)
    .then((filasEliminadas) => {
      if (filasEliminadas === 0) return respuesta.status(404).json({ mensaje: 'Préstamo no encontrado' });
      respuesta.status(200).json({ mensaje: 'Préstamo eliminado correctamente' });
    })
    .catch((error) => respuesta.status(500).json({ mensaje: 'Error al eliminar el préstamo', error: error.message }));
};

export const obtenerPorId = (peticion, respuesta) => {
  const { id } = peticion.params;
  consultarPrestamo(id)
    .then((resultado) => {
      if (!resultado) return respuesta.status(404).json({ mensaje: 'Préstamo no encontrado' });
      respuesta.status(200).json(resultado);
    })
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al buscar el préstamo', error: error.message }));
};

export const devolver = (peticion, respuesta) => {
  const { id } = peticion.params;
  devolverPrestamo(id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return respuesta.status(404).json({ mensaje: 'Préstamo no encontrado' });
      respuesta.status(200).json({ mensaje: 'Préstamo devuelto correctamente' });
    })
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al devolver el préstamo', error: error.message }));
};
