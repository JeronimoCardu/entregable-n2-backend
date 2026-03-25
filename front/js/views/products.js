import * as API from "../api.js";
import { state, save, isLogged, isAdmin } from "../state.js";
import { toast } from "../toast.js";
import { esc } from "../utils/esc.js";
import { renderNav } from "../nav.js";
import { navigate } from "../router.js";

export const viewProducts = async () => {
  const res = await API.getProducts();
  if (res.status !== "success" || !res.payload || res.payload.length === 0) {
    return '<p class="empty-state">No hay productos disponibles.</p>';
  }
  const cards = res.payload
    .map(
      (p) => `
    <div class="card product-card">
      <h3>${esc(p.title)}</h3>
      <p class="meta">${esc(p.category)} &middot; ${p.stock > 0 ? "Stock: " + p.stock : '<span style="color:var(--danger);font-weight:600">Stock: 0</span>'}</p>
      <p style="font-size:.85rem;color:var(--muted)">${esc(p.description || "")}</p>
      <p class="price">$${p.price}</p>
      <div class="actions">
        ${
          isLogged() && !isAdmin()
            ? '<button class="btn btn-primary btn-sm add-cart" data-id="' +
              p._id +
              '"' +
              (p.stock <= 0 ? ' disabled title="Sin stock"' : "") +
              ">" +
              (p.stock <= 0 ? "Sin stock" : "Agregar al carrito") +
              "</button>"
            : ""
        }
        ${
          isAdmin()
            ? '<a class="btn btn-outline btn-sm" href="#/products/edit/' +
              p._id +
              '">Editar</a>' +
              '<button class="btn btn-danger btn-sm del-product" data-id="' +
              p._id +
              '">Eliminar</button>'
            : ""
        }
      </div>
    </div>`,
    )
    .join("");
  return (
    '<h2 class="section-title">Productos</h2><div class="products-grid">' +
    cards +
    "</div>"
  );
};

export const mountProducts = () => {
  // Add to cart
  document.querySelectorAll(".add-cart").forEach((btn) =>
    btn.addEventListener("click", async () => {
      const originalText = btn.textContent;
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span>Agregando...';

      if (!state.cartId) {
        const cr = await API.createCart();
        if (cr.status === "success") {
          state.cartId = cr.payload._id;
          save();
        } else {
          toast("Error al crear carrito", "error");
          btn.disabled = false;
          btn.textContent = originalText;
          return;
        }
      }
      const res = await API.addToCart(state.cartId, btn.dataset.id);
      if (res.status === "success") {
        btn.textContent = "✓ Agregado";
        btn.classList.add("added");
        toast("Producto agregado al carrito");
        renderNav();
        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.remove("added");
          btn.disabled = false;
        }, 1200);
      } else {
        toast(res.message || "Error", "error");
        btn.disabled = false;
        btn.textContent = originalText;
      }
    }),
  );
  // Delete product (admin)
  document.querySelectorAll(".del-product").forEach((btn) =>
    btn.addEventListener("click", async () => {
      if (!confirm("¿Eliminar este producto?")) return;
      const res = await API.deleteProduct(btn.dataset.id);
      if (res.status === "success") {
        toast("Producto eliminado");
        navigate("#/products");
      } else {
        toast(res.message || "Error", "error");
      }
    }),
  );
};
