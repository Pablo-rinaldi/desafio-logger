const express = require("express");
const router = express.Router();
const ViewsController = require("../controllers/view.controller.js");
const viewsController = new ViewsController();
const checkUserRole = require("../middleware/checkRole.js");
const passport = require("passport");

router.get("/login", viewsController.renderLogin);
router.get("/register", viewsController.renderRegister);

router.get(
  "/products",
  passport.authenticate("jwt", { session: false }),
  checkUserRole(["user"]),
  viewsController.renderProducts.bind(viewsController)
);

router.get(
  "/createProducts",
  checkUserRole(["admin"]),
  viewsController.createProducts
);

router.get(
  "/manageProducts",
  passport.authenticate("jwt", { session: false }),
  checkUserRole(["admin"]),
  viewsController.renderAdminProducts.bind(viewsController)
);

router.get(
  "/updateProduct/:pid",
  passport.authenticate("jwt", { session: false }),
  checkUserRole(["admin"]),
  viewsController.updateProduct
);

router.get("/carts/:cid", viewsController.renderCart);
router.get("/chat", checkUserRole(["user"]), viewsController.renderChat);

router.get("/", viewsController.renderHome);

module.exports = router;
