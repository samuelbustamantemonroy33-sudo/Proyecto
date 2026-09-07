import { registrarLibroCategoria, listarLibrosCategorias, modificarLibroCategoria, borrarLibroCategoria } from '../services/servicesLibroCategoria.js';

export const listar = (peticion, respuesta) => {
  listarLibrosCategorias()
    .then((resultado) => respuesta.status(200).json(resultado))
    .catch((error) => respuesta.status(500).json({ mensaje: 'Error al obtener las relaciones libro-categoría', error: error.message }));
};

export const crear = (peticion, respuesta) => {
  registrarLibroCategoria(peticion.body)
    .then((nuevaRelacion) => respuesta.status(201).json(nuevaRelacion))
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al crear la relación libro-categoría', error: error.message }));
};

export const editar = (peticion, respuesta) => {
  const { id_libro, id_categoria } = peticion.params;
  modificarLibroCategoria(peticion.body, { id_libro, id_categoria })
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return respuesta.status(404).json({ mensaje: 'Relación libro-categoría no encontrada o sin cambios' });
      respuesta.status(200).json({ mensaje: 'Relación libro-categoría actualizada correctamente' });
    })
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al actualizar la relación libro-categoría', error: error.message }));
};

export const eliminar = (peticion, respuesta) => {
  const { id_libro, id_categoria } = peticion.params;
  borrarLibroCategoria({ id_libro, id_categoria })
    .then((filasEliminadas) => {
      if (filasEliminadas === 0) return respuesta.status(404).json({ mensaje: 'Relación libro-categoría no encontrada' });
      respuesta.status(200).json({ mensaje: 'Relación libro-categoría eliminada correctamente' });
    })
    .catch((error) => respuesta.status(500).json({ mensaje: 'Error al eliminar la relación libro-categoría', error: error.message }));
};
