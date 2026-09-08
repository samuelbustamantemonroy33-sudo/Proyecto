import { registrarPais, listarPaises, modificarPais, borrarPais, consultarPaisNombre } from '../services/servicesPais.js';

export const listar = (req, res) => {
  listarPaises()
    .then((resultado) => res.status(200).json(resultado))
    .catch((error) => res.status(500).json({ mensaje: 'Error al obtener los países', error: error.message }));
};

export const crear = (req, res) => {
  registrarPais(req.body)
    .then((nuevoRegistro) => res.status(201).json(nuevoRegistro))
    .catch((error) => res.status(400).json({ mensaje: 'Error al crear el país', error: error.message }));
};

export const editar = (req, res) => {
  const { id } = req.params;
  modificarPais(req.body, id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return res.status(404).json({ mensaje: 'País no encontrado o sin cambios' });
      res.status(200).json({ mensaje: 'País actualizado correctamente' });
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al actualizar el país', error: error.message }));
};

export const eliminar = (req, res) => {
  const { id } = req.params;
  borrarPais(id)
    .then((filasEliminadas) => {
      if (filasEliminadas === 0) return res.status(404).json({ mensaje: 'País no encontrado' });
      res.status(200).json({ mensaje: 'País eliminado correctamente' });
    })
    .catch((error) => res.status(500).json({ mensaje: 'Error al eliminar el país', error: error.message }));
};

export const buscarPorNombre = (req, res) => {
  const { nombre } = req.query;
  consultarPaisNombre(nombre)
    .then((resultado) => {
      if (!resultado) return res.status(404).json({ mensaje: 'País no encontrado' });
      res.status(200).json(resultado);
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al buscar el país', error: error.message }));
};
