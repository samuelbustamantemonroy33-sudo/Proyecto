import { registrarLibroCategoria, listarLibrosCategorias, modificarLibroCategoria, borrarLibroCategoria } from '../services/servicesLibroCategoria.js';

export const listar = (req, res) => {
  listarLibrosCategorias()
    .then((resultado) => res.status(200).json(resultado))
    .catch((error) => res.status(500).json({ mensaje: 'Error al obtener las relaciones libro-categoría', error: error.message }));
};

export const crear = (req, res) => {
  registrarLibroCategoria(req.body)
    .then((nuevaRelacion) => res.status(201).json(nuevaRelacion))
    .catch((error) => res.status(400).json({ mensaje: 'Error al crear la relación libro-categoría', error: error.message }));
};

export const editar = (req, res) => {
  const { id_libro, id_categoria } = req.params;
  modificarLibroCategoria(req.body, { id_libro, id_categoria })
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return res.status(404).json({ mensaje: 'Relación libro-categoría no encontrada o sin cambios' });
      res.status(200).json({ mensaje: 'Relación libro-categoría actualizada correctamente' });
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al actualizar la relación libro-categoría', error: error.message }));
};

export const eliminar = (req, res) => {
  const { id_libro, id_categoria } = req.params;
  borrarLibroCategoria({ id_libro, id_categoria })
    .then((filasEliminadas) => {
      if (filasEliminadas === 0) return res.status(404).json({ mensaje: 'Relación libro-categoría no encontrada' });
      res.status(200).json({ mensaje: 'Relación libro-categoría eliminada correctamente' });
    })
    .catch((error) => res.status(500).json({ mensaje: 'Error al eliminar la relación libro-categoría', error: error.message }));
};
