import { registrarEstadoReserva, listarEstadosReserva, modificarEstadoReserva, borrarEstadoReserva, consultarEstadoReservaNombre } from '../services/servicesEstadoReserva.js';

export const listar = (req, res) => {
  listarEstadosReserva()
    .then((resultado) => res.status(200).json(resultado))
    .catch((error) => res.status(500).json({ mensaje: 'Error al obtener los estados de reserva', error: error.message }));
};

export const crear = (req, res) => {
  registrarEstadoReserva(req.body)
    .then((nuevoRegistro) => res.status(201).json(nuevoRegistro))
    .catch((error) => res.status(400).json({ mensaje: 'Error al crear el estado de la reserva', error: error.message }));
};

export const editar = (req, res) => {
  const { id } = req.params;
  modificarEstadoReserva(req.body, id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return res.status(404).json({ mensaje: 'Estado de la reserva no encontrado o sin cambios' });
      res.status(200).json({ mensaje: 'Estado de la reserva actualizado correctamente' });
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al actualizar el estado de la reserva', error: error.message }));
};

export const eliminar = (req, res) => {
  const { id } = req.params;
  borrarEstadoReserva(id)
    .then((filasEliminadas) => {
      if (filasEliminadas === 0) return res.status(404).json({ mensaje: 'Estado de la reserva no encontrado' });
      res.status(200).json({ mensaje: 'Estado de la reserva eliminado correctamente' });
    })
    .catch((error) => res.status(500).json({ mensaje: 'Error al eliminar el estado de la reserva', error: error.message }));
};

export const buscarPorNombre = (req, res) => {
  const { nombre } = req.query;
  consultarEstadoReservaNombre(nombre)
    .then((resultado) => {
      if (!resultado) return res.status(404).json({ mensaje: 'Estado de la reserva no encontrado' });
      res.status(200).json(resultado);
    })
    .catch((error) => res.status(400).json({ mensaje: 'Error al buscar el estado de la reserva', error: error.message }));
};
