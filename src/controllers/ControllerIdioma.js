import { registrarIdioma, listarIdiomas, modificarIdioma, borrarIdioma, consultarIdiomaNombre } from '../services/servicesIdioma.js';

export const listar = (req, res) => {
  listarIdiomas()
    .then((resultado) => res.status(200).json(resultado))
    .catch((error) => res.status(500).json({ mensaje: 'Error al obtener los idiomas', error: error.message }));
};

export const crear = (req, res) => {
  registrarIdioma(req.body)
    .then((nuevoRegistro) => res.status(201).json(nuevoRegistro))
    .catch((error) => res.status(400).json({ mensaje: 'Error al crear el idioma', error: error.message }));
};

export const editar = (req, res) => {
  const { id } = req.params;
  modificarIdioma(req.body, id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return res.status(404).json({ mensaje: 'Idioma no encontrado o sin cambios' });
      res.status(200).json({ mensaje: 'Idioma actualizado correctamente' });
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al actualizar el idioma', error: error.message }));
};

export const eliminar = (req, res) => {
  const { id } = req.params;
  borrarIdioma(id)
    .then((filasEliminadas) => {
      if (filasEliminadas === 0) return res.status(404).json({ mensaje: 'Idioma no encontrado' });
      res.status(200).json({ mensaje: 'Idioma eliminado correctamente' });
    })
    .catch((error) => res.status(500).json({ mensaje: 'Error al eliminar el idioma', error: error.message }));
};

export const buscarPorNombre = (req, res) => {
  const { nombre } = req.query;
  consultarIdiomaNombre(nombre)
    .then((resultado) => {
      if (!resultado) return res.status(404).json({ mensaje: 'Idioma no encontrado' });
      res.status(200).json(resultado);
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al buscar el idioma', error: error.message }));
};
