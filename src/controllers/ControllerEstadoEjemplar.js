import { registrarEstadoEjemplar, listarEstadosEjemplar, modificarEstadoEjemplar, borrarEstadoEjemplar, consultarEstadoEjemplarNombre } from '../services/servicesEstadoEjemplar.js';

export const listar = (peticion, respuesta) => {
  listarEstadosEjemplar()
    .then((resultado) => respuesta.status(200).json(resultado))
    .catch((error) => respuesta.status(500).json({ mensaje: 'Error al obtener los estados de ejemplar', error: error.message }));
};

export const crear = (peticion, respuesta) => {
  registrarEstadoEjemplar(peticion.body)
    .then((nuevoRegistro) => respuesta.status(201).json(nuevoRegistro))
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al crear el estado del ejemplar', error: error.message }));
};

export const editar = (peticion, respuesta) => {
  const { id } = peticion.params;
  modificarEstadoEjemplar(peticion.body, id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return respuesta.status(404).json({ mensaje: 'Estado del ejemplar no encontrado o sin cambios' });
      respuesta.status(200).json({ mensaje: 'Estado del ejemplar actualizado correctamente' });
    })
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al actualizar el estado del ejemplar', error: error.message }));
};

export const eliminar = (peticion, respuesta) => {
  const { id } = peticion.params;
  borrarEstadoEjemplar(id)
    .then((filasEliminadas) => {
      if (filasEliminadas === 0) return respuesta.status(404).json({ mensaje: 'Estado del ejemplar no encontrado' });
      respuesta.status(200).json({ mensaje: 'Estado del ejemplar eliminado correctamente' });
    })
    .catch((error) => respuesta.status(500).json({ mensaje: 'Error al eliminar el estado del ejemplar', error: error.message }));
};

export const buscarPorNombre = (peticion, respuesta) => {
  const { nombre } = peticion.query;
  consultarEstadoEjemplarNombre(nombre)
    .then((resultado) => {
      if (!resultado) return respuesta.status(404).json({ mensaje: 'Estado del ejemplar no encontrado' });
      respuesta.status(200).json(resultado);
    })
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al buscar el estado del ejemplar', error: error.message }));
};
