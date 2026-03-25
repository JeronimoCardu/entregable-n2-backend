import * as API from "../api.js";
import { toast } from "../toast.js";
import { esc } from "../utils/esc.js";

export const viewForgot = () => `
  <div class="card form-card">
    <div class="stepper">
      <div class="step active"><span class="step-number">1</span> Email</div>
      <span class="step-line"></span>
      <div class="step"><span class="step-number">2</span> Token</div>
      <span class="step-line"></span>
      <div class="step"><span class="step-number">3</span> Nueva clave</div>
    </div>
    <h2 class="section-title text-center">Recuperar Contraseña</h2>
    <p class="text-center" style="color:var(--muted);margin-bottom:1rem;font-size:.85rem">
      Ingresá tu email y te enviaremos un enlace de recuperación.
    </p>
    <form id="forgot-form">
      <div class="form-group">
        <label>Email</label>
        <input type="email" name="email" required placeholder="tu@email.com">
      </div>
      <button class="btn btn-primary" style="width:100%" id="forgot-btn">Enviar enlace</button>
    </form>
    <p class="text-center mt-1">
      <a class="link" href="#/login">← Volver al login</a>
    </p>
  </div>`;

export const mountForgot = () => {
  document
    .getElementById("forgot-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = document.getElementById("forgot-btn");
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span>Enviando...';

      const email = new FormData(e.target).get("email");
      const res = await API.forgotPassword(email);
      if (res.status === "success") {
        const app = document.getElementById("app");
        app.innerHTML = `
          <div class="card form-card">
            <div class="confirm-screen">
              <div class="confirm-icon">📧</div>
              <h3>¡Email enviado!</h3>
              <p>Revisá tu bandeja de entrada en <strong>${esc(email)}</strong></p>
              <p>Copiá el token que recibiste y usalo en el siguiente paso.</p>
            </div>
            <div class="text-center mt-1">
              <a class="btn btn-primary" href="#/reset-password">Tengo el token →</a>
            </div>
            <p class="text-center mt-1">
              <a class="link" href="#/forgot-password">Reenviar email</a>
            </p>
          </div>`;
        toast("Email de recuperación enviado", "success");
      } else {
        toast(res.message || "Error al enviar el email", "error");
        btn.disabled = false;
        btn.textContent = "Enviar enlace";
      }
    });
};
