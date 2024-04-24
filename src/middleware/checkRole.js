const jwt = require("jsonwebtoken");
const { jwt_secret, cookie_token } = require("../config/config");

const checkUserRole = (allowedRoles) => (req, res, next) => {
  const token = req.cookies[cookie_token];

  if (token) {
    jwt.verify(token, jwt_secret, (err, decoded) => {
      if (err) {
        res.status(403).send("Acceso denegado. Token inválido.");
      } else {
        const userRole = decoded.user.role;
        if (allowedRoles.includes(userRole)) {
          next();
        } else {
          res
            .status(403)
            .send(
              "Acceso denegado. No tienes permiso para acceder a esta página."
            );
        }
      }
    });
  } else {
    res.status(403).send("Acceso denegado. Token no proporcionado.");
  }
};

module.exports = checkUserRole;
