const crypto = require("crypto");

class CartsService {
  constructor(cartDAO, productDAO, ticketDAO) {
    this.cartDAO = cartDAO;
    this.productDAO = productDAO;
    this.ticketDAO = ticketDAO;
  }

  async create() {
    const cart = await this.cartDAO.create();
    return { ok: true, code: 201, payload: cart };
  }

  async getById(id) {
    const cart = await this.cartDAO.findByIdPopulated(id);
    if (!cart) return { ok: false, code: 404, message: "Cart not found" };
    return { ok: true, code: 200, payload: cart };
  }

  async addProduct(cartId, productId) {
    const cart = await this.cartDAO.findById(cartId);
    if (!cart) return { ok: false, code: 404, message: "Cart not found" };

    const product = await this.productDAO.findById(productId);
    if (!product) return { ok: false, code: 404, message: "Product not found" };

    const existingIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId,
    );

    if (existingIndex !== -1) {
      cart.products[existingIndex].quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    const updated = await this.cartDAO.updateById(cartId, {
      products: cart.products,
    });

    return { ok: true, code: 200, payload: updated };
  }

  async removeProduct(cartId, productId) {
    const cart = await this.cartDAO.findById(cartId);
    if (!cart) return { ok: false, code: 404, message: "Cart not found" };

    cart.products = cart.products.filter(
      (p) => p.product.toString() !== productId,
    );

    const updated = await this.cartDAO.updateById(cartId, {
      products: cart.products,
    });

    return { ok: true, code: 200, payload: updated };
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await this.cartDAO.findById(cartId);
    if (!cart) return { ok: false, code: 404, message: "Cart not found" };

    const idx = cart.products.findIndex(
      (p) => p.product.toString() === productId,
    );
    if (idx === -1)
      return { ok: false, code: 404, message: "Product not in cart" };

    if (quantity <= 0) {
      cart.products.splice(idx, 1);
    } else {
      cart.products[idx].quantity = quantity;
    }

    const updated = await this.cartDAO.updateById(cartId, {
      products: cart.products,
    });

    return { ok: true, code: 200, payload: updated };
  }

  async purchase(cartId, purchaserEmail) {
    const cart = await this.cartDAO.findByIdPopulated(cartId);
    if (!cart) return { ok: false, code: 404, message: "Cart not found" };

    if (!cart.products.length) {
      return { ok: false, code: 400, message: "Cart is empty" };
    }

    // Check stock for ALL products first
    const insufficientStock = [];
    for (const item of cart.products) {
      const product = item.product;
      if (product.stock < item.quantity) {
        insufficientStock.push({
          title: product.title,
          requested: item.quantity,
          available: product.stock,
        });
      }
    }

    if (insufficientStock.length > 0) {
      const details = insufficientStock
        .map(
          (p) =>
            `"${p.title}" (pedido: ${p.requested}, disponible: ${p.available})`,
        )
        .join(", ");
      return {
        ok: false,
        code: 400,
        message: `Stock insuficiente para: ${details}`,
        payload: { insufficientStock },
      };
    }

    // All items have stock — process purchase
    let totalAmount = 0;
    for (const item of cart.products) {
      const product = item.product;
      product.stock -= item.quantity;
      await this.productDAO.updateById(product._id, {
        stock: product.stock,
      });
      totalAmount += product.price * item.quantity;
    }

    const ticket = await this.ticketDAO.create({
      code: crypto.randomUUID(),
      amount: totalAmount,
      purchaser: purchaserEmail,
    });

    // Clear cart
    await this.cartDAO.updateById(cartId, { products: [] });

    return {
      ok: true,
      code: 200,
      message: "Compra realizada exitosamente",
      payload: { ticket },
    };
  }
}

module.exports = CartsService;
