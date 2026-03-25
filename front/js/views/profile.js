import { state } from "../state.js";

export const viewProfile = () => {
  const u = state.user;
  if (!u) return '<p class="empty-state">No hay sesión activa.</p>';
  return `
    <div class="card form-card">
      <h2 class="section-title">Mi Perfil</h2>
      <div class="profile-field"><span>Nombre:</span> ${u.first_name} ${u.last_name}</div>
      <div class="profile-field"><span>Email:</span> ${u.email}</div>
      <div class="profile-field"><span>Edad:</span> ${u.age}</div>
      <div class="profile-field"><span>Rol:</span> ${u.role}</div>
    </div>`;
};
