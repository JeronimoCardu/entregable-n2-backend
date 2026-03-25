const CartModel = require("../models/Cart.js");

class CartDAO {
  async create() {
    return CartModel.create({ products: [] });
  }

  async findById(id) {
    return CartModel.findById(id);
  }

  async findByIdPopulated(id) {
    return CartModel.findById(id).populate("products.product");
  }

  async updateById(id, update) {
    return CartModel.findByIdAndUpdate(id, update, { new: true });
  }
}

module.exports = CartDAO;
