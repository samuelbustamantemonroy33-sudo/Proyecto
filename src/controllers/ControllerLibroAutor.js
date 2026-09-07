import { registrarLibroAutor, listarLibrosAutores, modificarLibroAutor, borrarLibroAutor } from '../services/servicesLibroAutor.js';

export const listar = (peticion, respuesta) => {
  listarLibrosAutores()
    .then((resultado) => respuesta.status(200).json(resultado))
    .catch((error) => respuesta.status(500).json({ mensaje: 'Error al obtener las relaciones libro-autor', error: error.message }));
};

export const crear = (peticion, respuesta) => {
  registrarLibroAutor(peticion.body)
    .then((nuevaRelacion) => respuesta.status(201).json(nuevaRelacion))
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al crear la relación libro-autor', error: error.message }));
};

export const editar = (peticion, respuesta) => {
  const { id_libro, id_autor } = peticion.params;
  modificarLibroAutor(peticion.body, { id_libro, id_autor })
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return respuesta.status(404).json({ mensaje: 'Relación libro-autor no encontrada o sin cambios' });
      respuesta.status(200).json({ mensaje: 'Relación libro-autor actualizada correctamente' });
    })
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al actualizar la relación libro-autor', error: error.message }));
};

export const eliminar = (peticion, respuesta) => {
  const { id_libro, id_autor } = peticion.params;
  borrarLibroAutor({ id_libro, id_autor })
    .then((filasEliminadas) => {
      if (filasEliminadas === 0) return respuesta.status(404).json({ mensaje: 'Relación libro-autor no encontrada' });
      respuesta.status(200).json({ mensaje: 'Relación libro-autor eliminada correctamente' });
    })
    .catch((error) => respuesta.status(500).json({ mensaje: 'Error al eliminar la relación libro-autor', error: error.message }));
};
