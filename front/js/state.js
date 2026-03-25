export const state = {
  token: localStorage.getItem("token") || null,
  user: JSON.parse(localStorage.getItem("user") || "null"),
  cartId: localStorage.getItem("cartId") || null,
};

export const save = () => {
  if (state.token) localStorage.setItem("token", state.token);
  else localStorage.removeItem("token");
  if (state.user) localStorage.setItem("user", JSON.stringify(state.user));
  else localStorage.removeItem("user");
  if (state.cartId) localStorage.setItem("cartId", state.cartId);
  else localStorage.removeItem("cartId");
};

export const isLogged = () => !!state.token;
export const isAdmin = () => state.user && state.user.role === "admin";
