const ProductModel = require("../models/product.model.js");
const { createProducts, createProduct } = require("../utils/faker.js");
const CustomError = require("../utils/errors/customError.js");

class ProductRepository {
  async addProduct({
    title,
    description,
    price,
    img,
    code,
    stock,
    category,
    thumbnails,
  }) {
    try {
      if (!title || !description || !price || !code || !stock || !category) {
        const missingFields = [];

        if (!title) {
          missingFields.push("titulo");
        }

        if (!description) {
          missingFields.push("descripcion");
        }

        if (!price) {
          missingFields.push("precio");
        }

        if (!code) {
          missingFields.push("codigo");
        }

        if (!stock) {
          missingFields.push("stock");
        }

        if (!category) {
          missingFields.push("categoria");
        }

        const customError = CustomError.createError(
          "Error de validacion de formulario",
          400,
          `Los siguientes campos son requeridos: ${missingFields}`,
          "Campos vacios"
        );
        throw customError;
      }

      const existingProduct = await ProductModel.findOne({ code: code });

      if (existingProduct) {
        req.logger.debug("El codigo debe ser unico");
        return;
      }

      const newProduct = new ProductModel({
        title,
        description,
        price,
        img,
        code,
        stock,
        category,
        status: true,
        thumbnails: thumbnails || [],
      });

      await newProduct.save();

      return newProduct;
    } catch (error) {
      req.logger.error("Error al agregar el nuevo producto");

      throw error;
    }
  }

  async getProducts(limit = 10, page = 1, sort, query) {
    try {
      const skip = (page - 1) * limit;

      let queryOptions = {};

      if (query) {
        queryOptions = { category: query };
      }

      const sortOptions = {};
      if (sort) {
        if (sort === "asc" || sort === "desc") {
          sortOptions.price = sort === "asc" ? 1 : -1;
        }
      }

      const products = await ProductModel.find(queryOptions)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);

      const totalProducts = await ProductModel.countDocuments(queryOptions);

      const totalPages = Math.ceil(totalProducts / limit);

      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;

      return {
        docs: products,
        totalPages,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage
          ? `/api/products?limit=${limit}&page=${
              page - 1
            }&sort=${sort}&query=${query}`
          : null,
        nextLink: hasNextPage
          ? `/api/products?limit=${limit}&page=${
              page + 1
            }&sort=${sort}&query=${query}`
          : null,
      };
    } catch (error) {
      req.logger.error("No se pudieron obtener los productos");
      throw new Error("Error,  no se pudieron obtener los productos");
    }
  }

  async getProductById(id) {
    try {
      const product = await ProductModel.findById(id);

      if (!product) {
        req.logger.debug("Producto no encontrado");

        return null;
      }

      console.log("Producto encontrado");
      return product;
    } catch (error) {
      req.logger.error("Error en el codigo");
      throw new Error("Error, hay un error en el codigo");
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      await ProductModel.findByIdAndUpdate(id, updatedProduct);
      console.log("Producto actualizado correctamente");
    } catch (error) {
      req.logger.error("no se puede actualizar el producto");
      throw new Error("Error, no se puede actualizar el producto");
    }
  }

  async deleteProduct(id) {
    try {
      const deleted = await ProductModel.findByIdAndDelete(id);

      if (!deleted) {
        req.logger.debug("No se pudo encontrar el producto");

        return null;
      }

      console.log("Producto eliminado correctamente!");
      return deleted;
    } catch (error) {
      req.logger.error("No se pudo eliminar el producto");
      throw new Error("Error, no se pudo eliminar correctamente");
    }
  }

  async getProductsMockProducts() {
    try {
      const mockProducts = createProducts();
      if (!mockProducts) {
        req.logger.debug("No se encontraron los productos del mock");
        console.log("No se encontraron productos en el mock");
        return null;
      } else {
        console.log("se encontraron los productos en el mock");
        return mockProducts;
      }
    } catch (error) {
      req.logger.error("No se pueden mostrar los productos del mock");
      throw new Error("Error, no se pueden mostrar los productos del mock");
    }
  }

  async addMockProduct() {
    try {
      const mockProduct = createProduct();

      const product = new ProductModel(mockProduct);

      await product.save();

      return product;
    } catch (error) {
      req.logger.error("No se pudieron agregar productos al mock");
    }
  }
}

module.exports = ProductRepository;
