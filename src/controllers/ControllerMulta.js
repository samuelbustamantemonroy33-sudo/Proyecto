import { registrarMulta, listarMultas, modificarMulta, borrarMulta, consultarMulta } from '../services/servicesMulta.js';

export const listar = (peticion, respuesta) => {
  listarMultas()
    .then((resultado) => respuesta.status(200).json(resultado))
    .catch((error) => respuesta.status(500).json({ mensaje: 'Error al obtener las multas', error: error.message }));
};

export const crear = (peticion, respuesta) => {
  registrarMulta(peticion.body)
    .then((nuevoRegistro) => respuesta.status(201).json(nuevoRegistro))
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al crear la multa', error: error.message }));
};

export const editar = (peticion, respuesta) => {
  const { id } = peticion.params;
  modificarMulta(peticion.body, id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return respuesta.status(404).json({ mensaje: 'Multa no encontrada o sin cambios' });
      respuesta.status(200).json({ mensaje: 'Multa actualizada correctamente' });
    })
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al actualizar la multa', error: error.message }));
};

export const eliminar = (peticion, respuesta) => {
  const { id } = peticion.params;
  borrarMulta(id)
    .then((filasEliminadas) => {
      if (filasEliminadas === 0) return respuesta.status(404).json({ mensaje: 'Multa no encontrada' });
      respuesta.status(200).json({ mensaje: 'Multa eliminada correctamente' });
    })
    .catch((error) => respuesta.status(500).json({ mensaje: 'Error al eliminar la multa', error: error.message }));
};

export const obtenerPorId = (peticion, respuesta) => {
  const { id } = peticion.params;
  consultarMulta(id)
    .then((resultado) => {
      if (!resultado) return respuesta.status(404).json({ mensaje: 'Multa no encontrada' });
      respuesta.status(200).json(resultado);
    })
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al buscar la multa', error: error.message }));
};
