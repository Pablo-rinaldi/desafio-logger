const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();

class ProductController {
  async addProduct(req, res) {
    const newProduct = req.body;
    try {
      await productRepository.addProduct(newProduct);
      res.redirect("/manageProducts");
    } catch (error) {
      req.logger.error("No se pudo agregar el producto");
      res.status(500).send("Error, no se pudo agregar el producto");
    }
  }

  async getProducts(req, res) {
    try {
      let { limit = 10, page = 1, sort, query } = req.query;

      const products = await productRepository.getProducts(
        limit,
        page,
        sort,
        query
      );

      res.json(products);
    } catch (error) {
      req.logger.error("No se pudieron obtener los productos");
      res.status(500).send("Error, no se pudieron obtener los productos");
    }
  }

  async getProductById(req, res) {
    const id = req.params.pid;
    try {
      const searched = await productRepository.getProductById(id);
      if (!searched) {
        req.logger.debug("Producto no encontrado");
        return res.json({
          error: "Producto no encontrado",
        });
      }
      res.json(searched);
    } catch (error) {
      req.logger.error("Error al buscar el  Producto", error);
      res.status(500).send("Error al buscar el Producto");
    }
  }

  async updateProduct(req, res) {
    try {
      const id = req.params.pid;
      const updatedProduct = req.body;

      await productRepository.updateProduct(id, updatedProduct);

      res.redirect("/manageProducts");
    } catch (error) {
      req.logger.error("Error al actualizar el producto");
      res.status(500).send("Error al actualizar el producto");
    }
  }

  async deleteProduct(req, res) {
    const id = req.params.pid;
    try {
      await productRepository.deleteProduct(id);

      res.redirect("/manageProducts");
    } catch (error) {
      req.logger.error("Error al eliminar el producto");
      res.status(500).send("Error al eliminar el producto");
    }
  }

  async getMockProducts(req, res) {
    try {
      const createProducts = await productRepository.getProductsMockProducts();
      res.send(createProducts);
    } catch (error) {
      req.logger.error("No se pudieron mostrar los productos del mock");
      res.status(500).send("Error al mostrar los productos del mock");
    }
  }

  async addMockProduct(req, res) {
    try {
      const newMockProduct = await productRepository.addMockProduct();

      res.send(newMockProduct);
    } catch (error) {
      req.logger.error("No se pudo agregar el producto del mock");
      res.status(500).send("Error al agregar el producto del mock");
    }
  }
}

module.exports = ProductController;
