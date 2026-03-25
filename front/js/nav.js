import { isLogged, isAdmin, state } from "./state.js";
import * as API from "./api.js";

let navRenderVersion = 0;

export const renderNav = () => {
  const version = ++navRenderVersion;
  const nav = document.getElementById("nav");
  let links = '<a href="#/products">Productos</a>';
  if (!isLogged()) {
    links += '<a href="#/login">Login</a><a href="#/register">Registro</a>';
  } else {
    links += '<a href="#/profile">Perfil</a>';
    if (!isAdmin()) {
      links +=
        '<a href="#/cart" class="cart-link" id="cart-nav-link">Carrito</a>';
    }
    if (isAdmin()) links += '<a href="#/products/new">Nuevo Producto</a>';
    links += '<a href="#/logout" id="logout-link">Salir</a>';
  }
  nav.innerHTML = links;
  // highlight active
  const hash = location.hash || "#/products";
  nav.querySelectorAll("a").forEach((a) => {
    if (hash.startsWith(a.getAttribute("href"))) a.classList.add("active");
  });
  // Fetch badge asynchronously (non-blocking)
  if (isLogged() && !isAdmin() && state.cartId) {
    API.getCart(state.cartId)
      .then((cr) => {
        if (navRenderVersion !== version) return; // stale
        if (cr.status === "success" && cr.payload && cr.payload.products) {
          const count = cr.payload.products.reduce((s, i) => s + i.quantity, 0);
          const link = document.getElementById("cart-nav-link");
          if (link && count > 0) {
            link.innerHTML =
              'Carrito <span class="cart-badge">' + count + "</span>";
          }
        }
      })
      .catch(() => {});
  }
};
