import { registrarEjemplar, listarEjemplares, modificarEjemplar, borrarEjemplar, consultarEjemplarCodigo } from '../services/servicesEjemplar.js';

export const listar = (req, res) => {
  listarEjemplares()
    .then((resultado) => res.status(200).json(resultado))
    .catch((error) => res.status(500).json({ mensaje: 'Error al obtener los ejemplares', error: error.message }));
};

export const crear = (req, res) => {
  registrarEjemplar(req.body)
    .then((nuevoRegistro) => res.status(201).json(nuevoRegistro))
    .catch((error) => res.status(400).json({ mensaje: 'Error al crear el ejemplar', error: error.message }));
};

export const editar = (req, res) => {
  const { id } = req.params;
  modificarEjemplar(req.body, id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return res.status(404).json({ mensaje: 'Ejemplar no encontrado o sin cambios' });
      res.status(200).json({ mensaje: 'Ejemplar actualizado correctamente' });
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al actualizar el ejemplar', error: error.message }));
};

export const eliminar = (req, res) => {
  const { id } = req.params;
  borrarEjemplar(id)
    .then((filasEliminadas) => {
      if (filasEliminadas === 0) return res.status(404).json({ mensaje: 'Ejemplar no encontrado' });
      res.status(200).json({ mensaje: 'Ejemplar eliminado correctamente' });
    })
    .catch((error) => res.status(500).json({ mensaje: 'Error al eliminar el ejemplar', error: error.message }));
};

export const buscarPorCodigo = (req, res) => {
  const { codigo } = req.query;
  consultarEjemplarCodigo(codigo)
    .then((resultado) => {
      if (!resultado) return res.status(404).json({ mensaje: 'Ejemplar no encontrado' });
      res.status(200).json(resultado);
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al buscar el ejemplar', error: error.message }));
};
