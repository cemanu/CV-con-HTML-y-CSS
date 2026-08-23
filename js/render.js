function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function contactParts(data) {
  return [data.location, data.phone, data.email, data.website].filter(Boolean);
}

function hasAny(arr) {
  return Array.isArray(arr) && arr.some((item) => Object.values(item).some((v) => String(v || "").trim()));
}

function entryMeta(place, period) {
  return [place, period].filter(Boolean).join(", ");
}

/* ——— Classic ——— */
function renderClassic(data) {
  const contacts = contactParts(data);
  const contactHtml = contacts.length
    ? contacts.map(esc).join(" ♦ ")
    : '<span class="cv__empty">Ciudad · Teléfono · Correo</span>';

  const langs = hasAny(data.languages)
    ? `<div class="cv__langs">${data.languages
        .filter((l) => l.name)
        .map((l) => `<span><b>${esc(l.name)}</b>${l.level ? ` — ${esc(l.level)}` : ""}</span>`)
        .join("")}</div>`
    : "";

  const skills = hasAny(data.skills)
    ? `<p class="cv__text">${data.skills
        .filter((s) => s.name)
        .map((s) => esc(s.name))
        .join(" · ")}</p>`
    : "";

  const edu = hasAny(data.education)
    ? data.education
        .filter((e) => e.title || e.place)
        .map(
          (e) =>
            `<p class="cv__text"><b>${esc(e.title)}</b>${e.period || e.place ? `, ${esc(entryMeta(e.period, e.place))}` : ""}${
              e.detail ? `<br>${esc(e.detail)}` : ""
            }</p>`
        )
        .join("")
    : "";

  const certs = hasAny(data.certifications)
    ? `<ul class="cv__list">${data.certifications
        .filter((c) => c.title)
        .map(
          (c) =>
            `<li><b>${esc(c.title)}</b>${c.period || c.place ? `, ${esc(entryMeta(c.period, c.place))}` : ""}</li>`
        )
        .join("")}</ul>`
    : "";

  const projects = hasAny(data.projects)
    ? `<ul class="cv__list">${data.projects
        .filter((p) => p.title)
        .map(
          (p) =>
            `<li><b>${esc(p.title)}</b>${p.place || p.period ? `, ${esc(entryMeta(p.place, p.period))}` : ""}${
              p.detail ? `<br>${esc(p.detail)}` : ""
            }</li>`
        )
        .join("")}</ul>`
    : "";

  const exp = hasAny(data.experience)
    ? `<ul class="cv__list">${data.experience
        .filter((e) => e.title || e.place)
        .map(
          (e) =>
            `<li><b>${esc(e.title || e.place)}${e.period ? ` (${esc(e.period)})` : ""}</b>${
              e.place && e.title ? `<br>${esc(e.place)}` : ""
            }${e.detail ? `<br>${esc(e.detail)}` : ""}</li>`
        )
        .join("")}</ul>`
    : "";

  const custom = (data.custom || [])
    .filter((c) => c.title || c.content)
    .map(
      (c) => `
      <section class="cv__section">
        <h2 class="cv__section-title">${esc(c.title || "Sección")}</h2>
        <p class="cv__text">${esc(c.content).replace(/\n/g, "<br>")}</p>
      </section>`
    )
    .join("");

  return `
    <div class="cv__rules">
      <hr class="cv__rule cv__rule--thick">
      <hr class="cv__rule cv__rule--thin">
    </div>
    <h1 class="cv__name">${data.name ? esc(data.name) : '<span class="cv__empty">Tu nombre</span>'}</h1>
    <p class="cv__contact">${contactHtml}</p>
    <div class="cv__rules">
      <hr class="cv__rule cv__rule--thin">
      <hr class="cv__rule cv__rule--thick">
    </div>
    ${
      data.summary
        ? `<section class="cv__section"><h2 class="cv__section-title">Resumen personal</h2><p class="cv__text">${esc(data.summary)}</p></section>`
        : ""
    }
    ${langs ? `<section class="cv__section"><h2 class="cv__section-title">Idiomas</h2>${langs}</section>` : ""}
    ${skills ? `<section class="cv__section"><h2 class="cv__section-title">Habilidades</h2>${skills}</section>` : ""}
    ${edu ? `<section class="cv__section"><h2 class="cv__section-title">Educación</h2>${edu}</section>` : ""}
    ${certs ? `<section class="cv__section"><h2 class="cv__section-title">Certificaciones</h2>${certs}</section>` : ""}
    ${projects ? `<section class="cv__section"><h2 class="cv__section-title">Proyectos</h2>${projects}</section>` : ""}
    ${exp ? `<section class="cv__section"><h2 class="cv__section-title">Actividades y experiencia</h2>${exp}</section>` : ""}
    ${custom}
  `;
}

