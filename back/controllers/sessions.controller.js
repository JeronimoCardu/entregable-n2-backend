const UserDAO = require("../daos/mongo/user.dao.js");
const CartDAO = require("../daos/mongo/cart.dao.js");
const SessionsService = require("../services/sessions.service.js");

const userDAO = new UserDAO();
const cartDAO = new CartDAO();
const sessionsService = new SessionsService(userDAO, cartDAO);

class SessionsController {
  constructor(service) {
    this.service = service;
  }

  register = async (req, res) => {
    try {
      const result = await this.service.register(req.body);
      return res.status(result.code).json({
        status: result.ok ? "success" : "error",
        message: result.message,
        payload: result.payload,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: "Error al registrar usuario" });
    }
  };

  login = async (req, res) => {
    try {
      const result = await this.service.login(req.body);
      if (!result.ok) {
        return res
          .status(result.code)
          .json({ status: "error", message: result.message });
      }
      return res.status(result.code).json({
        status: "success",
        token: result.payload.token,
        payload: result.payload.user,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: "Error al iniciar sesion" });
    }
  };

  current = (req, res) => {
    return res.json({ status: "success", payload: req.user });
  };

  logout = (req, res) => {
    return res.json({
      status: "success",
      message: "Sesion cerrada exitosamente",
    });
  };

  forgotPassword = async (req, res) => {
    try {
      const result = await this.service.forgotPassword(req.body.email);
      return res.status(result.code).json({
        status: result.ok ? "success" : "error",
        message: result.message,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: "Error al enviar email" });
    }
  };

  resetPassword = async (req, res) => {
    try {
      const { token, new_password } = req.body;
      const result = await this.service.resetPassword(token, new_password);
      return res.status(result.code).json({
        status: result.ok ? "success" : "error",
        message: result.message,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: "Error al restablecer contraseña" });
    }
  };
}

module.exports = new SessionsController(sessionsService);
