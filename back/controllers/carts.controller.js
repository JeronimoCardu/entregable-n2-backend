const CartDAO = require("../daos/mongo/cart.dao.js");
const ProductDAO = require("../daos/mongo/product.dao.js");
const TicketDAO = require("../daos/mongo/ticket.dao.js");
const CartsService = require("../services/carts.service.js");

const cartDAO = new CartDAO();
const productDAO = new ProductDAO();
const ticketDAO = new TicketDAO();
const cartsService = new CartsService(cartDAO, productDAO, ticketDAO);

class CartsController {
  constructor(service) {
    this.service = service;
  }

  create = async (req, res) => {
    try {
      const result = await this.service.create();
      return res.status(result.code).json({
        status: result.ok ? "success" : "error",
        message: result.message,
        payload: result.payload,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: "Error al crear carrito" });
    }
  };

  getById = async (req, res) => {
    try {
      const result = await this.service.getById(req.params.cid);
      return res.status(result.code).json({
        status: result.ok ? "success" : "error",
        message: result.message,
        payload: result.payload,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: "Error al obtener carrito" });
    }
  };

  addProduct = async (req, res) => {
    try {
      const result = await this.service.addProduct(
        req.params.cid,
        req.params.pid,
      );
      return res.status(result.code).json({
        status: result.ok ? "success" : "error",
        message: result.message,
        payload: result.payload,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: "Error al agregar producto" });
    }
  };

  removeProduct = async (req, res) => {
    try {
      const result = await this.service.removeProduct(
        req.params.cid,
        req.params.pid,
      );
      return res.status(result.code).json({
        status: result.ok ? "success" : "error",
        message: result.message,
        payload: result.payload,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: "Error al eliminar producto" });
    }
  };

  updateProductQuantity = async (req, res) => {
    try {
      const quantity = Number(req.body.quantity);
      if (isNaN(quantity)) {
        return res
          .status(400)
          .json({ status: "error", message: "Cantidad inválida" });
      }
      const result = await this.service.updateProductQuantity(
        req.params.cid,
        req.params.pid,
        quantity,
      );
      return res.status(result.code).json({
        status: result.ok ? "success" : "error",
        message: result.message,
        payload: result.payload,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: "Error al actualizar cantidad" });
    }
  };

  purchase = async (req, res) => {
    try {
      const result = await this.service.purchase(
        req.params.cid,
        req.user.email,
      );
      return res.status(result.code).json({
        status: result.ok ? "success" : "error",
        message: result.message,
        payload: result.payload,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: "Error al procesar compra" });
    }
  };
}

module.exports = new CartsController(cartsService);
