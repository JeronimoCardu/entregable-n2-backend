import { router } from "./router.js";

const init = () => {
  window.addEventListener("hashchange", router);
  if (!location.hash) location.hash = "#/products";
  router();
};

document.addEventListener("DOMContentLoaded", init);
