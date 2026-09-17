// Importa los hooks para manejar estado local y efectos.
import { useEffect, useState } from "react";
// Importa estilos globales del componente principal.
import "./App.css";
// Importa la tarjeta visual para cada contacto.
import ContactoCard from "./components/ContactoCard";
// Importa el formulario para crear contactos.
import FormularioContacto from "./components/FormularioContacto";
import AuthPanel from "./components/AuthPanel";

const tokenStorageKey = "agenda-token";

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

export default function App() {
  const [contactos, setContactos] = useState([]);
  const [sesion, setSesion] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Guardará el contacto completo a editar (o null si solo estamos agregando)
  const [contactoEnEdicion, setContactoEnEdicion] = useState(null);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const [contactosPorPagina, setContactosPorPagina] = useState(3);

  const solicitar = async (ruta, opciones = {}) => {
    const token = localStorage.getItem(tokenStorageKey);
    const response = await fetch(ruta, {
      ...opciones,
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
    const data = response.status === 204 ? null : await readResponse(response);
    if (!response.ok) {
      const detalles = data?.fields
        ? Object.values(data.fields).filter(Boolean).join(" ")
        : "";
      throw new Error([data?.error, detalles].filter(Boolean).join(" ") || "No se pudo completar la solicitud.");
    }
    return data;
  };

  useEffect(() => {
    const token = localStorage.getItem(tokenStorageKey);
    if (!token) {
      setCargando(false);
      return;
    }
    solicitar("/api/auth/me")
      .then(({ user }) => { setSesion(user); return solicitar("/api/contacts"); })
      .then(({ contacts }) => setContactos(contacts))
      .catch(() => localStorage.removeItem(tokenStorageKey))
      .finally(() => setCargando(false));
  }, []);

  const autenticar = ({ user, token }) => {
    localStorage.setItem(tokenStorageKey, token);
    setSesion(user);
    setCargando(true);
    solicitar("/api/contacts").then(({ contacts }) => setContactos(contacts)).catch((requestError) => setError(requestError.message)).finally(() => setCargando(false));
  };

  // Agrega o edita según corresponda
  const guardarContacto = async (datos) => {
    try {
      setError("");
      if (contactoEnEdicion) {
        const { contact } = await solicitar(`/api/contacts/${contactoEnEdicion.id}`, { method: "PUT", body: JSON.stringify(datos) });
        setContactos((prev) => prev.map((c) => (c.id === contact.id ? contact : c)));
        setContactoEnEdicion(null);
      } else {
        const { contact } = await solicitar("/api/contacts", { method: "POST", body: JSON.stringify(datos) });
        setContactos((prev) => [...prev, contact]);
      }
    } catch (guardarError) {
      console.error("Error al guardar el contacto:", guardarError);
      setError(guardarError.message || "No se pudo guardar el contacto.");
      throw guardarError;
    }
  };

  const eliminarContacto = async (id) => {
    try {
      await solicitar(`/api/contacts/${id}`, { method: "DELETE" });
      setContactos((prev) => prev.filter((c) => c.id !== id));
    } catch (requestError) {
      setError(requestError.message);
    }
    // Si eliminamos el que se estaba editando, limpiamos la edición
    if (contactoEnEdicion?.id === id) setContactoEnEdicion(null);
  };

  // Prepara un contacto para cargarlo en el formulario
  const seleccionarParaEditar = (contacto) => {
    setContactoEnEdicion(contacto);
  };

  const normalizarTexto = (texto) =>
    texto
      .toLocaleLowerCase("es")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const contactosVisibles = contactos
    .filter((contacto) => {
      const termino = normalizarTexto(busqueda.trim());
      return !termino || normalizarTexto(contacto.nombre).startsWith(termino);
    })
    .sort((a, b) => {
      const resultado = normalizarTexto(a.nombre).localeCompare(
        normalizarTexto(b.nombre),
        "es"
      );
      return ordenAscendente ? resultado : -resultado;
    });

  const totalPaginas = Math.max(
    1,
    Math.ceil(contactosVisibles.length / contactosPorPagina)
  );

  const indiceInicio = (paginaActual - 1) * contactosPorPagina;
  const contactosPaginados = contactosVisibles.slice(
    indiceInicio,
    indiceInicio + contactosPorPagina
  );

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, ordenAscendente, contactosPorPagina]);

  useEffect(() => {
    if (paginaActual > totalPaginas) {
      setPaginaActual(totalPaginas);
    }
  }, [paginaActual, totalPaginas]);

  if (cargando) return <main className="app-container"><p>Cargando tu agenda...</p></main>;
  if (!sesion) return <main className="app-container"><AuthPanel onAuthenticated={autenticar} /></main>;

  return (
    <main className="app-container">
      <header className="app-header">
        <div>
          <p className="eyebrow">ADSO / CONTACTOS</p>
          <h1 className="app-title">Tu agenda, en orden.</h1>
          <p className="app-subtitle">Guarda la información de las personas importantes para ti.</p>
        </div>
        <div className="session-actions"><span>{sesion.nombre} · {sesion.role}</span><button type="button" onClick={() => { localStorage.removeItem(tokenStorageKey); setSesion(null); setContactos([]); }}>Cerrar sesión</button></div>
        <div className="contact-count" aria-label={`${contactos.length} contactos guardados`}>
          <strong>{String(contactos.length).padStart(2, "0")}</strong>
          <span>contactos</span>
        </div>
      </header>

      {error && <div className="alert-error" role="alert"><span aria-hidden="true">!</span><p>{error}</p><button type="button" onClick={() => setError("")} aria-label="Cerrar mensaje">&times;</button></div>}

      {/* Pasamos guardarContacto y el contacto que se va a editar */}
      <FormularioContacto
        onGuardar={guardarContacto}
        contactoEnEdicion={contactoEnEdicion}
        onCancelar={() => setContactoEnEdicion(null)}
      />

      <section className="contactos-section" aria-labelledby="contactos-title">
        <div className="section-heading"><div><p className="eyebrow">LISTA PERSONAL</p><h2 id="contactos-title">Contactos guardados</h2></div><span className="section-line" aria-hidden="true" /></div>
        <div className="controles-contactos" role="search">
          <label htmlFor="buscar-contactos">Buscar por nombre</label>
          <div className="controles-contactos-fila">
            <input
              id="buscar-contactos"
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Ej. Ana o Z"
              aria-label="Buscar contactos por el inicio del nombre"
            />
            <button
              type="button"
              className="btn-ordenar"
              onClick={() => setOrdenAscendente((actual) => !actual)}
              aria-label={`Ordenar contactos de ${ordenAscendente ? "Z a A" : "A a Z"}`}
            >
              {ordenAscendente ? "A-Z" : "Z-A"}
            </button>
            <select
              className="select-paginacion"
              value={contactosPorPagina}
              onChange={(e) => setContactosPorPagina(Number(e.target.value))}
              aria-label="Cantidad de contactos por página"
            >
              <option value={2}>2 / pág.</option>
              <option value={3}>3 / pág.</option>
              <option value={5}>5 / pág.</option>
            </select>
          </div>
        </div>
        {busqueda && <p className="resumen-busqueda">Resultados para “{busqueda}”: {contactosVisibles.length}</p>}
        <p className="resumen-paginacion">
          Página {paginaActual} de {totalPaginas} · {contactosVisibles.length} contacto{contactosVisibles.length === 1 ? "" : "s"}
        </p>
        <div className="lista-contactos">
        {contactosPaginados.length === 0 ? (
          <p className="sin-resultados">No se encontraron contactos con ese inicio de nombre.</p>
        ) : contactosPaginados.map((c) => (
          <ContactoCard
            key={c.id}
            contacto={c}
            esAdministrador={sesion.role === "admin"}
            onDelete={eliminarContacto}
            onEdit={seleccionarParaEditar}
          />
        ))}
        </div>

        <div className="paginador" aria-label="Paginación de contactos">
          <button
            type="button"
            className="btn-pagina"
            disabled={paginaActual === 1}
            onClick={() => setPaginaActual((actual) => Math.max(1, actual - 1))}
          >
            ← Anterior
          </button>

          {Array.from({ length: totalPaginas }, (_, index) => index + 1).map((numero) => (
            <button
              key={numero}
              type="button"
              className={`btn-numero ${numero === paginaActual ? "activo" : ""}`}
              onClick={() => setPaginaActual(numero)}
            >
              {numero}
            </button>
          ))}

          <button
            type="button"
            className="btn-pagina"
            disabled={paginaActual === totalPaginas}
            onClick={() => setPaginaActual((actual) => Math.min(totalPaginas, actual + 1))}
          >
            Siguiente →
          </button>
        </div>
      </section>
    </main>
  );
}