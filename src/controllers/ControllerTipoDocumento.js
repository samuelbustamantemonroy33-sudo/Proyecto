import { registrarTipoDocumento, listarTiposDocumento, modificarTipoDocumento, borrarTipoDocumento, consultarTipoDocumentoCodigo } from '../services/servicesTipoDocumento.js';

export const listar = (peticion, respuesta) => {
  listarTiposDocumento()
    .then((resultado) => respuesta.status(200).json(resultado))
    .catch((error) => respuesta.status(500).json({ mensaje: 'Error al obtener los tipos de documento', error: error.message }));
};

export const crear = (peticion, respuesta) => {
  registrarTipoDocumento(peticion.body)
    .then((nuevoRegistro) => respuesta.status(201).json(nuevoRegistro))
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al crear el tipo de documento', error: error.message }));
};

export const editar = (peticion, respuesta) => {
  const { id } = peticion.params;
  modificarTipoDocumento(peticion.body, id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return respuesta.status(404).json({ mensaje: 'Tipo de documento no encontrado o sin cambios' });
      respuesta.status(200).json({ mensaje: 'Tipo de documento actualizado correctamente' });
    })
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al actualizar el tipo de documento', error: error.message }));
};

export const eliminar = (peticion, respuesta) => {
  const { id } = peticion.params;
  borrarTipoDocumento(id)
    .then((filasEliminadas) => {
      if (filasEliminadas === 0) return respuesta.status(404).json({ mensaje: 'Tipo de documento no encontrado' });
      respuesta.status(200).json({ mensaje: 'Tipo de documento eliminado correctamente' });
    })
    .catch((error) => respuesta.status(500).json({ mensaje: 'Error al eliminar el tipo de documento', error: error.message }));
};

export const buscarPorCodigo = (peticion, respuesta) => {
  const { codigo } = peticion.query;
  consultarTipoDocumentoCodigo(codigo)
    .then((resultado) => {
      if (!resultado) return respuesta.status(404).json({ mensaje: 'Tipo de documento no encontrado' });
      respuesta.status(200).json(resultado);
    })
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al buscar el tipo de documento', error: error.message }));
};
