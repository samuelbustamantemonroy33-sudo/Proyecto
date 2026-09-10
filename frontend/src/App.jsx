import { NavLink, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { entityByKey, navigationGroups } from "./config/entities.js";
import EntityPage from "./pages/EntityPage.jsx";

function Sidebar() {
  return <aside className="sidebar"><div className="brand"><span className="brand-mark">B</span><div><strong>Biblioteca</strong><small>Panel de gestión</small></div></div><nav>{navigationGroups.map((group) => <div className="nav-group" key={group.label}><p>{group.label}</p>{group.items.map((key) => <NavLink key={key} to={`/${key}`} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>{entityByKey[key].label}</NavLink>)}</div>)}</nav><div className="sidebar-footer">API Biblioteca<br /><span>Conectada a localhost:3000</span></div></aside>;
}

function App() {
  const location = useLocation();
  return <div className="app-shell"><Sidebar /><main className="main-area"><header className="topbar"><span className="breadcrumb">Biblioteca Central</span><span className="current-path">{location.pathname === "/" ? "Inicio" : "Panel de administración"}</span></header><Routes><Route path="/" element={<Navigate to="/libros" replace />} />{Object.values(entityByKey).map((entity) => <Route key={entity.key} path={`/${entity.key}`} element={<EntityPage entity={entity} />} />)}<Route path="*" element={<Navigate to="/libros" replace />} /></Routes></main></div>;
}

export default App;
