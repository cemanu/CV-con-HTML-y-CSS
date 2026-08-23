/** Datos de ejemplo basados en el CV original */
export const SAMPLE_CV = {
  name: "Cesar Manuel Flores Loro",
  location: "Lima, Perú",
  phone: "987 654 321",
  email: "correo@dominio.pe",
  website: "",
  summary:
    "Estudiante de Ingeniería Informática en la PUCP, cursando el 8vo ciclo de la carrera. Interesado en el desarrollo y mantenimiento de plataformas tecnológicas, con conocimientos en SQL (MySQL y Oracle), Java, Python y experiencia en sistemas Linux a nivel de consola, procesos e hilos.",
  languages: [
    { name: "Español", level: "Lengua materna" },
    { name: "Inglés", level: "Intermedio Alto B2" },
  ],
  skills: [
    { name: "Java" },
    { name: "Python" },
    { name: "SQL (MySQL, Oracle)" },
    { name: "Linux" },
    { name: "Power BI" },
  ],
  education: [
    {
      title: "Carrera de Ingeniería Informática",
      place: "Pontificia Universidad Católica del Perú",
      period: "En curso",
      detail: "",
    },
  ],
  certifications: [
    {
      title: "Power BI Intermedio-Avanzado",
      place: "San Ignacio University Miami (Netzun)",
      period: "2024",
    },
    {
      title: "Manejo de hojas de cálculo en Excel",
      place: "University of Colorado Boulder (Coursera)",
      period: "2022",
    },
  ],
  experience: [
    {
      title: "Director — mesa directiva",
      place: "AAII - PUCP",
      period: "2025",
      detail: "Liderazgo de iniciativas académicas y tecnológicas.",
    },
    {
      title: "Apoyo operativo",
      place: "AWS Community Day Perú",
      period: "2024",
      detail: "Apoyo a ponentes y soporte en operación de plataformas.",
    },
    {
      title: "Miembro",
      place: "Capítulo CTSoc IEEE",
      period: "2022",
      detail: "Diseño, pruebas y presentación de producto orientado al consumidor.",
    },
  ],
  projects: [
    {
      title: "Backend de plataforma web para clínica",
      place: "PUCP",
      period: "2025",
      detail:
        "Implementación del backend en Java y MySQL para un sistema de gestión de citas médicas, desarrollando servicios REST para gestión de citas, facturación y almacenamiento de datos clínicos, aplicando arquitectura en capas y pruebas de integración.",
    },
    {
      title: "Modelos de Machine Learning para predicción agrícola",
      place: "PUCP",
      period: "2025",
      detail:
        "Desarrollo de modelos en Python para predecir precios agrícolas. Incluyó limpieza de datos, regresiones y métricas de desempeño.",
    },
    {
      title: "Diseño de Base de Datos",
      place: "PUCP",
      period: "2023",
      detail: "Implementación en Oracle SQL con PL/SQL y reportes automatizados en Power BI.",
    },
  ],
  custom: [],
};

export function emptyCV() {
  return {
    name: "",
    location: "",
    phone: "",
    email: "",
    website: "",
    summary: "",
    languages: [],
    skills: [],
    education: [],
    certifications: [],
    experience: [],
    projects: [],
    custom: [],
  };
}

export const ITEM_DEFAULTS = {
  languages: () => ({ name: "", level: "" }),
  skills: () => ({ name: "" }),
  education: () => ({ title: "", place: "", period: "", detail: "" }),
  certifications: () => ({ title: "", place: "", period: "" }),
  experience: () => ({ title: "", place: "", period: "", detail: "" }),
  projects: () => ({ title: "", place: "", period: "", detail: "" }),
  custom: () => ({ title: "", content: "" }),
};
