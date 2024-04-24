const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/product.controller.js");
const productController = new ProductController();

router.get("/", productController.getMockProducts);
router.get("/add", productController.addMockProduct);

module.exports = router;
