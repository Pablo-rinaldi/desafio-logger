const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/product.controller.js");
const checkUserRole = require("../middleware/checkRole.js");
const productController = new ProductController();

router.get("/", productController.getProducts);
router.get("/:pid", productController.getProductById);
router.post("/create", checkUserRole(["admin"]), productController.addProduct);
router.post(
  "/update/:pid",
  checkUserRole(["admin"]),
  productController.updateProduct
);
router.post(
  "/delete/:pid",
  checkUserRole(["admin"]),
  productController.deleteProduct
);

module.exports = router;
