const mongoose = require("mongoose");
const configObject = require("./config/config.js");
const { mongo_url } = configObject;

mongoose
  .connect(mongo_url)
  .then(() => console.log("Conexión exitosa"))
  .catch(() => req.logger.error("No pudo conectarse a la base de datos"));
