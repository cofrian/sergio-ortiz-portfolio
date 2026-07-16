export const notes = [
  {
    slug: "gemini-as-semantic-mediator",
    category: "Research",
    date: "2026-07-01",
    readTime: 5,
    title: {
      en: "Using an LLM to translate, not to judge",
      es: "Usar un LLM para traducir, no para decidir",
    },
    excerpt: {
      en: "The design decision behind GEMF: turn visual and pragmatic meaning into structured evidence before supervised prediction.",
      es: "La decisión detrás de GEMF: convertir significado visual y pragmático en evidencia estructurada antes de la predicción supervisada.",
    },
    sourceUrl: "https://github.com/cofrian/exist2026-ordantis",
    projectSlug: "gemf-exist-2026",
    visual: "gemf" as const,
  },
  {
    slug: "model-is-not-finished",
    category: "MLOps",
    date: "2026-06-20",
    readTime: 6,
    title: {
      en: "A model is not finished when evaluation ends",
      es: "Un modelo no termina cuando acaba la evaluación",
    },
    excerpt: {
      en: "What UrbanFlow adds around the model: publishing, an API, monitoring and decision logic.",
      es: "Lo que UrbanFlow añade alrededor del modelo: publicación, API, monitorización y lógica de decisión.",
    },
    sourceUrl: "https://github.com/cofrian/urbanflow-valencia-mlops",
    projectSlug: "urbanflow-valencia",
    visual: "urbanflow" as const,
  },
  {
    slug: "rigor-over-agreement",
    category: "LLMs",
    date: "2026-06-05",
    readTime: 7,
    title: {
      en: "Why agreement was not enough for UPV-EARTH",
      es: "Por qué el acuerdo no era suficiente en UPV-EARTH",
    },
    excerpt: {
      en: "A model that never rejects irrelevant documents can look accurate while producing an unusable institutional map.",
      es: "Un modelo que nunca rechaza documentos irrelevantes puede parecer preciso y producir un mapa institucional inutilizable.",
    },
    sourceUrl: "https://github.com/cofrian/upv-earth-planetary-boundaries",
    projectSlug: "upv-earth",
    visual: "earth" as const,
  },
  {
    slug: "forecasting-events-before-routes",
    category: "Smart Cities",
    date: "2026-05-25",
    readTime: 5,
    title: {
      en: "Routing starts before the vehicle moves",
      es: "La ruta empieza antes de que el vehículo se mueva",
    },
    excerpt: {
      en: "AION explores how future events can become structured signals for traffic forecasting.",
      es: "AION explora cómo eventos futuros pueden convertirse en señales estructuradas para predecir tráfico.",
    },
    sourceUrl: "https://github.com/cofrian/aion-emergency-routing-valencia",
    projectSlug: "aion-emergency-routing",
    visual: "aion" as const,
  },
];
