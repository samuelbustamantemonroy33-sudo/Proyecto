export default function Alert({ message, onClose }) {
  if (!message) return null;
  return <div className="alert" role="alert"><span>{message}</span><button className="alert-close" aria-label="Cerrar aviso" onClick={onClose}>×</button></div>;
}
