import { registrarLibro, listarLibros, modificarLibro, borrarLibro, consultarLibroTitulo } from '../services/servicesLibro.js';
import { registrarLibroAutor } from '../services/servicesLibroAutor.js';
import { registrarLibroCategoria } from '../services/servicesLibroCategoria.js';

export const listar = (req, res) => {
  listarLibros()
    .then((resultado) => res.status(200).json(resultado))
    .catch((error) => res.status(500).json({ mensaje: 'Error al obtener los libros', error: error.message }));
};

export const crear = (req, res) => {
  registrarLibro(req.body)
    .then((nuevoRegistro) => res.status(201).json(nuevoRegistro))
    .catch((error) => res.status(400).json({ mensaje: 'Error al crear el libro', error: error.message }));
};

export const editar = (req, res) => {
  const { id } = req.params;
  modificarLibro(req.body, id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return res.status(404).json({ mensaje: 'Libro no encontrado o sin cambios' });
      res.status(200).json({ mensaje: 'Libro actualizado correctamente' });
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al actualizar el libro', error: error.message }));
};

export const eliminar = (req, res) => {
  const { id } = req.params;
  borrarLibro(id)
    .then((filasEliminadas) => {
      if (filasEliminadas === 0) return res.status(404).json({ mensaje: 'Libro no encontrado' });
      res.status(200).json({ mensaje: 'Libro eliminado correctamente' });
    })
    .catch((error) => res.status(500).json({ mensaje: 'Error al eliminar el libro', error: error.message }));
};

export const buscarPorTitulo = (req, res) => {
  const { titulo } = req.query;
  consultarLibroTitulo(titulo)
    .then((resultado) => {
      if (!resultado) return res.status(404).json({ mensaje: 'Libro no encontrado' });
      res.status(200).json(resultado);
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al buscar el libro', error: error.message }));
};

export const agregarAutor = (req, res) => {
  const { id } = req.params;
  const { id_autor } = req.body;
  registrarLibroAutor({ id_libro: id, id_autor })
    .then((nuevaRelacion) => res.status(201).json(nuevaRelacion))
    .catch((error) => res.status(400).json({ mensaje: 'Error al asociar el autor al libro', error: error.message }));
};

export const agregarCategoria = (req, res) => {
  const { id } = req.params;
  const { id_categoria } = req.body;
  registrarLibroCategoria({ id_libro: id, id_categoria })
    .then((nuevaRelacion) => res.status(201).json(nuevaRelacion))
    .catch((error) => res.status(400).json({ mensaje: 'Error al asociar la categoría al libro', error: error.message }));
};
