const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../CONEXION/constants");

const TokenAutenticacion = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "No se proporcionó token de autenticación" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Token inválido" });
  }
};

module.exports = TokenAutenticacion;
