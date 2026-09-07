import { registrarReserva, listarReservas, modificarReserva, borrarReserva, consultarReserva } from '../services/servicesReserva.js';

export const listar = (peticion, respuesta) => {
  listarReservas()
    .then((resultado) => respuesta.status(200).json(resultado))
    .catch((error) => respuesta.status(500).json({ mensaje: 'Error al obtener las reservas', error: error.message }));
};

export const crear = (peticion, respuesta) => {
  registrarReserva(peticion.body)
    .then((nuevoRegistro) => respuesta.status(201).json(nuevoRegistro))
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al crear la reserva', error: error.message }));
};

export const editar = (peticion, respuesta) => {
  const { id } = peticion.params;
  modificarReserva(peticion.body, id)
    .then(([filasAfectadas]) => {
      if (filasAfectadas === 0) return respuesta.status(404).json({ mensaje: 'Reserva no encontrada o sin cambios' });
      respuesta.status(200).json({ mensaje: 'Reserva actualizada correctamente' });
    })
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al actualizar la reserva', error: error.message }));
};

export const eliminar = (peticion, respuesta) => {
  const { id } = peticion.params;
  borrarReserva(id)
    .then((filasEliminadas) => {
      if (filasEliminadas === 0) return respuesta.status(404).json({ mensaje: 'Reserva no encontrada' });
      respuesta.status(200).json({ mensaje: 'Reserva eliminada correctamente' });
    })
    .catch((error) => respuesta.status(500).json({ mensaje: 'Error al eliminar la reserva', error: error.message }));
};

export const obtenerPorId = (peticion, respuesta) => {
  const { id } = peticion.params;
  consultarReserva(id)
    .then((resultado) => {
      if (!resultado) return respuesta.status(404).json({ mensaje: 'Reserva no encontrada' });
      respuesta.status(200).json(resultado);
    })
    .catch((error) => respuesta.status(400).json({ mensaje: 'Error al buscar la reserva', error: error.message }));
};
