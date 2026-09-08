import { registrarReserva, listarReservas, modificarReserva, borrarReserva, consultarReserva, cancelarReserva } from '../services/servicesReserva.js';

export const listar = (req, res) => {
  listarReservas()
    .then((resultado) => res.status(200).json(resultado))
    .catch((error) => res.status(500).json({ mensaje: 'Error al obtener las reservas', error: error.message }));
};

export const crear = (req, res) => {
  registrarReserva(req.body)
    .then((nuevoRegistro) => res.status(201).json(nuevoRegistro))
    .catch((error) => res.status(400).json({ mensaje: 'Error al crear la reserva', error: error.message }));
};

export const editar = (req, res) => {
  const { id } = req.params;
  modificarReserva(req.body, id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return res.status(404).json({ mensaje: 'Reserva no encontrada o sin cambios' });
      res.status(200).json({ mensaje: 'Reserva actualizada correctamente' });
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al actualizar la reserva', error: error.message }));
};

export const eliminar = (req, res) => {
  const { id } = req.params;
  borrarReserva(id)
    .then((filasEliminadas) => {
      if (filasEliminadas === 0) return res.status(404).json({ mensaje: 'Reserva no encontrada' });
      res.status(200).json({ mensaje: 'Reserva eliminada correctamente' });
    })
    .catch((error) => res.status(500).json({ mensaje: 'Error al eliminar la reserva', error: error.message }));
};

export const obtenerPorId = (req, res) => {
  const { id } = req.params;
  consultarReserva(id)
    .then((resultado) => {
      if (!resultado) return res.status(404).json({ mensaje: 'Reserva no encontrada' });
      res.status(200).json(resultado);
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al buscar la reserva', error: error.message }));
};

export const cancelar = (req, res) => {
  const { id } = req.params;
  cancelarReserva(id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return res.status(404).json({ mensaje: 'Reserva no encontrada' });
      res.status(200).json({ mensaje: 'Reserva cancelada correctamente' });
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al cancelar la reserva', error: error.message }));
};
