import { ModelReserva } from "../models/ModelReserva.js";
import { ModelEstadoReserva } from "../models/ModelEstadoReserva.js";

const ESTADO_RESERVA_CANCELADA = "Cancelada";

export function registrarReserva(data) {
  if (
    !data?.id_libro ||
    !data.id_cliente ||
    !data.id_estado_reserva ||
    !data.fecha_reserva ||
    !data.fecha_expiracion
  )
    return Promise.reject(new Error("Campos incompletos..."));
  return ModelReserva.create(data);
}

export function listarReservas() {
  return ModelReserva.findAll();
}

export function modificarReserva(data, id) {
  if (!id) return Promise.reject(new Error("El ID es obligatorio..."));
  return ModelReserva.update(data, { where: { id_reserva: id } });
}

export function borrarReserva(id) {
  if (!id) return Promise.reject(new Error("El ID es obligatorio..."));
  return ModelReserva.destroy({ where: { id_reserva: id } });
}

export function consultarReserva(id) {
  if (!id) return Promise.reject(new Error("El ID es obligatorio..."));
  return ModelReserva.findByPk(id);
}

export function cancelarReserva(id) {
  if (!id) return Promise.reject(new Error("El ID es obligatorio..."));
  return ModelEstadoReserva
    .findOne({ where: { nombre_estado: ESTADO_RESERVA_CANCELADA } })
    .then((estadoCancelada) => {
      if (!estadoCancelada)
        return Promise.reject(new Error(`No existe el estado "${ESTADO_RESERVA_CANCELADA}" en Estados_Reserva`));
      return ModelReserva.update(
        { id_estado_reserva: estadoCancelada.id_estado_reserva },
        { where: { id_reserva: id } }
      );
    });
}
