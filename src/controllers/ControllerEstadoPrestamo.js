import { registrarEstadoPrestamo, listarEstadosPrestamo, modificarEstadoPrestamo, borrarEstadoPrestamo, consultarEstadoPrestamoNombre } from '../services/servicesEstadoPrestamo.js';

export const listar = (peticion, respuesta) => {
  listarEstadosPrestamo()
    .then((resultado) => respuesta.status(200).json(resultado))
    .catch((error) => respuesta.status(500).json({ mensaje: 'Error al obtener los estados de préstamo', error: error.message }));
};

export const crear = (peticion, respuesta) => {
  registrarEstadoPrestamo(peticion.body)
    .then((nuevoRegistro) => respuesta.status(201).json(nuevoRegistro))
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al crear el estado del préstamo', error: error.message }));
};

export const editar = (peticion, respuesta) => {
  const { id } = peticion.params;
  modificarEstadoPrestamo(peticion.body, id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return respuesta.status(404).json({ mensaje: 'Estado del préstamo no encontrado o sin cambios' });
      respuesta.status(200).json({ mensaje: 'Estado del préstamo actualizado correctamente' });
    })
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al actualizar el estado del préstamo', error: error.message }));
};

export const eliminar = (peticion, respuesta) => {
  const { id } = peticion.params;
  borrarEstadoPrestamo(id)
    .then((filasEliminadas) => {
      if (filasEliminadas === 0) return respuesta.status(404).json({ mensaje: 'Estado del préstamo no encontrado' });
      respuesta.status(200).json({ mensaje: 'Estado del préstamo eliminado correctamente' });
    })
    .catch((error) => respuesta.status(500).json({ mensaje: 'Error al eliminar el estado del préstamo', error: error.message }));
};

export const buscarPorNombre = (peticion, respuesta) => {
  const { nombre } = peticion.query;
  consultarEstadoPrestamoNombre(nombre)
    .then((resultado) => {
      if (!resultado) return respuesta.status(404).json({ mensaje: 'Estado del préstamo no encontrado' });
      respuesta.status(200).json(resultado);
    })
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al buscar el estado del préstamo', error: error.message }));
};
