import { registrarEjemplar, listarEjemplares, modificarEjemplar, borrarEjemplar, consultarEjemplarCodigo } from '../services/servicesEjemplar.js';

export const listar = (peticion, respuesta) => {
  listarEjemplares()
    .then((resultado) => respuesta.status(200).json(resultado))
    .catch((error) => respuesta.status(500).json({ mensaje: 'Error al obtener los ejemplares', error: error.message }));
};

export const crear = (peticion, respuesta) => {
  registrarEjemplar(peticion.body)
    .then((nuevoRegistro) => respuesta.status(201).json(nuevoRegistro))
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al crear el ejemplar', error: error.message }));
};

export const editar = (peticion, respuesta) => {
  const { id } = peticion.params;
  modificarEjemplar(peticion.body, id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return respuesta.status(404).json({ mensaje: 'Ejemplar no encontrado o sin cambios' });
      respuesta.status(200).json({ mensaje: 'Ejemplar actualizado correctamente' });
    })
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al actualizar el ejemplar', error: error.message }));
};

export const eliminar = (peticion, respuesta) => {
  const { id } = peticion.params;
  borrarEjemplar(id)
    .then((filasEliminadas) => {
      if (filasEliminadas === 0) return respuesta.status(404).json({ mensaje: 'Ejemplar no encontrado' });
      respuesta.status(200).json({ mensaje: 'Ejemplar eliminado correctamente' });
    })
    .catch((error) => respuesta.status(500).json({ mensaje: 'Error al eliminar el ejemplar', error: error.message }));
};

export const buscarPorCodigo = (peticion, respuesta) => {
  const { codigo } = peticion.query;
  consultarEjemplarCodigo(codigo)
    .then((resultado) => {
      if (!resultado) return respuesta.status(404).json({ mensaje: 'Ejemplar no encontrado' });
      respuesta.status(200).json(resultado);
    })
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al buscar el ejemplar', error: error.message }));
};
