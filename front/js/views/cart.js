import * as API from "../api.js";
import { state } from "../state.js";
import { toast } from "../toast.js";
import { esc } from "../utils/esc.js";
import { renderNav } from "../nav.js";

export const viewCart = async () => {
  if (!state.cartId) {
    return '<p class="empty-state">Tu carrito está vacío.</p><p class="text-center"><a class="link" href="#/products">Ver productos</a></p>';
  }
  const res = await API.getCart(state.cartId);
  if (res.status !== "success" || !res.payload) {
    return '<p class="empty-state">No se pudo cargar el carrito.</p>';
  }
  const items = res.payload.products || [];
  if (items.length === 0) {
    return '<p class="empty-state">Tu carrito está vacío.</p><p class="text-center"><a class="link" href="#/products">Ver productos</a></p>';
  }
  let total = 0;
  const rows = items
    .map((item) => {
      const p = item.product;
      if (!p) return "";
      const subtotal = p.price * item.quantity;
      total += subtotal;
      return `
        <div class="cart-item" data-pid="${p._id}" data-price="${p.price}" data-stock="${p.stock}">
          <div class="cart-item-info">
            <strong>${esc(p.title)}</strong>
            <span class="cart-item-price">$${p.price.toFixed(2)} c/u</span>
          </div>
          <div class="cart-item-controls">
            <button class="btn btn-outline btn-sm qty-btn qty-minus" data-pid="${p._id}" ${item.quantity <= 1 ? "disabled" : ""}>−</button>
            <span class="qty-display" id="qty-${p._id}">${item.quantity}</span>
            <button class="btn btn-outline btn-sm qty-btn qty-plus" data-pid="${p._id}">+</button>
            <span class="cart-item-subtotal" id="sub-${p._id}" data-subtotal="${subtotal}">$${subtotal.toFixed(2)}</span>
            <button class="btn btn-danger btn-sm rm-cart" data-pid="${p._id}" title="Eliminar del carrito">✕</button>
          </div>
        </div>`;
    })
    .join("");
  return `
    <h2 class="section-title">Mi Carrito</h2>
    <div class="card">
      ${rows}
      <div class="cart-total">Total: $${total.toFixed(2)}</div>
      <div class="text-center mt-1">
        <button class="btn btn-success" id="purchase-btn">Finalizar Compra</button>
      </div>
    </div>`;
};

const recalcTotal = () => {
  const items = document.querySelectorAll(".cart-item:not(.removing)");
  if (items.length === 0) {
    document.getElementById("app").innerHTML =
      '<p class="empty-state">Tu carrito está vacío.</p><p class="text-center"><a class="link" href="#/products">Ver productos</a></p>';
    return;
  }
  let total = 0;
  items.forEach((row) => {
    const sub = row.querySelector(".cart-item-subtotal");
    if (sub) total += parseFloat(sub.dataset.subtotal);
  });
  const totalEl = document.querySelector(".cart-total");
  if (totalEl) totalEl.textContent = "Total: $" + total.toFixed(2);
};

