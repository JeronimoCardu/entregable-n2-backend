const ProductDAO = require("../daos/mongo/product.dao.js");
const ProductsService = require("../services/products.service.js");

const productDAO = new ProductDAO();
const productsService = new ProductsService(productDAO);

class ProductsController {
  constructor(service) {
    this.service = service;
  }

  getAll = async (req, res) => {
    try {
      const result = await this.service.getAll();
      return res.status(result.code).json({
        status: result.ok ? "success" : "error",
        payload: result.payload,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: "Error al obtener productos" });
    }
  };

  getById = async (req, res) => {
    try {
      const result = await this.service.getById(req.params.pid);
      return res.status(result.code).json({
        status: result.ok ? "success" : "error",
        message: result.message,
        payload: result.payload,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: "Error al obtener producto" });
    }
  };

  create = async (req, res) => {
    try {
      const result = await this.service.create(req.body);
      return res.status(result.code).json({
        status: result.ok ? "success" : "error",
        message: result.message,
        payload: result.payload,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: "Error al crear producto" });
    }
  };

  update = async (req, res) => {
    try {
      const result = await this.service.update(req.params.pid, req.body);
      return res.status(result.code).json({
        status: result.ok ? "success" : "error",
        message: result.message,
        payload: result.payload,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: "Error al actualizar producto" });
    }
  };

  delete = async (req, res) => {
    try {
      const result = await this.service.delete(req.params.pid);
      return res.status(result.code).json({
        status: result.ok ? "success" : "error",
        message: result.message,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: "Error al eliminar producto" });
    }
  };
}

module.exports = new ProductsController(productsService);
