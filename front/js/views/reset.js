import * as API from "../api.js";
import { toast } from "../toast.js";

export const viewReset = () => {
  const params = new URLSearchParams(location.hash.split("?")[1] || "");
  const tokenValue = params.get("token") || "";
  return `
    <div class="card form-card">
      <div class="stepper">
        <div class="step done"><span class="step-number">✓</span> Email</div>
        <span class="step-line done"></span>
        <div class="step active"><span class="step-number">2</span> Token</div>
        <span class="step-line"></span>
        <div class="step"><span class="step-number">3</span> Nueva clave</div>
      </div>
      <h2 class="section-title text-center">Restablecer Contraseña</h2>
      <p class="text-center" style="color:var(--muted);margin-bottom:1rem;font-size:.85rem">
        Pegá el token que recibiste por email e ingresá tu nueva contraseña.
      </p>
      <form id="reset-form">
        <div class="form-group">
          <label>Token (del email)</label>
          <input type="text" name="token" value="${tokenValue}" required placeholder="Pegá el token aquí">
        </div>
        <div class="form-group">
          <label>Nueva Contraseña</label>
          <input type="password" name="new_password" required placeholder="Mínimo 6 caracteres" minlength="6">
        </div>
        <button class="btn btn-primary" style="width:100%" id="reset-btn">Restablecer contraseña</button>
      </form>
      <p class="text-center mt-1">
        <a class="link" href="#/forgot-password">← No recibí el token</a>
      </p>
    </div>`;
};

export const mountReset = () => {
  document
    .getElementById("reset-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = document.getElementById("reset-btn");
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span>Restableciendo...';

      const fd = new FormData(e.target);
      const res = await API.resetPassword(
        fd.get("token"),
        fd.get("new_password"),
      );
      if (res.status === "success") {
        const app = document.getElementById("app");
        app.innerHTML = `
          <div class="card form-card">
            <div class="stepper">
              <div class="step done"><span class="step-number">✓</span> Email</div>
              <span class="step-line done"></span>
              <div class="step done"><span class="step-number">✓</span> Token</div>
              <span class="step-line done"></span>
              <div class="step done"><span class="step-number">✓</span> Nueva clave</div>
            </div>
            <div class="confirm-screen">
              <div class="confirm-icon">🔒</div>
              <h3>¡Contraseña restablecida!</h3>
              <p>Ya podés iniciar sesión con tu nueva contraseña.</p>
            </div>
            <div class="text-center mt-1">
              <a class="btn btn-primary" href="#/login">Ir al login</a>
            </div>
          </div>`;
        toast("Contraseña actualizada correctamente", "success", 4000);
      } else {
        toast(res.message || "Error al restablecer la contraseña", "error");
        btn.disabled = false;
        btn.textContent = "Restablecer contraseña";
      }
    });
};
