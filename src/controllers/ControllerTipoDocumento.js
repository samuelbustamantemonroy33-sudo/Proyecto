import { registrarTipoDocumento, listarTiposDocumento, modificarTipoDocumento, borrarTipoDocumento, consultarTipoDocumentoCodigo } from '../services/servicesTipoDocumento.js';

export const listar = (req, res) => {
  listarTiposDocumento()
    .then((resultado) => res.status(200).json(resultado))
    .catch((error) => res.status(500).json({ mensaje: 'Error al obtener los tipos de documento', error: error.message }));
};

export const crear = (req, res) => {
  registrarTipoDocumento(req.body)
    .then((nuevoRegistro) => res.status(201).json(nuevoRegistro))
    .catch((error) => res.status(400).json({ mensaje: 'Error al crear el tipo de documento', error: error.message }));
};

export const editar = (req, res) => {
  const { id } = req.params;
  modificarTipoDocumento(req.body, id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return res.status(404).json({ mensaje: 'Tipo de documento no encontrado o sin cambios' });
      res.status(200).json({ mensaje: 'Tipo de documento actualizado correctamente' });
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al actualizar el tipo de documento', error: error.message }));
};

export const eliminar = (req, res) => {
  const { id } = req.params;
  borrarTipoDocumento(id)
    .then((filasEliminadas) => {
      if (filasEliminadas === 0) return res.status(404).json({ mensaje: 'Tipo de documento no encontrado' });
      res.status(200).json({ mensaje: 'Tipo de documento eliminado correctamente' });
    })
    .catch((error) => res.status(500).json({ mensaje: 'Error al eliminar el tipo de documento', error: error.message }));
};

export const buscarPorCodigo = (req, res) => {
  const { codigo } = req.query;
  consultarTipoDocumentoCodigo(codigo)
    .then((resultado) => {
      if (!resultado) return res.status(404).json({ mensaje: 'Tipo de documento no encontrado' });
      res.status(200).json(resultado);
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al buscar el tipo de documento', error: error.message }));
};
