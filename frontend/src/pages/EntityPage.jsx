import { useCallback, useEffect, useState } from "react";
import client from "../api/client.js";
import { entityByKey } from "../config/entities.js";
import Alert from "../components/Alert.jsx";
import DataTable from "../components/DataTable.jsx";
import EntityForm from "../components/EntityForm.jsx";
import Modal from "../components/Modal.jsx";

const getId = (row) => row.id ?? Object.entries(row).find(([key]) => key.startsWith("id_"))?.[1];
const getErrorMessage = (error) => error.response?.data?.mensaje || "No se pudo completar la operación.";

export default function EntityPage({ entity }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState(null);
  const [association, setAssociation] = useState(null);
  const [associationOptions, setAssociationOptions] = useState([]);
  const [associationValue, setAssociationValue] = useState("");

  const loadRows = useCallback(async () => {
    setLoading(true);
    try {
      const response = await client.get(entity.endpoint);
      setRows(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setNotice(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [entity]);

  useEffect(() => { loadRows(); }, [loadRows]);

  const save = async (payload) => {
    setSaving(true);
    try {
      if (editing) await client.patch(`${entity.endpoint}${getId(editing)}`, payload);
      else await client.post(entity.endpoint, payload);
      setEditing(null);
      setNotice(editing ? "Registro actualizado correctamente." : "Registro creado correctamente.");
      await loadRows();
    } catch (error) {
      setNotice(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row) => {
    if (!window.confirm("¿Eliminar este registro? Esta acción no se puede deshacer.")) return;
    try {
      await client.delete(`${entity.endpoint}${getId(row)}`);
      setNotice("Registro eliminado correctamente.");
      await loadRows();
    } catch (error) {
      setNotice(getErrorMessage(error));
    }
  };

  const specialAction = async (row, action) => {
    try {
      await client.patch(`${entity.endpoint}${getId(row)}/${action}`);
      setNotice("Acción aplicada correctamente.");
      await loadRows();
    } catch (error) {
      setNotice(getErrorMessage(error));
    }
  };

  const openAssociation = async (row, type) => {
    const relatedEntity = entityByKey[type === "autores" ? "autores" : "categorias"];
    try {
      const response = await client.get(relatedEntity.endpoint);
      setAssociationOptions(Array.isArray(response.data) ? response.data : []);
      setAssociation({ row, type });
      setAssociationValue("");
    } catch (error) {
      setNotice(getErrorMessage(error));
    }
  };

  const associate = async (event) => {
    event.preventDefault();
    if (!associationValue) return;
    const field = association.type === "autores" ? "id_autor" : "id_categoria";
    try {
      await client.post(`${entity.endpoint}${getId(association.row)}/${association.type}`, { [field]: Number(associationValue) });
      setAssociation(null);
      setNotice("Asociación creada correctamente.");
      await loadRows();
    } catch (error) {
      setNotice(getErrorMessage(error));
    }
  };

  const columns = entity.fields.map((field) => ({ name: field.name, label: field.label, type: field.type }));
  const actions = entity.special === "book" ? [
    { label: "+ Autor", variant: "button-muted", onClick: (row) => openAssociation(row, "autores") },
    { label: "+ Categoría", variant: "button-muted", onClick: (row) => openAssociation(row, "categorias") }
  ] : entity.special === "loan" ? [{ label: "Devolver", variant: "button-success", onClick: (row) => specialAction(row, "devolver") }]
    : entity.special === "reservation" ? [{ label: "Cancelar", variant: "button-warning", onClick: (row) => specialAction(row, "cancelar") }]
      : entity.special === "fine" ? [{ label: "Pagar", variant: "button-success", onClick: (row) => specialAction(row, "pagar") }]
        : entity.special === "notification" ? [{ label: "Marcar leída", variant: "button-success", onClick: (row) => specialAction(row, "marcar-leida") }]
          : [];

  return (
    <div className="page-content">
      <div className="page-heading">
        <div><p className="eyebrow">Gestión de biblioteca</p><h1>{entity.label}</h1><p className="page-description">Administra los registros de {entity.label.toLowerCase()}.</p></div>
        <button className="button button-primary" onClick={() => setEditing({})}>+ Nuevo</button>
      </div>
      <Alert message={notice} onClose={() => setNotice("")} />
      {loading ? <div className="loading-state">Cargando registros...</div> : <DataTable columns={columns} rows={rows} onEdit={setEditing} onDelete={remove} actions={actions} />}
      {editing && <Modal title={editing && Object.keys(editing).length ? `Editar ${entity.label.slice(0, -1)}` : `Nuevo ${entity.label.slice(0, -1)}`} onClose={() => setEditing(null)}><EntityForm entity={entity} values={editing} onSubmit={save} onCancel={() => setEditing(null)} saving={saving} /></Modal>}
      {association && <Modal title={`Asociar ${association.type === "autores" ? "autor" : "categoría"}`} onClose={() => setAssociation(null)}><form className="association-form" onSubmit={associate}><label className="form-field"><span>Selecciona un registro</span><select value={associationValue} required onChange={(event) => setAssociationValue(event.target.value)}><option value="">Selecciona una opción</option>{associationOptions.map((option) => <option key={getId(option)} value={getId(option)}>{option.nombre} {option.apellido || ""}</option>)}</select></label><div className="form-actions"><button type="button" className="button button-secondary" onClick={() => setAssociation(null)}>Cancelar</button><button className="button button-primary">Asociar</button></div></form></Modal>}
    </div>
  );
}
