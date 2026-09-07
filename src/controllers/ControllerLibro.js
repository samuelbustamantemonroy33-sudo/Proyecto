import { registrarLibro, listarLibros, modificarLibro, borrarLibro, consultarLibroTitulo } from '../services/servicesLibro.js';

export const listar = (peticion, respuesta) => {
  listarLibros()
    .then((resultado) => respuesta.status(200).json(resultado))
    .catch((error) => respuesta.status(500).json({ mensaje: 'Error al obtener los libros', error: error.message }));
};

export const crear = (peticion, respuesta) => {
  registrarLibro(peticion.body)
    .then((nuevoRegistro) => respuesta.status(201).json(nuevoRegistro))
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al crear el libro', error: error.message }));
};

export const editar = (peticion, respuesta) => {
  const { id } = peticion.params;
  modificarLibro(peticion.body, id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return respuesta.status(404).json({ mensaje: 'Libro no encontrado o sin cambios' });
      respuesta.status(200).json({ mensaje: 'Libro actualizado correctamente' });
    })
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al actualizar el libro', error: error.message }));
};

export const eliminar = (peticion, respuesta) => {
  const { id } = peticion.params;
  borrarLibro(id)
    .then((filasEliminadas) => {
      if (filasEliminadas === 0) return respuesta.status(404).json({ mensaje: 'Libro no encontrado' });
      respuesta.status(200).json({ mensaje: 'Libro eliminado correctamente' });
    })
    .catch((error) => respuesta.status(500).json({ mensaje: 'Error al eliminar el libro', error: error.message }));
};

export const buscarPorTitulo = (peticion, respuesta) => {
  const { titulo } = peticion.query;
  consultarLibroTitulo(titulo)
    .then((resultado) => {
      if (!resultado) return respuesta.status(404).json({ mensaje: 'Libro no encontrado' });
      respuesta.status(200).json(resultado);
    })
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al buscar el libro', error: error.message }));
};
