import app from "./app.js";
import "./config/database.js";

const port = Number(process.env.PORT || 3001);
app.listen(port, () => console.log(`API ejecutándose en http://localhost:${port}`));
