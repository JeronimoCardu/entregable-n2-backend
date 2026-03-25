import * as API from "../api.js";
import { toast } from "../toast.js";
import { navigate } from "../router.js";

export const viewRegister = () => `
  <div class="card form-card">
    <h2 class="section-title text-center">Crear Cuenta</h2>
    <form id="register-form">
      <div class="form-group">
        <label>Nombre</label>
        <input type="text" name="first_name" required>
      </div>
      <div class="form-group">
        <label>Apellido</label>
        <input type="text" name="last_name" required>
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" name="email" required>
      </div>
      <div class="form-group">
        <label>Edad</label>
        <input type="number" name="age" min="1" required>
      </div>
      <div class="form-group">
        <label>Contraseña</label>
        <input type="password" name="password" required>
      </div>
      <button class="btn btn-primary" style="width:100%">Registrarse</button>
    </form>
    <p class="text-center mt-1">
      <a class="link" href="#/login">Ya tengo cuenta</a>
    </p>
  </div>`;

export const mountRegister = () => {
  document
    .getElementById("register-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector(
        "button[type=submit], button:not([type])",
      );
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span>Registrando...';

      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd);
      data.age = Number(data.age);
      const res = await API.register(data);
      if (res.status === "success") {
        toast("¡Cuenta creada! Ya podés iniciar sesión.", "success", 4000);
        navigate("#/login");
      } else {
        toast(res.message || "Error al registrarse", "error");
        btn.disabled = false;
        btn.textContent = "Registrarse";
      }
    });
};
