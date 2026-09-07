import { ModelMulta } from "../models/ModelMulta.js";
import { ModelEstadoMulta } from "../models/ModelEstadoMulta.js";

const ESTADO_MULTA_PAGADA = "Pagada";

export function registrarMulta(data) {
  if (
    !data?.id_prestamo ||
    !data.id_estado_multa ||
    data.monto === undefined ||
    !data.motivo ||
    !data.fecha_generada
  )
    return Promise.reject(new Error("Campos incompletos..."));
  return ModelMulta.create(data);
}

export function listarMultas() {
  return ModelMulta.findAll();
}

export function modificarMulta(data, id) {
  if (!id) return Promise.reject(new Error("El ID es obligatorio..."));
  return ModelMulta.update(data, { where: { id_multa: id } });
}

export function borrarMulta(id) {
  if (!id) return Promise.reject(new Error("El ID es obligatorio..."));
  return ModelMulta.destroy({ where: { id_multa: id } });
}

export function consultarMulta(id) {
  if (!id) return Promise.reject(new Error("El ID es obligatorio..."));
  return ModelMulta.findByPk(id);
}

export function pagarMulta(id) {
  if (!id) return Promise.reject(new Error("El ID es obligatorio..."));
  return ModelEstadoMulta
    .findOne({ where: { nombre_estado: ESTADO_MULTA_PAGADA } })
    .then((estadoPagada) => {
      if (!estadoPagada)
        return Promise.reject(new Error(`No existe el estado "${ESTADO_MULTA_PAGADA}" en Estados_Multa`));
      return ModelMulta.update(
        { id_estado_multa: estadoPagada.id_estado_multa, fecha_pago: new Date().toISOString().slice(0, 10) },
        { where: { id_multa: id } }
      );
    });
}
