const UserModel = require("../models/User.js");

class UserDAO {
  async create(userData) {
    return UserModel.create(userData);
  }

  async findByEmail(email) {
    return UserModel.findOne({ email });
  }

  async findById(id, projection = null) {
    return UserModel.findById(id, projection);
  }

  async updateById(id, updateData) {
    return UserModel.findByIdAndUpdate(id, updateData, { new: true });
  }
}

module.exports = UserDAO;
