import { registrarCategoria, listarCategorias, modificarCategoria, borrarCategoria, consultarCategoriaNombre } from '../services/servicesCategoria.js';

export const listar = (req, res) => {
  listarCategorias()
    .then((resultado) => res.status(200).json(resultado))
    .catch((error) => res.status(500).json({ mensaje: 'Error al obtener las categorías', error: error.message }));
};

export const crear = (req, res) => {
  registrarCategoria(req.body)
    .then((nuevoRegistro) => res.status(201).json(nuevoRegistro))
    .catch((error) => res.status(400).json({ mensaje: 'Error al crear la categoría', error: error.message }));
};

export const editar = (req, res) => {
  const { id } = req.params;
  modificarCategoria(req.body, id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return res.status(404).json({ mensaje: 'Categoría no encontrada o sin cambios' });
      res.status(200).json({ mensaje: 'Categoría actualizada correctamente' });
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al actualizar la categoría', error: error.message }));
};

export const eliminar = (req, res) => {
  const { id } = req.params;
  borrarCategoria(id)
    .then((filasEliminadas) => {
      if (filasEliminadas === 0) return res.status(404).json({ mensaje: 'Categoría no encontrada' });
      res.status(200).json({ mensaje: 'Categoría eliminada correctamente' });
    })
    .catch((error) => res.status(500).json({ mensaje: 'Error al eliminar la categoría', error: error.message }));
};

export const buscarPorNombre = (req, res) => {
  const { nombre } = req.query;
  consultarCategoriaNombre(nombre)
    .then((resultado) => {
      if (!resultado) return res.status(404).json({ mensaje: 'Categoría no encontrada' });
      res.status(200).json(resultado);
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al buscar la categoría', error: error.message }));
};
