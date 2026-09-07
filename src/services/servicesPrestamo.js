import { ModelPrestamo } from "../models/ModelPrestamo.js";
import { ModelEstadoPrestamo } from "../models/ModelEstadoPrestamo.js";

const ESTADO_PRESTAMO_DEVUELTO = "Devuelto";

export function registrarPrestamo(data) {
  if (
    !data?.id_ejemplar ||
    !data.id_cliente ||
    !data.id_registrado_por ||
    !data.id_estado_prestamo ||
    !data.fecha_prestamo ||
    !data.fecha_devolucion_esperada
  )
    return Promise.reject(new Error("Campos incompletos..."));
  return ModelPrestamo.create(data);
}

export function listarPrestamos() {
  return ModelPrestamo.findAll();
}

export function modificarPrestamo(data, id) {
  if (!id) return Promise.reject(new Error("El ID es obligatorio..."));
  return ModelPrestamo.update(data, { where: { id_prestamo: id } });
}

export function borrarPrestamo(id) {
  if (!id) return Promise.reject(new Error("El ID es obligatorio..."));
  return ModelPrestamo.destroy({ where: { id_prestamo: id } });
}

export function consultarPrestamo(id) {
  if (!id) return Promise.reject(new Error("El ID es obligatorio..."));
  return ModelPrestamo.findByPk(id);
}

export function devolverPrestamo(id) {
  if (!id) return Promise.reject(new Error("El ID es obligatorio..."));
  return ModelEstadoPrestamo
    .findOne({ where: { nombre_estado: ESTADO_PRESTAMO_DEVUELTO } })
    .then((estadoDevuelto) => {
      if (!estadoDevuelto)
        return Promise.reject(new Error(`No existe el estado "${ESTADO_PRESTAMO_DEVUELTO}" en Estados_Prestamo`));
      return ModelPrestamo.update(
        { id_estado_prestamo: estadoDevuelto.id_estado_prestamo, fecha_devolucion_real: new Date().toISOString().slice(0, 10) },
        { where: { id_prestamo: id } }
      );
    });
}
