import { registrarIdioma, listarIdiomas, modificarIdioma, borrarIdioma, consultarIdiomaNombre } from '../services/servicesIdioma.js';

export const listar = (peticion, respuesta) => {
  listarIdiomas()
    .then((resultado) => respuesta.status(200).json(resultado))
    .catch((error) => respuesta.status(500).json({ mensaje: 'Error al obtener los idiomas', error: error.message }));
};

export const crear = (peticion, respuesta) => {
  registrarIdioma(peticion.body)
    .then((nuevoRegistro) => respuesta.status(201).json(nuevoRegistro))
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al crear el idioma', error: error.message }));
};

export const editar = (peticion, respuesta) => {
  const { id } = peticion.params;
  modificarIdioma(peticion.body, id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return respuesta.status(404).json({ mensaje: 'Idioma no encontrado o sin cambios' });
      respuesta.status(200).json({ mensaje: 'Idioma actualizado correctamente' });
    })
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al actualizar el idioma', error: error.message }));
};

export const eliminar = (peticion, respuesta) => {
  const { id } = peticion.params;
  borrarIdioma(id)
    .then((filasEliminadas) => {
      if (filasEliminadas === 0) return respuesta.status(404).json({ mensaje: 'Idioma no encontrado' });
      respuesta.status(200).json({ mensaje: 'Idioma eliminado correctamente' });
    })
    .catch((error) => respuesta.status(500).json({ mensaje: 'Error al eliminar el idioma', error: error.message }));
};

export const buscarPorNombre = (peticion, respuesta) => {
  const { nombre } = peticion.query;
  consultarIdiomaNombre(nombre)
    .then((resultado) => {
      if (!resultado) return respuesta.status(404).json({ mensaje: 'Idioma no encontrado' });
      respuesta.status(200).json(resultado);
    })
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al buscar el idioma', error: error.message }));
};
