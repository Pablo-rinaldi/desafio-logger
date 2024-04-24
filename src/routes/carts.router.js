const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cart.controller.js");
const cartController = new CartController();

router.post("/", cartController.newCart);
router.get("/:cid", cartController.getCart);
router.post("/:cid/product/:pid", cartController.addProductToCart);
router.delete("/:cid/product/:pid", cartController.deleteCartProduct);
router.put("/:cid", cartController.updateCartProducts);
router.put("/:cid/product/:pid", cartController.updateQuantity);
router.delete("/:cid", cartController.clearCart);
router.post("/:cid/purchase", cartController.purchase);

module.exports = router;
