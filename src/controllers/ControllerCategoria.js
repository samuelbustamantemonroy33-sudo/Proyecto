import { registrarCategoria, listarCategorias, modificarCategoria, borrarCategoria, consultarCategoriaNombre } from '../services/servicesCategoria.js';

export const listar = (peticion, respuesta) => {
  listarCategorias()
    .then((resultado) => respuesta.status(200).json(resultado))
    .catch((error) => respuesta.status(500).json({ mensaje: 'Error al obtener las categorías', error: error.message }));
};

export const crear = (peticion, respuesta) => {
  registrarCategoria(peticion.body)
    .then((nuevoRegistro) => respuesta.status(201).json(nuevoRegistro))
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al crear la categoría', error: error.message }));
};

export const editar = (peticion, respuesta) => {
  const { id } = peticion.params;
  modificarCategoria(peticion.body, id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return respuesta.status(404).json({ mensaje: 'Categoría no encontrada o sin cambios' });
      respuesta.status(200).json({ mensaje: 'Categoría actualizada correctamente' });
    })
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al actualizar la categoría', error: error.message }));
};

export const eliminar = (peticion, respuesta) => {
  const { id } = peticion.params;
  borrarCategoria(id)
    .then((filasEliminadas) => {
      if (filasEliminadas === 0) return respuesta.status(404).json({ mensaje: 'Categoría no encontrada' });
      respuesta.status(200).json({ mensaje: 'Categoría eliminada correctamente' });
    })
    .catch((error) => respuesta.status(500).json({ mensaje: 'Error al eliminar la categoría', error: error.message }));
};

export const buscarPorNombre = (peticion, respuesta) => {
  const { nombre } = peticion.query;
  consultarCategoriaNombre(nombre)
    .then((resultado) => {
      if (!resultado) return respuesta.status(404).json({ mensaje: 'Categoría no encontrada' });
      respuesta.status(200).json(resultado);
    })
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al buscar la categoría', error: error.message }));
};
