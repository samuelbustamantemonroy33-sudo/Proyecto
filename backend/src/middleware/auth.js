import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "development-secret-change-me";

export function createToken(user) {
  return jwt.sign({ id: user.id, role: user.role, correo: user.correo }, secret, { expiresIn: "8h" });
}

export function requireAuth(request, response, next) {
  const [scheme, token] = (request.headers.authorization || "").split(" ");
  if (scheme !== "Bearer" || !token) return response.status(401).json({ error: "Debes iniciar sesión." });
  try {
    request.user = jwt.verify(token, secret);
    return next();
  } catch {
    return response.status(401).json({ error: "La sesión no es válida o ha expirado." });
  }
}

export function requireAdmin(request, response, next) {
  if (request.user?.role !== "admin") return response.status(403).json({ error: "No tienes permisos para esta acción." });
  return next();
}
