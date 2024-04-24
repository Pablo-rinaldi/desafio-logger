const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  req.logger.fatal("Fatal error");
  req.logger.error("Error");
  req.logger.debug("Debug Message");
  req.logger.info("Info Message");
  req.logger.warning("Warning Message");
  res.send("Test de logs");
});

module.exports = router;
