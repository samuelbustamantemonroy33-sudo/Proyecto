import { registrarMulta, listarMultas, modificarMulta, borrarMulta, consultarMulta, pagarMulta } from '../services/servicesMulta.js';

export const listar = (req, res) => {
  listarMultas()
    .then((resultado) => res.status(200).json(resultado))
    .catch((error) => res.status(500).json({ mensaje: 'Error al obtener las multas', error: error.message }));
};

export const crear = (req, res) => {
  registrarMulta(req.body)
    .then((nuevoRegistro) => res.status(201).json(nuevoRegistro))
    .catch((error) => res.status(400).json({ mensaje: 'Error al crear la multa', error: error.message }));
};

export const editar = (req, res) => {
  const { id } = req.params;
  modificarMulta(req.body, id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return res.status(404).json({ mensaje: 'Multa no encontrada o sin cambios' });
      res.status(200).json({ mensaje: 'Multa actualizada correctamente' });
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al actualizar la multa', error: error.message }));
};

export const eliminar = (req, res) => {
  const { id } = req.params;
  borrarMulta(id)
    .then((filasEliminadas) => {
      if (filasEliminadas === 0) return res.status(404).json({ mensaje: 'Multa no encontrada' });
      res.status(200).json({ mensaje: 'Multa eliminada correctamente' });
    })
    .catch((error) => res.status(500).json({ mensaje: 'Error al eliminar la multa', error: error.message }));
};

export const obtenerPorId = (req, res) => {
  const { id } = req.params;
  consultarMulta(id)
    .then((resultado) => {
      if (!resultado) return res.status(404).json({ mensaje: 'Multa no encontrada' });
      res.status(200).json(resultado);
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al buscar la multa', error: error.message }));
};

export const pagar = (req, res) => {
  const { id } = req.params;
  pagarMulta(id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return res.status(404).json({ mensaje: 'Multa no encontrada' });
      res.status(200).json({ mensaje: 'Multa pagada correctamente' });
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al pagar la multa', error: error.message }));
};
