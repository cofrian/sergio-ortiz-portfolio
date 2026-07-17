import type { Locale } from "@/lib/i18n";

export const profile = {
  name: "Sergio Ortiz",
  initials: "SO",
  location: "Valencia, Spain",
  github: "https://github.com/cofrian",
  linkedin: "https://www.linkedin.com/in/sergioortizmontesinos/",
  email: "scofrian@gmail.com" as string | null,
  cv: { en: null as string | null, es: null as string | null },
  headline: {
    en: "Data Science student · Freelance AI & data builder · Community leader",
    es: "Estudiante de Ciencia de Datos · Freelance en Datos e IA · Líder de comunidad",
  },
  aboutStatement: {
    en: "Data, models and software — connected to real decisions.",
    es: "Datos, modelos y software conectados con decisiones reales.",
  },
  bio: {
    en: "I build end-to-end data and AI systems for real organisations and real decisions. My work brings together modelling, software and automation; beyond the code, I lead university initiatives and coordinate teams.",
    es: "Construyo sistemas de datos e IA de extremo a extremo para organizaciones y decisiones reales. Mi trabajo combina modelado, software y automatización; fuera del código, lidero iniciativas universitarias y coordino equipos.",
  },
  education: {
    en: "Data Science at Universitat Politècnica de València",
    es: "Ciencia de Datos en la Universitat Politècnica de València",
  },
  focus: ["Machine Learning", "MLOps", "Data Engineering", "Applied AI", "Freelance", "Leadership", "Social Impact", "Innovation"],
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
  {
    key: "lead",
    title: { en: "How I lead", es: "Cómo lidero" },
    body: {
      en: "Give teams context, turn ideas into clear responsibilities and create the conditions for people to contribute and learn.",
      es: "Dar contexto a los equipos, convertir ideas en responsabilidades claras y crear las condiciones para que las personas aporten y aprendan.",
    },
  },
];

export function localize<T extends Record<Locale, string>>(value: T, locale: Locale) {
  return value[locale] || value.en;
}
