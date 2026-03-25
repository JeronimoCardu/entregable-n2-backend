import * as API from "../api.js";
import { state, save } from "../state.js";
import { toast } from "../toast.js";
import { navigate } from "../router.js";

export const viewLogin = () => `
  <div class="card form-card">
    <h2 class="section-title text-center">Iniciar Sesión</h2>
    <form id="login-form">
      <div class="form-group">
        <label>Email</label>
        <input type="email" name="email" required>
      </div>
      <div class="form-group">
        <label>Contraseña</label>
        <input type="password" name="password" required>
      </div>
      <button class="btn btn-primary" style="width:100%">Entrar</button>
    </form>
    <p class="text-center mt-1">
      <a class="link" href="#/forgot-password">Olvidé mi contraseña</a> &middot;
      <a class="link" href="#/register">Crear cuenta</a>
    </p>
  </div>`;

export const mountLogin = () => {
  document
    .getElementById("login-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector(
        "button[type=submit], button:not([type])",
      );
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span>Ingresando...';

      const fd = new FormData(e.target);
      const data = { email: fd.get("email"), password: fd.get("password") };
      const res = await API.login(data);
      if (res.status === "success") {
        state.token = res.token;
        state.user = res.payload;
        state.cartId = res.payload.cart || null;
        save();
        toast("Bienvenido, " + state.user.first_name);
        navigate("#/products");
      } else {
        toast(res.message || "Error al iniciar sesión", "error");
        btn.disabled = false;
        btn.textContent = "Entrar";
      }
    });
};
