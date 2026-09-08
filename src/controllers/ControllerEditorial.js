import { registrarEditorial, listarEditoriales, modificarEditorial, borrarEditorial, consultarEditorialNombre } from '../services/servicesEditorial.js';

export const listar = (req, res) => {
  listarEditoriales()
    .then((resultado) => res.status(200).json(resultado))
    .catch((error) => res.status(500).json({ mensaje: 'Error al obtener las editoriales', error: error.message }));
};

export const crear = (req, res) => {
  registrarEditorial(req.body)
    .then((nuevoRegistro) => res.status(201).json(nuevoRegistro))
    .catch((error) => res.status(400).json({ mensaje: 'Error al crear la editorial', error: error.message }));
};

export const editar = (req, res) => {
  const { id } = req.params;
  modificarEditorial(req.body, id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return res.status(404).json({ mensaje: 'Editorial no encontrada o sin cambios' });
      res.status(200).json({ mensaje: 'Editorial actualizada correctamente' });
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al actualizar la editorial', error: error.message }));
};

export const eliminar = (req, res) => {
  const { id } = req.params;
  borrarEditorial(id)
    .then((filasEliminadas) => {
      if (filasEliminadas === 0) return res.status(404).json({ mensaje: 'Editorial no encontrada' });
      res.status(200).json({ mensaje: 'Editorial eliminada correctamente' });
    })
    .catch((error) => res.status(500).json({ mensaje: 'Error al eliminar la editorial', error: error.message }));
};

export const buscarPorNombre = (req, res) => {
  const { nombre } = req.query;
  consultarEditorialNombre(nombre)
    .then((resultado) => {
      if (!resultado) return res.status(404).json({ mensaje: 'Editorial no encontrada' });
      res.status(200).json(resultado);
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al buscar la editorial', error: error.message }));
};
