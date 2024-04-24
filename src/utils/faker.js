const { faker } = require("@faker-js/faker");

const createProducts = () => {
  let products = [];

  for (let i = 0; i < 50; i++) {
    const product = {
      id: faker.database.mongodbObjectId(),
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseInt(faker.string.numeric()),
      code: parseInt(faker.string.numeric()),
      category: faker.commerce.productMaterial(),
      stock: parseInt(faker.string.numeric()),
      image: faker.image.url(),
      status: faker.datatype.boolean(),
    };
    products.push(product);
  }
  return products;
};

const createProduct = () => {
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseInt(faker.string.numeric()),
    code: parseInt(faker.string.numeric()),
    category: faker.commerce.productMaterial(),
    stock: parseInt(faker.string.numeric()),
    image: faker.image.url(),
    status: faker.datatype.boolean(),
  };
};

module.exports = { createProducts, createProduct };
