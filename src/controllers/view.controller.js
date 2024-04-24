const ProductModel = require("../models/product.model.js");
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();

class ViewsController {
  async renderProducts(req, res) {
    try {
      const { page = 1, limit = 3 } = req.query;

      const skip = (page - 1) * limit;

      const products = await ProductModel.find().skip(skip).limit(limit);

      const totalProducts = await ProductModel.countDocuments();

      const totalPages = Math.ceil(totalProducts / limit);

      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;

      const newArray = products.map((product) => {
        const { _id, ...rest } = product.toObject();
        return { id: _id, ...rest };
      });

      const cartId = req.user.cart.toString();

      res.render("products", {
        products: newArray,
        hasPrevPage,
        hasNextPage,
        prevPage: page > 1 ? parseInt(page) - 1 : null,
        nextPage: page < totalPages ? parseInt(page) + 1 : null,
        currentPage: parseInt(page),
        totalPages,
        cartId,
      });
    } catch (error) {
      req.logger.error("No se pudieron mostrar los productos");
      res.status(500).json({
        status: "error",
        error: "Error interno del servidor",
      });
    }
  }

  async renderAdminProducts(req, res) {
    try {
      const { page = 1, limit = 3 } = req.query;

      const skip = (page - 1) * limit;

      const products = await ProductModel.find().skip(skip).limit(limit);

      const totalProducts = await ProductModel.countDocuments();

      const totalPages = Math.ceil(totalProducts / limit);

      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;

      const newArray = products.map((product) => {
        const { _id, ...rest } = product.toObject();
        return { id: _id, ...rest };
      });

      const cartId = req.user.cart.toString();

      res.render("manageProducts", {
        products: newArray,
        hasPrevPage,
        hasNextPage,
        prevPage: page > 1 ? parseInt(page) - 1 : null,
        nextPage: page < totalPages ? parseInt(page) + 1 : null,
        currentPage: parseInt(page),
        totalPages,
        cartId,
      });
    } catch (error) {
      req.logger.error("No se pudieron mostrar los productos", error);
      res.status(500).json({
        status: "error",
        error: "Error interno del servidor",
      });
    }
  }

  async renderCart(req, res) {
    const cartId = req.params.cid;
    try {
      const cart = await cartRepository.getCart(cartId);

      if (!cart) {
        req.logger.debug("No existe el carrito con ese id");
        return res.status(404).json({ error: "Carrito no encontrado" });
      }

      const inCartProducts = cart.products.map((item) => ({
        product: item.product.toObject(),
        quantity: item.quantity,
      }));

      res.render("carts", { products: inCartProducts, cid: cartId });
    } catch (error) {
      req.logger.error("Error al obtener el carrito", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async updateProduct(req, res) {
    res.render("updateProduct", { pid: req.params.pid });
  }

  async renderLogin(req, res) {
    res.render("login");
  }

  async renderRegister(req, res) {
    res.render("register");
  }

  async createProducts(req, res) {
    try {
      res.render("createProducts");
    } catch (error) {
      req.logger.error("Error interno del servidor", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async renderChat(req, res) {
    res.render("chat");
  }

  async renderHome(req, res) {
    res.render("home");
  }
}

module.exports = ViewsController;
