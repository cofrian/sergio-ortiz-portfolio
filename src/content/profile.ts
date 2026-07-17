import type { Locale } from "@/lib/i18n";

export const profile = {
  name: "Sergio Ortiz",
  initials: "SO",
  location: "Valencia, Spain",
  github: "https://github.com/cofrian",
  linkedin: "https://www.linkedin.com/in/sergioortizmontesinos/",
  email: "scofrian@gmail.com" as string | null,
  cv: { en: null as string | null, es: null as string | null },
  bio: {
    en: "I work at the intersection of data science, artificial intelligence, software engineering and automation, with a focus on useful systems for real-world environments.",
    es: "Trabajo en la intersección de ciencia de datos, inteligencia artificial, ingeniería de software y automatización, con foco en sistemas útiles para entornos reales.",
  },
  education: {
    en: "Data Science at Universitat Politècnica de València",
    es: "Ciencia de Datos en la Universitat Politècnica de València",
  },
  focus: ["Machine Learning", "MLOps", "Data Engineering", "Applied AI"],
};

export const verifiedMilestones = [
  {
    year: "2026",
    title: "GEMF · EXIST 2026",
    type: { en: "Research result", es: "Resultado de investigación" },
    description: {
      en: "Three first places on official EXIST 2026 Task 2 leaderboards.",
      es: "Tres primeros puestos en rankings oficiales de EXIST 2026 Task 2.",
    },
    href: "https://github.com/cofrian/exist2026-ordantis",
  },
  {
    year: "2026",
    title: "UrbanFlow Valencia",
    type: { en: "Academic system", es: "Sistema académico" },
    description: {
      en: "End-to-end prediction, optimisation, deployment and monitoring project graded 10/10.",
      es: "Proyecto completo de predicción, optimización, despliegue y monitorización calificado con 10/10.",
    },
    href: "https://github.com/cofrian/urbanflow-valencia-mlops",
  },
  {
    year: "2025–26",
    title: "UPV-EARTH",
    type: { en: "Research platform", es: "Plataforma de investigación" },
    description: {
      en: "Planetary Boundaries research-intelligence platform graded 9.9/10.",
      es: "Plataforma de inteligencia científica sobre Límites Planetarios calificada con 9,9/10.",
    },
    href: "https://github.com/cofrian/upv-earth-planetary-boundaries",
  },
  {
    year: "2025",
    title: "GenAI Maverick · Accenture Spain",
    type: { en: "Challenge winner", es: "Ganador de reto" },
    description: {
      en: "Winner of the Retail & Fashion challenge with a multimodal outfit recommender prototype.",
      es: "Ganador del reto Retail & Fashion con un prototipo multimodal de recomendación de conjuntos.",
    },
    href: "https://github.com/cofrian/outfit-ai-recommender",
  },
];

export const aboutPrinciples = [
  {
    key: "think",
    title: { en: "How I think", es: "Cómo pienso" },
    body: {
      en: "Start with context, question assumptions and make uncertainty visible.",
      es: "Empezar por el contexto, cuestionar supuestos y hacer visible la incertidumbre.",
    },
  },
  {
    key: "build",
    title: { en: "How I build", es: "Cómo construyo" },
    body: {
      en: "Connect data, models, software and deployment instead of stopping at a notebook.",
      es: "Conectar datos, modelos, software y despliegue en lugar de detenerse en un notebook.",
    },
  },
  {
    key: "care",
    title: { en: "What I care about", es: "Lo que me importa" },
    body: {
      en: "Reproducibility, honest evaluation and systems that are genuinely useful.",
      es: "Reproducibilidad, evaluación honesta y sistemas genuinamente útiles.",
    },
  },
];

export function localize<T extends Record<Locale, string>>(value: T, locale: Locale) {
  return value[locale] || value.en;
}
