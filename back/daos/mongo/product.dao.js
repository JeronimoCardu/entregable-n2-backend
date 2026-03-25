const ProductModel = require("../models/Product.js");

class ProductDAO {
  async create(data) {
    return ProductModel.create(data);
  }

  async findById(id) {
    return ProductModel.findById(id);
  }

  async findAll(filter = {}) {
    return ProductModel.find(filter);
  }

  async updateById(id, data) {
    return ProductModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteById(id) {
    return ProductModel.findByIdAndDelete(id);
  }
}

module.exports = ProductDAO;
