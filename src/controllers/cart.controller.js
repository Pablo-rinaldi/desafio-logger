const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const TicketRepository = require("../repositories/ticket.repository.js");
const ticketRepository = new TicketRepository();

class CartController {
  async newCart(req, res) {
    try {
      const newCart = await cartRepository.createCart();
      res.json(newCart);
    } catch (error) {
      req.logger.error("No se pudo crear el carrito");
      res.status(500).send("No se pudo crear el carrito");
    }
  }

  async getCart(req, res) {
    const cartId = req.params.cid;
    try {
      const cart = await cartRepository.getCart(cartId);
      if (!cart) {
        req.logger.debug("Carrito no encontrado");
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
      res.json(cart);
    } catch (error) {
      res.status(500).send("No se pudo obtener el carrito", error);
      req.logger.error("No se pudo obtener el carrito");
    }
  }

  async addProductToCart(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;
    try {
      await cartRepository.addProduct(cartId, productId, quantity);
      const cartID = req.user.cart.toString();

      res.redirect(`/carts/${cartID}`);
    } catch (error) {
      req.logger.debug("No se pudo agregar el producto");
      res.status(500).send("No se pudo agregar el producto");
    }
  }

  async deleteCartProduct(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    try {
      const updatedCart = await cartRepository.deleteProduct(cartId, productId);
      res.json({
        status: "success",
        message: "Producto eliminado del carrito",
        updatedCart,
      });
    } catch (error) {
      req.logger.error("No se pudo eliminar el producto del carrito");
      res.status(500).send("No se pudo eliminar del carrito");
    }
  }

  async updateCartProducts(req, res) {
    const cartId = req.params.cid;
    const updatedProducts = req.body;

    try {
      const updatedCart = await cartRepository.updateCartProducts(
        cartId,
        updatedProducts
      );
      res.json(updatedCart);
    } catch (error) {
      req.logger.error("No se pudo actualizar el carrito");
      res.status(500).send("Error al actualizar el carrito");
    }
  }

  async updateQuantity(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;
    try {
      const updatedCart = await cartRepository.updateInCartQuantity(
        cartId,
        productId,
        newQuantity
      );

      res.json({
        status: "success",
        message: "Cantidad del producto actualizada",
        updatedCart,
      });
    } catch (error) {
      req.logger.error("Error al actualizar la cantidad de productos");
      res.status(500).send("Error al actualizar la cantidad de productos");
    }
  }

  async clearCart(req, res) {
    const cartId = req.params.cid;
    try {
      const updatedCart = await cartRepository.clearCart(cartId);

      res.json({
        status: "success",
        message: "Todos los productos del carrito fueron eliminados",
        updatedCart,
      });
    } catch (error) {
      req.logger.error("Error al eliminar los productos");
      res.status(500).send("Error, no se pudieron eliminar los productos");
    }
  }

  async purchase(req, res) {
    const cartId = req.params.cid;
    try {
      const cart = await cartRepository.getCart(cartId);

      if (!cart) {
        req.logger.error("No existe el carrito");
        throw Error("No existe el carrito");
      } else {
        const hasProducts = cart.products.length;
        if (!hasProducts) {
          req.logger.debug("No hay productos en el carrito");
          throw Error("No hay productos en el carrito");
        } else {
          const cartProducts = cart.products;
          const productsWithoutStock = [];
          let totalAmount = 0;

          for (let index = 0; index < cartProducts.length; index++) {
            const item = cartProducts[index];
            const productId = item.product._id;
            const quantity = item.quantity;
            const product = await productRepository.getProductById(productId);
            if (product.stock < quantity) {
              productsWithoutStock.push(item);
            } else {
              const amount = quantity * product.price;
              totalAmount += amount;
              const newStock = product.stock - quantity;
              product.stock = newStock;
              product.save();
            }
          }

          if (totalAmount) {
            await ticketRepository.createTicket(req.user.email, totalAmount);
            await cartRepository.updateCartProducts(
              cartId,
              productsWithoutStock
            );
          }

          res.redirect("/api/users/profile");
        }
      }
    } catch (error) {
      req.logger.error("Error, no se pudo completar la compra");
      res.status(500).send("Error, no se pudo completar la compra", error);
    }
  }
}

module.exports = CartController;
