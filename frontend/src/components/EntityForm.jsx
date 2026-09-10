import { useEffect, useState } from "react";
import client from "../api/client.js";
import { entityByKey } from "../config/entities.js";

const getInitialValue = (field, values) => {
  const value = values?.[field.name];
  if (value === null || value === undefined) return field.type === "boolean" ? false : "";
  return field.type === "date" ? String(value).slice(0, 10) : value;
};

export default function EntityForm({ entity, values, onSubmit, onCancel, saving }) {
  const [formValues, setFormValues] = useState(() => Object.fromEntries(entity.fields.map((field) => [field.name, getInitialValue(field, values)])));
  const [options, setOptions] = useState({});
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    setFormValues(Object.fromEntries(entity.fields.map((field) => [field.name, getInitialValue(field, values)])));
  }, [entity, values]);

  useEffect(() => {
    let active = true;
    const relationFields = entity.fields.filter((field) => field.relation);
    if (relationFields.length === 0) {
      setLoadingOptions(false);
      return undefined;
    }
    setLoadingOptions(true);
    Promise.all(relationFields.map(async (field) => {
      const response = await client.get(entityByKey[field.relation].endpoint);
      return [field.name, Array.isArray(response.data) ? response.data : []];
    })).then((entries) => {
      if (active) setOptions(Object.fromEntries(entries));
    }).catch(() => {
      if (active) setOptions({});
    }).finally(() => {
      if (active) setLoadingOptions(false);
    });
    return () => { active = false; };
  }, [entity]);

  const updateValue = (name, value) => setFormValues((current) => ({ ...current, [name]: value }));

  const submit = (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(entity.fields.map((field) => {
      let value = formValues[field.name];
      if (field.type === "number" && value !== "") value = Number(value);
      if (field.type === "boolean") value = Boolean(value);
      return [field.name, value === "" ? null : value];
    }));
    onSubmit(payload);
  };

  return (
    <form className="entity-form" onSubmit={submit}>
      <div className="form-grid">
        {entity.fields.map((field) => (
          <label className={`form-field ${field.type === "textarea" ? "field-wide" : ""}`} key={field.name}>
            <span>{field.label}{field.required ? " *" : ""}</span>
            {field.type === "textarea" ? (
              <textarea value={formValues[field.name]} required={field.required} onChange={(event) => updateValue(field.name, event.target.value)} />
            ) : field.type === "relation" ? (
              <select value={formValues[field.name]} required={field.required} disabled={loadingOptions} onChange={(event) => updateValue(field.name, event.target.value)}>
                <option value="">Selecciona una opción</option>
                {(options[field.name] || []).map((option) => {
                  const id = option.id ?? Object.entries(option).find(([key]) => key.startsWith("id_"))?.[1];
                  const displayField = entityByKey[field.relation].displayField;
                  return <option key={id} value={id}>{option[displayField] ?? `Registro ${id}`}</option>;
                })}
              </select>
            ) : (
              <input type={field.type === "boolean" ? "checkbox" : (field.inputType || field.type)} checked={field.type === "boolean" ? formValues[field.name] : undefined} value={field.type === "boolean" ? undefined : formValues[field.name]} required={field.required} maxLength={field.maxLength} onChange={(event) => updateValue(field.name, field.type === "boolean" ? event.target.checked : event.target.value)} />
            )}
          </label>
        ))}
      </div>
      <div className="form-actions">
        <button type="button" className="button button-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="button button-primary" disabled={saving || loadingOptions}>{saving ? "Guardando..." : "Guardar"}</button>
      </div>
    </form>
  );
}
