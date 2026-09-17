import { useState } from "react";

const initialForm = { nombre: "", correo: "", password: "", role: "user", adminCode: "" };
const initialErrors = { nombre: "", correo: "", password: "", adminCode: "" };

async function readResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const body = await response.text();
  if (!body) return {};
  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(body);
    } catch {
      return { error: "El servidor devolvió una respuesta inválida." };
    }
  }
  return { error: body.slice(0, 160) };
}

export default function AuthPanel({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialForm);
  const [errores, setErrores] = useState(initialErrors);
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setErrores(initialErrors);
    setLoading(true);
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await readResponse(response);
      if (!response.ok) {
        const campos = data.fields || {};
        const mensaje = data.error || `El servidor rechazó la solicitud (${response.status} ${response.statusText}).`;
        setErrores({ ...initialErrors, ...campos, correo: campos.correo || (!Object.keys(campos).length ? mensaje : campos.correo) });
        return;
      }
      onAuthenticated(data);
    } catch (requestError) {
      setErrores({ ...initialErrors, correo: requestError instanceof TypeError ? "No se pudo conectar con el backend. Ejecuta npm run server:dev." : requestError.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-panel" aria-labelledby="auth-title">
      <p className="eyebrow">AGENDA SEGURA</p>
      <h1 id="auth-title">{mode === "login" ? "Bienvenido de nuevo" : "Crea tu cuenta"}</h1>
      <p className="auth-copy">Tus contactos quedan guardados en una base de datos privada.</p>
      <div className="auth-tabs" role="tablist" aria-label="Acceso a la agenda">
        <button type="button" className={mode === "login" ? "activo" : ""} onClick={() => { setMode("login"); setErrores(initialErrors); }} role="tab" aria-selected={mode === "login"}>Iniciar sesión</button>
        <button type="button" className={mode === "register" ? "activo" : ""} onClick={() => { setMode("register"); setErrores(initialErrors); }} role="tab" aria-selected={mode === "register"}>Registrarme</button>
      </div>
      <form onSubmit={submit} className="auth-form">
        {mode === "register" && <label>Nombre completo<input required value={form.nombre} aria-invalid={Boolean(errores.nombre)} onChange={(event) => setForm({ ...form, nombre: event.target.value })} />{errores.nombre && <span className="field-error" role="alert">{errores.nombre}</span>}</label>}
        <label>Correo electrónico<input required type="email" value={form.correo} aria-invalid={Boolean(errores.correo)} onChange={(event) => setForm({ ...form, correo: event.target.value })} />{errores.correo && <span className="field-error" role="alert">{errores.correo}</span>}</label>
        <label>Contraseña<input required minLength={6} type="password" value={form.password} aria-invalid={Boolean(errores.password)} onChange={(event) => setForm({ ...form, password: event.target.value })} />{errores.password && <span className="field-error" role="alert">{errores.password}</span>}</label>
        {mode === "register" && <label>Rol<select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}><option value="user">Usuario</option><option value="admin">Administrador</option></select></label>}
        {mode === "register" && form.role === "admin" && <label>Código de administrador<input required value={form.adminCode} aria-invalid={Boolean(errores.adminCode)} onChange={(event) => setForm({ ...form, adminCode: event.target.value })} />{errores.adminCode && <span className="field-error" role="alert">{errores.adminCode}</span>}</label>}
        <button type="submit" disabled={loading}>{loading ? "Procesando..." : mode === "login" ? "Entrar a mi agenda" : "Crear cuenta"}</button>
      </form>
    </section>
  );
}
