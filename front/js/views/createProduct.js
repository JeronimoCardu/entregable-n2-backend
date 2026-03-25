import * as API from "../api.js";
import { toast } from "../toast.js";
import { navigate } from "../router.js";

export const viewCreateProduct = () => `
  <div class="card form-card">
    <h2 class="section-title text-center">Nuevo Producto</h2>
    <form id="product-form">
      <div class="form-group"><label>Título</label><input name="title" required></div>
      <div class="form-group"><label>Descripción</label><input name="description"></div>
      <div class="form-group"><label>Código</label><input name="code" required></div>
      <div class="form-group"><label>Precio</label><input name="price" type="number" step="0.01" min="0" required></div>
      <div class="form-group"><label>Stock</label><input name="stock" type="number" min="0" required></div>
      <div class="form-group"><label>Categoría</label><input name="category" required></div>
      <button class="btn btn-primary" style="width:100%">Crear</button>
    </form>
  </div>`;

export const mountCreateProduct = () => {
  document
    .getElementById("product-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd);
      data.price = Number(data.price);
      data.stock = Number(data.stock);
      data.status = true;
      const res = await API.createProduct(data);
      if (res.status === "success") {
        toast("Producto creado");
        navigate("#/products");
      } else {
        toast(res.message || "Error", "error");
      }
    });
};
