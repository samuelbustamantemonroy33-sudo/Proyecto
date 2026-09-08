import { registrarLibroAutor, listarLibrosAutores, modificarLibroAutor, borrarLibroAutor } from '../services/servicesLibroAutor.js';

export const listar = (req, res) => {
  listarLibrosAutores()
    .then((resultado) => res.status(200).json(resultado))
    .catch((error) => res.status(500).json({ mensaje: 'Error al obtener las relaciones libro-autor', error: error.message }));
};

export const crear = (req, res) => {
  registrarLibroAutor(req.body)
    .then((nuevaRelacion) => res.status(201).json(nuevaRelacion))
    .catch((error) => res.status(400).json({ mensaje: 'Error al crear la relación libro-autor', error: error.message }));
};

export const editar = (req, res) => {
  const { id_libro, id_autor } = req.params;
  modificarLibroAutor(req.body, { id_libro, id_autor })
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return res.status(404).json({ mensaje: 'Relación libro-autor no encontrada o sin cambios' });
      res.status(200).json({ mensaje: 'Relación libro-autor actualizada correctamente' });
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al actualizar la relación libro-autor', error: error.message }));
};

export const eliminar = (req, res) => {
  const { id_libro, id_autor } = req.params;
  borrarLibroAutor({ id_libro, id_autor })
    .then((filasEliminadas) => {
      if (filasEliminadas === 0) return res.status(404).json({ mensaje: 'Relación libro-autor no encontrada' });
      res.status(200).json({ mensaje: 'Relación libro-autor eliminada correctamente' });
    })
    .catch((error) => res.status(500).json({ mensaje: 'Error al eliminar la relación libro-autor', error: error.message }));
};
