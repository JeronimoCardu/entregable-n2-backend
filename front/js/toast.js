const TOAST_ICONS = { success: "✓", error: "✕", info: "ℹ", warning: "⚠" };

export const toast = (msg, type = "success", duration = 3500) => {
  const container = document.getElementById("toast-container");
  const el = document.createElement("div");
  el.className = "toast " + type;
  el.style.setProperty("--toast-duration", duration + "ms");
  el.innerHTML = `
    <span class="toast-icon">${TOAST_ICONS[type] || TOAST_ICONS.info}</span>
    <span class="toast-msg">${msg}</span>
    <button class="toast-close">&times;</button>
    <span class="toast-progress"></span>`;
  container.appendChild(el);

  const remove = () => {
    el.classList.add("removing");
    el.addEventListener("animationend", () => el.remove());
  };

  el.querySelector(".toast-close").addEventListener("click", remove);
  const timer = setTimeout(remove, duration);
  el.addEventListener("mouseenter", () => clearTimeout(timer));
  el.addEventListener("mouseleave", () => setTimeout(remove, 1500));
};
