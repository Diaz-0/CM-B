const TokenAutenticacion = require("./autorizacion.middleware");

const autorizarRoles = (Rolespermitidos) => {
    return (req, res, next) => {
      TokenAutenticacion(req, res, () => {
        if (!Rolespermitidos.includes(req.user.id_rol)) {
          return res.status(403).json({ error: "Acceso denegado" });
        }
        next();
      });
    };
  };
  
  module.exports = autorizarRoles;