export const mountCart = () => {
  // Remove entire product
  document.querySelectorAll(".rm-cart").forEach((btn) =>
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span>';
      const cartItem = btn.closest(".cart-item");
      const res = await API.removeFromCart(state.cartId, btn.dataset.pid);
      if (res.status === "success") {
        cartItem.classList.add("removing");
        cartItem.addEventListener(
          "transitionend",
          () => {
            cartItem.remove();
            recalcTotal();
          },
          { once: true },
        );
        toast("Producto eliminado del carrito");
        renderNav();
      } else {
        toast(res.message || "Error", "error");
        btn.disabled = false;
        btn.textContent = "✕";
      }
    }),
  );

  // Quantity minus
  document.querySelectorAll(".qty-minus").forEach((btn) =>
    btn.addEventListener("click", async () => {
      const pid = btn.dataset.pid;
      const cartItem = btn.closest(".cart-item");
      const qtyEl = document.getElementById("qty-" + pid);
      const current = parseInt(qtyEl.textContent);
      if (current <= 1) return;
      const newQty = current - 1;
      btn.disabled = true;
      const res = await API.updateCartQuantity(state.cartId, pid, newQty);
      if (res.status === "success") {
        qtyEl.textContent = newQty;
        const price = parseFloat(cartItem.dataset.price);
        const subEl = document.getElementById("sub-" + pid);
        const newSub = price * newQty;
        subEl.textContent = "$" + newSub.toFixed(2);
        subEl.dataset.subtotal = newSub;
        recalcTotal();
        renderNav();
        if (newQty <= 1) btn.disabled = true;
        else btn.disabled = false;
      } else {
        toast(res.message || "Error", "error");
        btn.disabled = false;
      }
    }),
  );

  // Quantity plus
  document.querySelectorAll(".qty-plus").forEach((btn) =>
    btn.addEventListener("click", async () => {
      const pid = btn.dataset.pid;
      const cartItem = btn.closest(".cart-item");
      const qtyEl = document.getElementById("qty-" + pid);
      const current = parseInt(qtyEl.textContent);
      const newQty = current + 1;
      btn.disabled = true;
      const res = await API.updateCartQuantity(state.cartId, pid, newQty);
      if (res.status === "success") {
        qtyEl.textContent = newQty;
        const price = parseFloat(cartItem.dataset.price);
        const subEl = document.getElementById("sub-" + pid);
        const newSub = price * newQty;
        subEl.textContent = "$" + newSub.toFixed(2);
        subEl.dataset.subtotal = newSub;
        recalcTotal();
        renderNav();
        // Enable minus button
        const minusBtn = cartItem.querySelector(".qty-minus");
        if (minusBtn) minusBtn.disabled = false;
        btn.disabled = false;
      } else {
        toast(res.message || "Error", "error");
        btn.disabled = false;
      }
    }),
  );

  const purchaseBtn = document.getElementById("purchase-btn");
  if (purchaseBtn) {
    purchaseBtn.addEventListener("click", () => {
      // Show confirmation modal
      const overlay = document.createElement("div");
      overlay.className = "overlay";
      overlay.innerHTML = `
        <div class="modal">
          <h3>Confirmar compra</h3>
          <p>¿Estás seguro de que querés finalizar la compra?</p>
          <div class="modal-actions">
            <button class="btn btn-outline" id="modal-cancel">Cancelar</button>
            <button class="btn btn-success" id="modal-confirm">Sí, comprar</button>
          </div>
        </div>`;
      document.body.appendChild(overlay);

      document
        .getElementById("modal-cancel")
        .addEventListener("click", () => overlay.remove());
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) overlay.remove();
      });

      document
        .getElementById("modal-confirm")
        .addEventListener("click", async () => {
          const confirmBtn = document.getElementById("modal-confirm");
          confirmBtn.disabled = true;
          confirmBtn.innerHTML = '<span class="spinner"></span>Procesando...';
          purchaseBtn.disabled = true;
          purchaseBtn.innerHTML = '<span class="spinner"></span>Procesando...';

          const res = await API.purchase(state.cartId);
          overlay.remove();

          if (res.status === "success") {
            const t = res.payload.ticket;
            let html = `
            <div class="ticket">
              <span class="ticket-icon">✓</span>
              <h3>¡Compra realizada con éxito!</h3>
              <p class="ticket-detail"><strong>Código:</strong> ${esc(t.code)}</p>
              <p class="ticket-detail"><strong>Total:</strong> $${t.amount.toFixed(2)}</p>
              <p class="ticket-detail"><strong>Email:</strong> ${esc(t.purchaser)}</p>
              <p class="ticket-detail" style="font-size:.82rem;color:var(--muted)">${new Date(t.purchase_datetime).toLocaleString()}</p>
            </div>`;
            html +=
              '<p class="text-center mt-1"><a class="btn btn-primary" href="#/products">Seguir comprando</a></p>';
            document.getElementById("app").innerHTML = html;
            toast(
              "¡Compra exitosa! Revisá tu email para el comprobante.",
              "success",
              5000,
            );
            renderNav();
          } else {
            toast(res.message || "Error al procesar la compra", "error", 5000);
            purchaseBtn.disabled = false;
            purchaseBtn.textContent = "Finalizar Compra";
          }
        });
    });
  }
};
