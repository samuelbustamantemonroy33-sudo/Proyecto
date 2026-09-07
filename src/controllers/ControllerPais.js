import { registrarPais, listarPaises, modificarPais, borrarPais, consultarPaisNombre } from '../services/servicesPais.js';

export const listar = (peticion, respuesta) => {
  listarPaises()
    .then((resultado) => respuesta.status(200).json(resultado))
    .catch((error) => respuesta.status(500).json({ mensaje: 'Error al obtener los países', error: error.message }));
};

export const crear = (peticion, respuesta) => {
  registrarPais(peticion.body)
    .then((nuevoRegistro) => respuesta.status(201).json(nuevoRegistro))
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al crear el país', error: error.message }));
};

export const editar = (peticion, respuesta) => {
  const { id } = peticion.params;
  modificarPais(peticion.body, id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return respuesta.status(404).json({ mensaje: 'País no encontrado o sin cambios' });
      respuesta.status(200).json({ mensaje: 'País actualizado correctamente' });
    })
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al actualizar el país', error: error.message }));
};

export const eliminar = (peticion, respuesta) => {
  const { id } = peticion.params;
  borrarPais(id)
    .then((filasEliminadas) => {
      if (filasEliminadas === 0) return respuesta.status(404).json({ mensaje: 'País no encontrado' });
      respuesta.status(200).json({ mensaje: 'País eliminado correctamente' });
    })
    .catch((error) => respuesta.status(500).json({ mensaje: 'Error al eliminar el país', error: error.message }));
};

export const buscarPorNombre = (peticion, respuesta) => {
  const { nombre } = peticion.query;
  consultarPaisNombre(nombre)
    .then((resultado) => {
      if (!resultado) return respuesta.status(404).json({ mensaje: 'País no encontrado' });
      respuesta.status(200).json(resultado);
    })
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al buscar el país', error: error.message }));
};
