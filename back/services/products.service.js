class ProductsService {
  constructor(productDAO) {
    this.productDAO = productDAO;
  }

  async getAll() {
    const products = await this.productDAO.findAll();
    return { ok: true, code: 200, payload: products };
  }

  async getById(id) {
    const product = await this.productDAO.findById(id);
    if (!product) return { ok: false, code: 404, message: "Product not found" };
    return { ok: true, code: 200, payload: product };
  }

  async create(data) {
    const { title, description, code, price, stock, category } = data;
    if (
      !title ||
      !description ||
      !code ||
      price == null ||
      stock == null ||
      !category
    ) {
      return { ok: false, code: 400, message: "Missing required fields" };
    }
    const product = await this.productDAO.create(data);
    return { ok: true, code: 201, payload: product };
  }

  async update(id, data) {
    const product = await this.productDAO.findById(id);
    if (!product) return { ok: false, code: 404, message: "Product not found" };

    const updated = await this.productDAO.updateById(id, data);
    return { ok: true, code: 200, payload: updated };
  }

  async delete(id) {
    const product = await this.productDAO.findById(id);
    if (!product) return { ok: false, code: 404, message: "Product not found" };

    await this.productDAO.deleteById(id);
    return { ok: true, code: 200, message: "Product deleted" };
  }
}

module.exports = ProductsService;
