import * as API from "../api.js";
import { toast } from "../toast.js";
import { esc } from "../utils/esc.js";
import { navigate } from "../router.js";

export const viewEditProduct = async (id) => {
  const res = await API.getProduct(id);
  if (res.status !== "success")
    return '<p class="empty-state">Producto no encontrado.</p>';
  const p = res.payload;
  return `
    <div class="card form-card">
      <h2 class="section-title text-center">Editar Producto</h2>
      <form id="edit-form" data-id="${p._id}">
        <div class="form-group"><label>Título</label><input name="title" value="${esc(p.title)}" required></div>
        <div class="form-group"><label>Descripción</label><input name="description" value="${esc(p.description || "")}"></div>
        <div class="form-group"><label>Código</label><input name="code" value="${esc(p.code)}" required></div>
        <div class="form-group"><label>Precio</label><input name="price" type="number" step="0.01" value="${p.price}" required></div>
        <div class="form-group"><label>Stock</label><input name="stock" type="number" value="${p.stock}" required></div>
        <div class="form-group"><label>Categoría</label><input name="category" value="${esc(p.category)}" required></div>
        <button class="btn btn-primary" style="width:100%">Guardar</button>
      </form>
    </div>`;
};

export const mountEditProduct = () => {
  document.getElementById("edit-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd);
    data.price = Number(data.price);
    data.stock = Number(data.stock);
    const res = await API.updateProduct(e.target.dataset.id, data);
    if (res.status === "success") {
      toast("Producto actualizado");
      navigate("#/products");
    } else {
      toast(res.message || "Error", "error");
    }
  });
};