/* ——— Modern ——— */
function renderModern(data) {
  const contacts = contactParts(data)
    .map((c) => `<span>${esc(c)}</span>`)
    .join("");

  const langs = hasAny(data.languages)
    ? `<div class="cv__langs">${data.languages
        .filter((l) => l.name)
        .map((l) => `<span><strong>${esc(l.name)}</strong>${l.level ? ` — ${esc(l.level)}` : ""}</span>`)
        .join("")}</div>`
    : "";

  const skills = hasAny(data.skills)
    ? `<ul class="cv__chips">${data.skills
        .filter((s) => s.name)
        .map((s) => `<li>${esc(s.name)}</li>`)
        .join("")}</ul>`
    : "";

  const listEntries = (items, withDetail = true) =>
    items
      .filter((e) => e.title || e.place || e.name)
      .map((e) => {
        const title = e.title || e.name || "";
        const meta = entryMeta(e.place, e.period);
        return `<div class="cv__entry">
          <div class="cv__entry-title">${esc(title)}</div>
          ${meta ? `<div class="cv__entry-meta">${esc(meta)}</div>` : ""}
          ${withDetail && e.detail ? `<p class="cv__entry-desc">${esc(e.detail)}</p>` : ""}
          ${e.level ? `<div class="cv__entry-meta">${esc(e.level)}</div>` : ""}
        </div>`;
      })
      .join("");

  const custom = (data.custom || [])
    .filter((c) => c.title || c.content)
    .map(
      (c) => `
      <section class="cv__section">
        <h2 class="cv__section-title">${esc(c.title || "Sección")}</h2>
        <p class="cv__entry-desc">${esc(c.content).replace(/\n/g, "<br>")}</p>
      </section>`
    )
    .join("");

  return `
    <h1 class="cv__name">${data.name ? esc(data.name) : '<span class="cv__empty">Tu nombre</span>'}</h1>
    <p class="cv__contact">${contacts || '<span class="cv__empty">Contacto</span>'}</p>
    ${data.summary ? `<p class="cv__summary">${esc(data.summary)}</p>` : ""}
    ${langs ? `<section class="cv__section"><h2 class="cv__section-title">Idiomas</h2>${langs}</section>` : ""}
    ${skills ? `<section class="cv__section"><h2 class="cv__section-title">Habilidades</h2>${skills}</section>` : ""}
    ${hasAny(data.education) ? `<section class="cv__section"><h2 class="cv__section-title">Educación</h2>${listEntries(data.education)}</section>` : ""}
    ${hasAny(data.certifications) ? `<section class="cv__section"><h2 class="cv__section-title">Certificaciones</h2>${listEntries(data.certifications, false)}</section>` : ""}
    ${hasAny(data.experience) ? `<section class="cv__section"><h2 class="cv__section-title">Experiencia</h2>${listEntries(data.experience)}</section>` : ""}
    ${hasAny(data.projects) ? `<section class="cv__section"><h2 class="cv__section-title">Proyectos</h2>${listEntries(data.projects)}</section>` : ""}
    ${custom}
  `;
}

/* ——— Compact ——— */
function renderCompact(data) {
  const contactLines = contactParts(data).map(esc).join("<br>") || '<span class="cv__empty">Contacto</span>';

  const simpleList = (items, mapFn) =>
    `<ul class="cv__list-plain">${items
      .filter((i) => Object.values(i).some((v) => String(v || "").trim()))
      .map(mapFn)
      .join("")}</ul>`;

  const entries = (items) =>
    items
      .filter((e) => e.title || e.place)
      .map(
        (e) => `<div class="cv__entry">
        <div class="cv__entry-title">${esc(e.title || e.place)}</div>
        <div class="cv__entry-meta">${esc(entryMeta(e.place && e.title ? e.place : "", e.period))}</div>
        ${e.detail ? `<p class="cv__entry-desc">${esc(e.detail)}</p>` : ""}
      </div>`
      )
      .join("");

  const left = `
    ${data.summary ? `<p class="cv__summary">${esc(data.summary)}</p>` : ""}
    ${hasAny(data.experience) ? `<section class="cv__section"><h2 class="cv__section-title">Experiencia</h2>${entries(data.experience)}</section>` : ""}
    ${hasAny(data.projects) ? `<section class="cv__section"><h2 class="cv__section-title">Proyectos</h2>${entries(data.projects)}</section>` : ""}
  `;

  const right = `
    ${hasAny(data.education) ? `<section class="cv__section"><h2 class="cv__section-title">Educación</h2>${entries(data.education)}</section>` : ""}
    ${
      hasAny(data.certifications)
        ? `<section class="cv__section"><h2 class="cv__section-title">Certificaciones</h2>${simpleList(
            data.certifications,
            (c) => `<li><strong>${esc(c.title)}</strong>${c.period ? ` (${esc(c.period)})` : ""}</li>`
          )}</section>`
        : ""
    }
    ${
      hasAny(data.skills)
        ? `<section class="cv__section"><h2 class="cv__section-title">Habilidades</h2>${simpleList(
            data.skills,
            (s) => `<li>${esc(s.name)}</li>`
          )}</section>`
        : ""
    }
    ${
      hasAny(data.languages)
        ? `<section class="cv__section"><h2 class="cv__section-title">Idiomas</h2>${simpleList(
            data.languages,
            (l) => `<li><strong>${esc(l.name)}</strong>${l.level ? ` — ${esc(l.level)}` : ""}</li>`
          )}</section>`
        : ""
    }
    ${(data.custom || [])
      .filter((c) => c.title || c.content)
      .map(
        (c) => `<section class="cv__section"><h2 class="cv__section-title">${esc(c.title || "Extra")}</h2>
        <p class="cv__entry-desc">${esc(c.content).replace(/\n/g, "<br>")}</p></section>`
      )
      .join("")}
  `;

  return `
    <header class="cv__header">
      <h1 class="cv__name">${data.name ? esc(data.name) : '<span class="cv__empty">Tu nombre</span>'}</h1>
      <p class="cv__contact">${contactLines}</p>
    </header>
    <div class="cv__grid">
      <div>${left}</div>
      <div>${right}</div>
    </div>
  `;
}

export function renderCV(data, template) {
  switch (template) {
    case "modern":
      return renderModern(data);
    case "compact":
      return renderCompact(data);
    default:
      return renderClassic(data);
  }
}
