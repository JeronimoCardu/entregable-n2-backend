const bcrypt = require("bcrypt");

const hashPassword = (password) => bcrypt.hashSync(password, 10);
const comparePassword = (plain, hashed) => bcrypt.compareSync(plain, hashed);

module.exports = { hashPassword, comparePassword };
