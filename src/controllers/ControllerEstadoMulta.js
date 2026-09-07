import { registrarEstadoMulta, listarEstadosMulta, modificarEstadoMulta, borrarEstadoMulta, consultarEstadoMultaNombre } from '../services/servicesEstadoMulta.js';

export const listar = (peticion, respuesta) => {
  listarEstadosMulta()
    .then((resultado) => respuesta.status(200).json(resultado))
    .catch((error) => respuesta.status(500).json({ mensaje: 'Error al obtener los estados de multa', error: error.message }));
};

export const crear = (peticion, respuesta) => {
  registrarEstadoMulta(peticion.body)
    .then((nuevoRegistro) => respuesta.status(201).json(nuevoRegistro))
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al crear el estado de la multa', error: error.message }));
};

export const editar = (peticion, respuesta) => {
  const { id } = peticion.params;
  modificarEstadoMulta(peticion.body, id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return respuesta.status(404).json({ mensaje: 'Estado de la multa no encontrado o sin cambios' });
      respuesta.status(200).json({ mensaje: 'Estado de la multa actualizado correctamente' });
    })
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al actualizar el estado de la multa', error: error.message }));
};

export const eliminar = (peticion, respuesta) => {
  const { id } = peticion.params;
  borrarEstadoMulta(id)
    .then((filasEliminadas) => {
      if (filasEliminadas === 0) return respuesta.status(404).json({ mensaje: 'Estado de la multa no encontrado' });
      respuesta.status(200).json({ mensaje: 'Estado de la multa eliminado correctamente' });
    })
    .catch((error) => respuesta.status(500).json({ mensaje: 'Error al eliminar el estado de la multa', error: error.message }));
};

export const buscarPorNombre = (peticion, respuesta) => {
  const { nombre } = peticion.query;
  consultarEstadoMultaNombre(nombre)
    .then((resultado) => {
      if (!resultado) return respuesta.status(404).json({ mensaje: 'Estado de la multa no encontrado' });
      respuesta.status(200).json(resultado);
    })
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al buscar el estado de la multa', error: error.message }));
};
