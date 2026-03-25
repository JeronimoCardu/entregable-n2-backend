const BASE = "/api";

const getToken = () => localStorage.getItem("token");

const headers = (auth = false) => {
  const h = { "Content-Type": "application/json" };
  if (auth) {
    const t = getToken();
    if (t) h["Authorization"] = "Bearer " + t;
  }
  return h;
};

const request = async (method, path, body, auth = false) => {
  const opts = { method, headers: headers(auth) };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(BASE + path, opts);
  return res.json();
};

// Sessions
export const register = (data) => request("POST", "/sessions/register", data);
export const login = (data) => request("POST", "/sessions/login", data);
export const current = () => request("GET", "/sessions/current", null, true);
export const logout = () => request("POST", "/sessions/logout", null, true);
export const forgotPassword = (email) =>
  request("POST", "/sessions/forgot-password", { email });
export const resetPassword = (token, new_password) =>
  request("POST", "/sessions/reset-password", { token, new_password });

// Products
export const getProducts = () => request("GET", "/products");
export const getProduct = (id) => request("GET", "/products/" + id);
export const createProduct = (data) => request("POST", "/products", data, true);
export const updateProduct = (id, data) =>
  request("PUT", "/products/" + id, data, true);
export const deleteProduct = (id) =>
  request("DELETE", "/products/" + id, null, true);

// Carts
export const createCart = () => request("POST", "/carts", null, true);
export const getCart = (id) => request("GET", "/carts/" + id, null, true);
export const addToCart = (cid, pid) =>
  request("POST", "/carts/" + cid + "/product/" + pid, null, true);
export const removeFromCart = (cid, pid) =>
  request("DELETE", "/carts/" + cid + "/product/" + pid, null, true);
export const updateCartQuantity = (cid, pid, quantity) =>
  request("PUT", "/carts/" + cid + "/product/" + pid, { quantity }, true);
export const purchase = (cid) =>
  request("POST", "/carts/" + cid + "/purchase", null, true);
