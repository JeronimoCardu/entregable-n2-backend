import * as API from "./api.js";
import { state, save, isLogged, isAdmin } from "./state.js";
import { toast } from "./toast.js";
import { renderNav } from "./nav.js";
import { viewLogin, mountLogin } from "./views/login.js";
import { viewRegister, mountRegister } from "./views/register.js";
import { viewForgot, mountForgot } from "./views/forgot.js";
import { viewReset, mountReset } from "./views/reset.js";
import { viewProfile } from "./views/profile.js";
import { viewProducts, mountProducts } from "./views/products.js";
import {
  viewCreateProduct,
  mountCreateProduct,
} from "./views/createProduct.js";
import { viewEditProduct, mountEditProduct } from "./views/editProduct.js";
import { viewCart, mountCart } from "./views/cart.js";

export const navigate = (hash) => {
  location.hash = hash;
};

const routes = {
  "#/login": { view: viewLogin, mount: mountLogin, guest: true },
  "#/register": { view: viewRegister, mount: mountRegister, guest: true },
  "#/forgot-password": { view: viewForgot, mount: mountForgot, guest: true },
  "#/reset-password": { view: viewReset, mount: mountReset, guest: true },
  "#/profile": { view: viewProfile, mount: null, auth: true },
  "#/products": { view: viewProducts, mount: mountProducts },
  "#/products/new": {
    view: viewCreateProduct,
    mount: mountCreateProduct,
    admin: true,
  },
  "#/cart": { view: viewCart, mount: mountCart, auth: true },
};

export const router = async () => {
  const hash = (location.hash || "#/products").split("?")[0];
  const app = document.getElementById("app");

  // Logout handler
  if (hash === "#/logout") {
    await API.logout();
    state.token = null;
    state.user = null;
    state.cartId = null;
    save();
    toast("Sesión cerrada");
    navigate("#/products");
    return;
  }

  // Edit product route
  const editMatch = hash.match(/^#\/products\/edit\/(.+)$/);
  if (editMatch) {
    if (!isAdmin()) {
      navigate("#/products");
      return;
    }
    app.innerHTML = await viewEditProduct(editMatch[1]);
    mountEditProduct();
    renderNav();
    return;
  }

  const route = routes[hash];
  if (!route) {
    navigate("#/products");
    return;
  }

  // Guards
  if (route.auth && !isLogged()) {
    navigate("#/login");
    return;
  }
  if (route.admin && !isAdmin()) {
    navigate("#/products");
    return;
  }
  if (route.guest && isLogged()) {
    navigate("#/products");
    return;
  }

  const html =
    typeof route.view === "function" ? await route.view() : route.view;
  app.innerHTML = html;
  if (route.mount) route.mount();
  renderNav();
};
