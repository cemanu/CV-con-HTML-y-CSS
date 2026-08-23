import { SAMPLE_CV, emptyCV, ITEM_DEFAULTS } from "./data.js";
import { renderCV } from "./render.js";

const STORAGE_KEY = "vitae-cv-v1";
const TEMPLATE_KEY = "vitae-template-v1";

const FIELDS = {
  languages: [
    { key: "name", label: "Idioma", placeholder: "Español" },
    { key: "level", label: "Nivel", placeholder: "Nativo / B2" },
  ],
  skills: [{ key: "name", label: "Habilidad", placeholder: "Python", full: true }],
  education: [
    { key: "title", label: "Título / Programa", placeholder: "Ingeniería Informática", full: true },
    { key: "place", label: "Institución", placeholder: "Universidad…" },
    { key: "period", label: "Periodo", placeholder: "2020 – 2025" },
    { key: "detail", label: "Detalle", placeholder: "Opcional", textarea: true, full: true },
  ],
  certifications: [
    { key: "title", label: "Certificación", placeholder: "Nombre del curso", full: true },
    { key: "place", label: "Emisor", placeholder: "Coursera, AWS…" },
    { key: "period", label: "Año", placeholder: "2024" },
  ],
  experience: [
    { key: "title", label: "Rol / Actividad", placeholder: "Desarrollador", full: true },
    { key: "place", label: "Organización", placeholder: "Empresa u org." },
    { key: "period", label: "Periodo", placeholder: "2024 – 2025" },
    { key: "detail", label: "Descripción", placeholder: "Qué hiciste y el impacto…", textarea: true, full: true },
  ],
  projects: [
    { key: "title", label: "Proyecto", placeholder: "Nombre del proyecto", full: true },
    { key: "place", label: "Contexto", placeholder: "Universidad / personal" },
    { key: "period", label: "Año", placeholder: "2025" },
    { key: "detail", label: "Descripción", placeholder: "Tecnologías y resultados…", textarea: true, full: true },
  ],
  custom: [
    { key: "title", label: "Título de sección", placeholder: "Intereses", full: true },
    { key: "content", label: "Contenido", placeholder: "Texto de la sección…", textarea: true, full: true },
  ],
};

const state = {
  data: loadSaved() || emptyCV(),
  template: localStorage.getItem(TEMPLATE_KEY) || "classic",
  zoom: 0.9,
};

const els = {
  landing: document.getElementById("landing"),
  app: document.getElementById("app"),
  preview: document.getElementById("cvPreview"),
  scale: document.getElementById("previewScale"),
  zoomLabel: document.getElementById("zoomLabel"),
  templateSelect: document.getElementById("templateSelect"),
  toast: document.getElementById("toast"),
};

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
  localStorage.setItem(TEMPLATE_KEY, state.template);
}

