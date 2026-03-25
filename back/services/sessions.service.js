const { hashPassword, comparePassword } = require("../utils/password.util.js");
const { generateToken, verifyToken } = require("../utils/token.util.js");
const { sendResetPasswordEmail } = require("../utils/mailer.util.js");
const UserDTO = require("../dtos/user.dto.js");

class SessionsService {
  constructor(userDAO, cartDAO) {
    this.userDAO = userDAO;
    this.cartDAO = cartDAO;
  }

  async register({ first_name, last_name, age, email, password }) {
    if (!first_name || !last_name || !age || !email || !password) {
      return { ok: false, code: 400, message: "Missing required fields" };
    }

    const existing = await this.userDAO.findByEmail(email);
    if (existing) {
      return { ok: false, code: 409, message: "User already exists" };
    }

    const cart = await this.cartDAO.create();

    const newUser = await this.userDAO.create({
      first_name,
      last_name,
      age,
      email,
      password: hashPassword(password),
      cart: cart._id,
    });

    return {
      ok: true,
      code: 201,
      message: "Usuario registrado exitosamente",
      payload: new UserDTO(newUser),
    };
  }

  async login({ email, password }) {
    if (!email || !password) {
      return {
        ok: false,
        code: 400,
        message: "Email and password are required",
      };
    }

    const user = await this.userDAO.findByEmail(email);
    if (!user || !comparePassword(password, user.password)) {
      return { ok: false, code: 401, message: "Incorrect credentials" };
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    return {
      ok: true,
      code: 200,
      payload: { token, user: new UserDTO(user) },
    };
  }

  async getCurrent(userId) {
    const user = await this.userDAO.findById(userId);
    if (!user) return null;
    return new UserDTO(user);
  }

  async forgotPassword(email) {
    if (!email) {
      return { ok: false, code: 400, message: "Email is required" };
    }

    const user = await this.userDAO.findByEmail(email);
    if (!user) {
      return { ok: false, code: 404, message: "User not found" };
    }

    const token = generateToken(
      { id: user._id, email: user.email, purpose: "reset" },
      "1h",
    );
    await sendResetPasswordEmail(user.email, token);

    return { ok: true, code: 200, message: "Email de recuperacion enviado" };
  }

  async resetPassword(token, newPassword) {
    if (!token || !newPassword) {
      return {
        ok: false,
        code: 400,
        message: "Token and new password are required",
      };
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      return { ok: false, code: 400, message: "Token invalido o expirado" };
    }

    if (decoded.purpose !== "reset") {
      return { ok: false, code: 400, message: "Token invalido" };
    }

    const user = await this.userDAO.findById(decoded.id);
    if (!user) {
      return { ok: false, code: 404, message: "User not found" };
    }

    if (comparePassword(newPassword, user.password)) {
      return {
        ok: false,
        code: 400,
        message: "No puedes usar la misma contraseña anterior",
      };
    }

    await this.userDAO.updateById(user._id, {
      password: hashPassword(newPassword),
    });

    return {
      ok: true,
      code: 200,
      message: "Contraseña actualizada exitosamente",
    };
  }
}

module.exports = SessionsService;
