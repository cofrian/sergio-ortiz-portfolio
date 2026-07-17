import type { ProjectRecord } from "@/lib/schemas";

type LocalizedText = { en: string; es: string };

export interface PortfolioNote {
  slug: string;
  category: string;
  date: string;
  readTime: number;
  title: LocalizedText;
  excerpt: LocalizedText;
  sections: Array<{
    title: LocalizedText;
    body: LocalizedText;
  }>;
  takeaway: LocalizedText;
  sourceUrl: string;
  sourceLabel: LocalizedText;
  projectSlug: string;
  visual: ProjectRecord["visual"];
}

export const notes: PortfolioNote[] = [
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
    sections: [
      {
        title: { en: "The label is not in one modality", es: "La etiqueta no está en una sola modalidad" },
        body: {
          en: "A meme can look harmless if its image and caption are read independently. GEMF starts from the opposite assumption: the useful signal often appears in the relationship between both, together with tone, implication and cultural context.",
          es: "Un meme puede parecer inofensivo si la imagen y el texto se leen por separado. GEMF parte de la idea contraria: la señal útil suele aparecer en la relación entre ambos, junto con el tono, la implicación y el contexto cultural.",
        },
      },
      {
        title: { en: "Mediator, not oracle", es: "Mediador, no oráculo" },
        body: {
          en: "Gemini does not output the final class. It converts visual and pragmatic meaning into a structured textual representation. Supervised encoders then combine it with OCR, EEG and Ekman emotion features. This keeps the generative model in an evidence-producing role rather than treating it as an unaccountable judge.",
          es: "Gemini no produce la clase final. Convierte el significado visual y pragmático en una representación textual estructurada. Después, encoders supervisados la combinan con OCR, EEG y emociones de Ekman. Así, el modelo generativo aporta evidencia en lugar de actuar como un juez difícil de auditar.",
        },
      },
      {
        title: { en: "Disagreement is part of the target", es: "El desacuerdo forma parte del objetivo" },
        body: {
          en: "The project learns from soft labels because annotator disagreement can describe genuine ambiguity. That choice also makes calibration and thresholding first-class modelling decisions. The repository documents where this worked and where hard-label thresholds did not transfer reliably.",
          es: "El proyecto aprende de etiquetas soft porque el desacuerdo entre anotadores puede describir una ambigüedad real. Esa decisión convierte la calibración y los umbrales en partes centrales del modelado. El repositorio documenta dónde funcionó y dónde los umbrales hard no se trasladaron de forma fiable.",
        },
      },
    ],
    takeaway: {
      en: "Use a general model to make hidden meaning explicit; keep the final decision in an evaluated, task-specific system.",
      es: "Usar un modelo general para hacer explícito el significado oculto y mantener la decisión final en un sistema específico y evaluado.",
    },
    sourceUrl: "https://github.com/cofrian/exist2026-ordantis",
    sourceLabel: { en: "GEMF repository and official results", es: "Repositorio de GEMF y resultados oficiales" },
    projectSlug: "gemf-exist-2026",
    visual: "gemf",
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
    sections: [
      {
        title: { en: "Prediction and decision are different products", es: "Predicción y decisión son productos distintos" },
        body: {
          en: "UrbanFlow uses 24 hourly CatBoost models to forecast traffic across 1,158 zones. A separate integer-programming optimizer chooses facility locations under constraints. Keeping both layers independent makes it clear what the model predicts and what the decision system optimizes.",
          es: "UrbanFlow usa 24 modelos CatBoost horarios para predecir tráfico en 1.158 zonas. Un optimizador independiente de programación entera selecciona ubicaciones bajo restricciones. Separar ambas capas aclara qué predice el modelo y qué optimiza el sistema de decisión.",
        },
      },
      {
        title: { en: "Deployment changes the definition of done", es: "El despliegue cambia la definición de terminado" },
        body: {
          en: "A test metric cannot answer whether a city team can query a forecast, inspect a zone or reproduce a release. FastAPI, Next.js, Docker and GitHub Actions turn the modelling work into a service that can be used and updated.",
          es: "Una métrica de test no responde si un equipo urbano puede consultar una predicción, inspeccionar una zona o reproducir una versión. FastAPI, Next.js, Docker y GitHub Actions convierten el modelado en un servicio utilizable y actualizable.",
        },
      },
      {
        title: { en: "Monitoring must match the operating unit", es: "La monitorización debe seguir la unidad operativa" },
        body: {
          en: "A single global score can hide systematic errors. The project monitors MAE by hour and looks for persistent errors by zone. It also states an important limitation: one month of training data is not enough to claim seasonal generalization.",
          es: "Una única métrica global puede ocultar errores sistemáticos. El proyecto monitoriza el MAE por hora y busca errores persistentes por zona. También declara una limitación importante: un mes de datos no permite afirmar generalización estacional.",
        },
      },
    ],
    takeaway: {
      en: "The useful unit is not the trained model; it is the observable path from data to a defensible decision.",
      es: "La unidad útil no es el modelo entrenado, sino el camino observable desde los datos hasta una decisión defendible.",
    },
    sourceUrl: "https://github.com/cofrian/urbanflow-valencia-mlops",
    sourceLabel: { en: "UrbanFlow repository, evaluation and deployment", es: "Repositorio, evaluación y despliegue de UrbanFlow" },
    projectSlug: "urbanflow-valencia",
    visual: "urbanflow",
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
    sections: [
      {
        title: { en: "Sustainability vocabulary is a weak shortcut", es: "El vocabulario de sostenibilidad es un atajo débil" },
        body: {
          en: "A paper can mention sustainability without studying an Earth-system process. Another can contribute directly to a Planetary Boundary while avoiding familiar policy language. UPV-EARTH therefore treats the task as evidence-based research classification, not keyword tagging.",
          es: "Un artículo puede mencionar sostenibilidad sin estudiar un proceso del sistema terrestre. Otro puede contribuir directamente a un Límite Planetario sin usar lenguaje habitual de políticas públicas. UPV-EARTH trata la tarea como clasificación científica basada en evidencia, no como etiquetado por palabras clave.",
        },
      },
      {
        title: { en: "Rejection is a capability", es: "Rechazar también es una capacidad" },
        body: {
          en: "The project compares TF-IDF, scientific embeddings and local LLMs while measuring positivity bias. A model that assigns nearly every abstract somewhere may agree often on positive examples and still corrupt the final institutional map by refusing to abstain.",
          es: "El proyecto compara TF-IDF, embeddings científicos y LLM locales midiendo el sesgo positivo. Un modelo que asigna casi todos los resúmenes a alguna categoría puede coincidir en ejemplos positivos y aun así degradar el mapa institucional por no saber abstenerse.",
        },
      },
      {
        title: { en: "Auditability can be worth a small trade-off", es: "La auditabilidad puede justificar un pequeño intercambio" },
        body: {
          en: "The auditable agent cascade keeps evidence and review traces visible. The repository is explicit that this trades a small amount of Top-1 accuracy for a process that can be inspected—an appropriate choice when classifications will guide institutional analysis.",
          es: "La cascada auditable mantiene visibles la evidencia y las trazas de revisión. El repositorio explica que intercambia una pequeña parte de precisión Top-1 por un proceso inspeccionable, una decisión razonable cuando las clasificaciones guían análisis institucionales.",
        },
      },
    ],
    takeaway: {
      en: "Evaluate the failure that damages the final use case, not only the metric that is easiest to compare.",
      es: "Evaluar el fallo que perjudica el uso final, no solo la métrica más fácil de comparar.",
    },
    sourceUrl: "https://github.com/cofrian/upv-earth-planetary-boundaries",
    sourceLabel: { en: "UPV-EARTH corpus, evaluation and platform", es: "Corpus, evaluación y plataforma UPV-EARTH" },
    projectSlug: "upv-earth",
    visual: "earth",
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
    sections: [
      {
        title: { en: "Reactive maps see the effect, not the cause", es: "Los mapas reactivos ven el efecto, no la causa" },
        body: {
          en: "A concert ending, announced roadworks or severe weather can change accessibility before sensors show congestion. For emergency mobility, waiting for the queue to form is already late.",
          es: "El final de un concierto, unas obras anunciadas o una situación meteorológica adversa pueden cambiar la accesibilidad antes de que los sensores muestren congestión. Para movilidad de emergencias, esperar a que se forme la cola ya es llegar tarde.",
        },
      },
      {
        title: { en: "Text becomes a city signal", es: "El texto se convierte en señal urbana" },
        body: {
          en: "AION documents a pipeline that turns local news, events and weather into structured variables. A robust baseline, PCA embeddings, CatBoost and sigmoid shrink then predict deviations from normal traffic rather than treating every hour as an isolated state.",
          es: "AION documenta un pipeline que convierte noticias locales, eventos y meteorología en variables estructuradas. Un baseline robusto, embeddings PCA, CatBoost y sigmoid shrink predicen desviaciones del tráfico normal en lugar de tratar cada hora como un estado aislado.",
        },
      },
      {
        title: { en: "A documented prototype is not an emergency deployment", es: "Un prototipo documentado no es un despliegue de emergencias" },
        body: {
          en: "The public repository presents the capstone architecture, validation and roadmap. It does not claim an operational integration with emergency services, and it records weaker performance in low-signal early-morning hours.",
          es: "El repositorio público presenta la arquitectura, la validación y el roadmap del proyecto. No afirma una integración operativa con servicios de emergencia y documenta un rendimiento inferior en horas de madrugada con poca señal.",
        },
      },
    ],
    takeaway: {
      en: "For critical routing, forecasting the future city state can matter as much as finding the shortest path through the current one.",
      es: "En rutas críticas, predecir el estado futuro de la ciudad puede importar tanto como encontrar el camino más corto en el estado actual.",
    },
    sourceUrl: "https://github.com/cofrian/aion-emergency-routing-valencia",
    sourceLabel: { en: "AION validation, architecture and roadmap", es: "Validación, arquitectura y roadmap de AION" },
    projectSlug: "aion-emergency-routing",
    visual: "aion",
  },
  {
    slug: "ranking-a-market-without-sales-labels",
    category: "Data Science",
    date: "2026-05-10",
    readTime: 5,
    title: {
      en: "How do you rank a market when no sales label exists?",
      es: "¿Cómo ordenas un mercado cuando no existe una etiqueta de ventas?",
    },
    excerpt: {
      en: "GENAQ turns an unlabeled market-entry question into an explicit, reviewable scoring system.",
      es: "GENAQ convierte una pregunta de entrada a mercado sin etiquetas en un sistema de scoring explícito y revisable.",
    },
    sections: [
      {
        title: { en: "No label means no conventional prediction target", es: "Sin etiqueta no hay objetivo predictivo convencional" },
        body: {
          en: "For a product without historical sales in the target market, training a sales predictor would pretend that the missing outcome already exists. The project instead ranks 35,891 Spanish census sections using public demographic and climate evidence.",
          es: "Para un producto sin ventas históricas en el mercado objetivo, entrenar un predictor de ventas fingiría que el resultado ausente ya existe. El proyecto ordena 35.891 secciones censales españolas mediante evidencia pública demográfica y climática.",
        },
      },
      {
        title: { en: "The score is an argument", es: "El score es un argumento" },
        body: {
          en: "When labels are unavailable, feature selection, normalization and weights encode the business hypothesis. Making them explicit matters more than wrapping the ranking in a more complex model, because each assumption can be challenged and revised.",
          es: "Cuando no hay etiquetas, la selección de variables, la normalización y los pesos codifican la hipótesis de negocio. Hacerlos explícitos importa más que envolver el ranking en un modelo más complejo, porque cada supuesto puede cuestionarse y revisarse.",
        },
      },
      {
        title: { en: "A ranking is a starting point for validation", es: "Un ranking inicia la validación" },
        body: {
          en: "The output narrows a national search into prioritized areas. It should guide field research and future measurement, not be presented as proven demand. The repository publishes the ranking together with its methodology and limitations.",
          es: "El resultado reduce una búsqueda nacional a áreas priorizadas. Debe guiar investigación de campo y futuras mediciones, no presentarse como demanda demostrada. El repositorio publica el ranking junto con su metodología y limitaciones.",
        },
      },
    ],
    takeaway: {
      en: "When the target is missing, make the decision logic inspectable and design the next experiment that can create evidence.",
      es: "Cuando falta el objetivo, hacer inspeccionable la lógica de decisión y diseñar el siguiente experimento que pueda generar evidencia.",
    },
    sourceUrl: "https://github.com/cofrian/genaq-market-selection",
    sourceLabel: { en: "GENAQ methodology and results", es: "Metodología y resultados de GENAQ" },
    projectSlug: "genaq-market-selection",
    visual: "market",
  },
  {
    slug: "event-logs-before-dashboards",
    category: "Data Engineering",
    date: "2026-04-22",
    readTime: 4,
    title: {
      en: "Event logs before dashboards",
      es: "Logs de eventos antes que dashboards",
    },
    excerpt: {
      en: "NOBIL separates the history of EV charging events from the latest operational snapshot.",
      es: "NOBIL separa el historial de eventos de carga eléctrica del último estado operativo.",
    },
    sections: [
      {
        title: { en: "A stream has two useful shapes", es: "Un stream tiene dos formas útiles" },
        body: {
          en: "A current snapshot answers what each charging point looks like now. An append-oriented event log answers how it got there. NOBIL keeps both: periodic snapshots for quick inspection and hourly JSONL files for history and replay.",
          es: "Un snapshot responde cómo está cada punto de carga ahora. Un log orientado a eventos responde cómo llegó hasta allí. NOBIL conserva ambos: snapshots periódicos para inspección rápida y ficheros JSONL horarios para historial y reproducción.",
        },
      },
      {
        title: { en: "Normalize before storing", es: "Normalizar antes de almacenar" },
        body: {
          en: "WebSocket messages are normalized before they become durable records. That boundary prevents consumers from depending directly on a volatile upstream format and gives downstream analysis a consistent event contract.",
          es: "Los mensajes WebSocket se normalizan antes de convertirse en registros duraderos. Esa frontera evita que los consumidores dependan directamente de un formato externo volátil y proporciona un contrato consistente para el análisis posterior.",
        },
      },
      {
        title: { en: "Observability begins in the pipeline", es: "La observabilidad empieza en el pipeline" },
        body: {
          en: "Lag and duplicate metrics are derived while the stream is processed. Versioned synchronization to GitHub and optional Google Cloud Storage then makes changes inspectable without turning a dashboard into the only source of truth.",
          es: "Las métricas de latencia y duplicados se calculan durante el procesamiento del flujo. La sincronización versionada con GitHub y, opcionalmente, Google Cloud Storage permite inspeccionar cambios sin convertir un dashboard en la única fuente de verdad.",
        },
      },
    ],
    takeaway: {
      en: "Preserve the event history, publish a convenient current view and measure the health of the path between both.",
      es: "Conservar el historial de eventos, publicar una vista actual cómoda y medir la salud del camino entre ambos.",
    },
    sourceUrl: "https://github.com/cofrian/nobil_data",
    sourceLabel: { en: "NOBIL ingestion and storage flow", es: "Flujo de ingesta y almacenamiento de NOBIL" },
    projectSlug: "nobil-data",
    visual: "pipeline",
  },
];