function toast(message) {
  els.toast.textContent = message;
  els.toast.hidden = false;
  requestAnimationFrame(() => els.toast.classList.add("is-visible"));
  clearTimeout(toast._t);
  toast._t = setTimeout(() => {
    els.toast.classList.remove("is-visible");
    setTimeout(() => {
      els.toast.hidden = true;
    }, 250);
  }, 2200);
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/* ——— Lists UI ——— */
function renderList(key) {
  const container = document.getElementById(`list-${key}`);
  if (!container) return;

  const items = state.data[key] || [];
  if (!items.length) {
    container.innerHTML = `<p class="empty-hint">Aún no hay entradas. Pulsa «Añadir».</p>`;
    return;
  }

  const schema = FIELDS[key];
  container.innerHTML = items
    .map((item, index) => {
      const fieldsHtml = schema
        .map((field) => {
          const val = item[field.key] ?? "";
          const cls = field.full ? "field field--full" : "field";
          if (field.textarea) {
            return `<label class="${cls}"><span>${field.label}</span>
              <textarea data-list="${key}" data-index="${index}" data-key="${field.key}" rows="3" placeholder="${field.placeholder}">${escapeAttr(val)}</textarea>
            </label>`;
          }
          return `<label class="${cls}"><span>${field.label}</span>
            <input type="text" data-list="${key}" data-index="${index}" data-key="${field.key}" value="${escapeAttr(val)}" placeholder="${field.placeholder}">
          </label>`;
        })
        .join("");

      return `<div class="item-card" data-item="${key}-${index}">
        <div class="field-grid">${fieldsHtml}</div>
        <div class="item-card__actions">
          <button type="button" class="btn btn--ghost btn--sm btn--danger" data-remove="${key}" data-index="${index}">Eliminar</button>
        </div>
      </div>`;
    })
    .join("");
}

function escapeAttr(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function renderAllLists() {
  Object.keys(FIELDS).forEach(renderList);
}

function syncScalarInputs() {
  document.querySelectorAll("[data-path]").forEach((input) => {
    const path = input.getAttribute("data-path");
    input.value = state.data[path] ?? "";
  });
}

function updatePreview() {
  els.preview.className = `cv cv--${state.template}`;
  els.preview.innerHTML = renderCV(state.data, state.template);
  els.scale.style.transform = `scale(${state.zoom})`;
  els.zoomLabel.textContent = `${Math.round(state.zoom * 100)}%`;
  const label = (state.data.name || "").trim();
  document.title = label ? `${label} — Vitae` : "Vitae — Genera tu CV";
}

function refresh() {
  syncScalarInputs();
  renderAllLists();
  updatePreview();
  persist();
}

/* ——— Navigation ——— */
function enterApp({ withSample = false } = {}) {
  if (withSample) {
    state.data = deepClone(SAMPLE_CV);
  } else if (!loadSaved() && !state.data.name) {
    // keep empty
  }

  els.landing.classList.add("is-leaving");
  setTimeout(() => {
    els.landing.hidden = true;
    els.landing.classList.remove("is-leaving");
    els.app.hidden = false;
    refresh();
  }, 280);
}

function goHome() {
  els.app.hidden = true;
  els.landing.hidden = false;
}

/* ——— Events ——— */
function bindEvents() {
  document.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-action");
      switch (action) {
        case "start":
          enterApp();
          break;
        case "start-sample":
          enterApp({ withSample: true });
          toast("Ejemplo cargado — edítalo a tu gusto");
          break;
        case "home":
          goHome();
          break;
        case "export":
          window.print();
          break;
        case "load-sample":
          state.data = deepClone(SAMPLE_CV);
          refresh();
          toast("Ejemplo aplicado");
          break;
        case "reset":
          if (confirm("¿Borrar todos los datos del CV?")) {
            state.data = emptyCV();
            refresh();
            toast("CV limpio");
          }
          break;
        case "zoom-in":
          state.zoom = Math.min(1.2, +(state.zoom + 0.1).toFixed(1));
          updatePreview();
          break;
        case "zoom-out":
          state.zoom = Math.max(0.5, +(state.zoom - 0.1).toFixed(1));
          updatePreview();
          break;
      }
    });
  });

  // Tabs
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const panel = tab.getAttribute("data-panel");
      document.querySelectorAll(".tab").forEach((t) => {
        t.classList.toggle("is-active", t === tab);
        t.setAttribute("aria-selected", t === tab ? "true" : "false");
      });
      document.querySelectorAll(".panel").forEach((p) => {
        const match = p.id === `panel-${panel}`;
        p.classList.toggle("is-active", match);
        p.hidden = !match;
      });
    });
  });

  // Scalar fields
  document.querySelectorAll("[data-path]").forEach((input) => {
    input.addEventListener("input", () => {
      state.data[input.getAttribute("data-path")] = input.value;
      updatePreview();
      persist();
    });
  });

  // Template
  els.templateSelect.value = state.template;
  els.templateSelect.addEventListener("change", () => {
    state.template = els.templateSelect.value;
    updatePreview();
    persist();
  });

  // Add / remove / list edits (delegation)
  document.querySelector(".editor").addEventListener("click", (e) => {
    const addBtn = e.target.closest("[data-add]");
    if (addBtn) {
      const key = addBtn.getAttribute("data-add");
      if (!state.data[key]) state.data[key] = [];
      state.data[key].push(ITEM_DEFAULTS[key]());
      renderList(key);
      updatePreview();
      persist();
      return;
    }

    const removeBtn = e.target.closest("[data-remove]");
    if (removeBtn) {
      const key = removeBtn.getAttribute("data-remove");
      const index = Number(removeBtn.getAttribute("data-index"));
      state.data[key].splice(index, 1);
      renderList(key);
      updatePreview();
      persist();
    }
  });

  document.querySelector(".editor").addEventListener("input", (e) => {
    const el = e.target;
    if (!el.matches("[data-list]")) return;
    const key = el.getAttribute("data-list");
    const index = Number(el.getAttribute("data-index"));
    const field = el.getAttribute("data-key");
    if (!state.data[key]?.[index]) return;
    state.data[key][index][field] = el.value;
    updatePreview();
    persist();
  });
}

/* ——— Boot ——— */
bindEvents();
els.templateSelect.value = state.template;
updatePreview();

// If returning user has data, show a subtle ready state on landing — no auto-enter
