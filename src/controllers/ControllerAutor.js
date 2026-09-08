import { registrarAutor, listarAutores, modificarAutor, borrarAutor, consultarAutorNombre } from '../services/servicesAutor.js';

export const listar = (req, res) => {
  listarAutores()
    .then((resultado) => res.status(200).json(resultado))
    .catch((error) => res.status(500).json({ mensaje: 'Error al obtener los autores', error: error.message }));
};

export const crear = (req, res) => {
  registrarAutor(req.body)
    .then((nuevoRegistro) => res.status(201).json(nuevoRegistro))
    .catch((error) => res.status(400).json({ mensaje: 'Error al crear el autor', error: error.message }));
};

export const editar = (req, res) => {
  const { id } = req.params;
  modificarAutor(req.body, id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return res.status(404).json({ mensaje: 'Autor no encontrado o sin cambios' });
      res.status(200).json({ mensaje: 'Autor actualizado correctamente' });
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al actualizar el autor', error: error.message }));
};

export const eliminar = (req, res) => {
  const { id } = req.params;
  borrarAutor(id)
    .then((filasEliminadas) => {
      if (filasEliminadas === 0) return res.status(404).json({ mensaje: 'Autor no encontrado' });
      res.status(200).json({ mensaje: 'Autor eliminado correctamente' });
    })
    .catch((error) => res.status(500).json({ mensaje: 'Error al eliminar el autor', error: error.message }));
};

export const buscarPorNombre = (req, res) => {
  const { nombre } = req.query;
  consultarAutorNombre(nombre)
    .then((resultado) => {
      if (!resultado) return res.status(404).json({ mensaje: 'Autor no encontrado' });
      res.status(200).json(resultado);
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al buscar el autor', error: error.message }));
};
