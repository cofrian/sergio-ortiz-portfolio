import type { ProjectRecord } from "@/lib/schemas";

const accessedAt = "2026-07-16";

export const projects: ProjectRecord[] = [
  {
    slug: "gemf-exist-2026",
    repository: "exist2026-ordantis",
    title: "GEMF — EXIST 2026",
    subtitle: {
      en: "Multimodal AI for sexism characterization in memes",
      es: "IA multimodal para caracterizar el sexismo en memes",
    },
    summary: {
      en: "A probabilistic multimodal system that uses Gemini as a semantic mediator, combines text, image-derived interpretation, EEG and emotion features, and learns from annotator disagreement.",
      es: "Un sistema multimodal probabilístico que utiliza Gemini como mediador semántico, combina texto, interpretación visual, EEG y emociones, y aprende del desacuerdo entre anotadores.",
    },
    year: 2026,
    featured: true,
    kind: "research",
    visual: "gemf",
    categories: ["Multimodal AI", "LLMs", "Research", "NLP"],
    stack: ["Python", "Gemini", "XLM-RoBERTa", "Longformer", "PyTorch"],
    repositoryUrl: "https://github.com/cofrian/exist2026-ordantis",
    metrics: [
      {
        label: { en: "Official first places", es: "Primeros puestos oficiales" },
        value: "3× #1",
        evidenceRef: "gemf-readme",
      },
      {
        label: { en: "Task 2.1 soft rank", es: "Puesto Task 2.1 soft" },
        value: "1 / 144",
        evidenceRef: "gemf-readme",
      },
      {
        label: { en: "Validation AUC", es: "AUC de validación" },
        value: "0.741 → 0.880",
        evidenceRef: "gemf-readme",
      },
    ],
    sections: [
      {
        title: { en: "Problem", es: "Problema" },
        body: {
          en: "Memes are not separable image and text signals: meaning often lives in the relationship between both, while labels also reflect genuine annotator disagreement.",
          es: "Los memes no son señales separables de imagen y texto: el significado suele estar en su relación, y las etiquetas reflejan desacuerdo real entre anotadores.",
        },
        bullets: [],
      },
      {
        title: { en: "Approach", es: "Enfoque" },
        body: {
          en: "Gemini translates visual and pragmatic meaning into structured text instead of deciding the final class. Supervised encoders fuse that representation with OCR, EEG and Ekman emotion features.",
          es: "Gemini traduce el significado visual y pragmático a texto estructurado en lugar de decidir la clase final. Encoders supervisados fusionan esa representación con OCR, EEG y emociones de Ekman.",
        },
        bullets: [],
      },
      {
        title: { en: "Result", es: "Resultado" },
        body: {
          en: "The system achieved three official first places across EXIST 2026 Task 2 leaderboards, while the repository also documents the hard-label failure mode in Task 2.3.",
          es: "El sistema logró tres primeros puestos oficiales en los rankings de EXIST 2026 Task 2 y documenta también el fallo de etiquetas hard en Task 2.3.",
        },
        bullets: [],
      },
    ],
    limitations: {
      en: "Task 2.3 hard underperformed because category thresholds did not transfer reliably to the test set.",
      es: "Task 2.3 hard rindió peor porque los umbrales por categoría no se trasladaron de forma fiable al conjunto de prueba.",
    },
    sources: [
      {
        id: "gemf-readme",
        title: "GEMF repository",
        url: "https://github.com/cofrian/exist2026-ordantis",
        section: "README — official results and architecture",
        accessedAt,
      },
    ],
    updatedAt: "2026-07-16T09:58:31Z",
  },
  {
    slug: "urbanflow-valencia",
    repository: "urbanflow-valencia-mlops",
    title: "UrbanFlow Valencia",
    subtitle: {
      en: "Traffic prediction, facility siting and model monitoring",
      es: "Predicción de tráfico, localización de servicios y monitorización",
    },
    summary: {
      en: "An end-to-end urban decision-support system with 24 hourly CatBoost models, an independent integer-programming optimizer, public services and monitoring.",
      es: "Un sistema urbano de apoyo a decisiones con 24 modelos CatBoost por hora, un optimizador independiente de programación entera, servicios públicos y monitorización.",
    },
    year: 2026,
    featured: true,
    kind: "system",
    visual: "urbanflow",
    categories: ["Smart Cities", "MLOps", "Optimisation", "Geospatial"],
    stack: ["Python", "CatBoost", "PuLP", "FastAPI", "Next.js", "Docker"],
    repositoryUrl: "https://github.com/cofrian/urbanflow-valencia-mlops",
    demoUrl: "https://edm-project.vercel.app",
    metrics: [
      {
        label: { en: "Hourly models", es: "Modelos horarios" },
        value: "24",
        evidenceRef: "urbanflow-readme",
      },
      {
        label: { en: "Traffic zones", es: "Zonas de tráfico" },
        value: "1,158",
        evidenceRef: "urbanflow-readme",
      },
      {
        label: { en: "Test MAE", es: "MAE de test" },
        value: "44.4 veh/h",
        evidenceRef: "urbanflow-readme",
      },
    ],
    sections: [
      {
        title: { en: "Problem", es: "Problema" },
        body: {
          en: "City teams need both reliable hourly traffic forecasts and a defensible way to allocate facilities under budget constraints.",
          es: "Los equipos urbanos necesitan predicciones horarias fiables y una forma defendible de asignar servicios bajo restricciones presupuestarias.",
        },
        bullets: [],
      },
      {
        title: { en: "Approach", es: "Enfoque" },
        body: {
          en: "The project separates prediction from decision: hourly CatBoost models forecast traffic, while a PuLP/CBC optimizer selects facility locations independently.",
          es: "El proyecto separa predicción y decisión: modelos CatBoost horarios predicen tráfico y un optimizador PuLP/CBC selecciona ubicaciones de forma independiente.",
        },
        bullets: [],
      },
      {
        title: { en: "Deployment", es: "Despliegue" },
        body: {
          en: "FastAPI, Next.js, Docker and GitHub Actions publish the system, while monitoring computes MAE by hour and flags systematic errors by zone.",
          es: "FastAPI, Next.js, Docker y GitHub Actions publican el sistema, mientras la monitorización calcula MAE por hora y detecta errores sistemáticos por zona.",
        },
        bullets: [],
      },
    ],
    limitations: {
      en: "The model is trained on one month of traffic data; seasonal generalization requires additional validation.",
      es: "El modelo se entrena con un mes de tráfico; la generalización estacional requiere validación adicional.",
    },
    sources: [
      {
        id: "urbanflow-readme",
        title: "UrbanFlow Valencia repository",
        url: "https://github.com/cofrian/urbanflow-valencia-mlops",
        section: "README — model, evaluation and deployment",
        accessedAt,
      },
    ],
    updatedAt: "2026-07-16T10:47:15Z",
  },
  {
    slug: "upv-earth",
    repository: "upv-earth-planetary-boundaries",
    title: "UPV-EARTH",
    subtitle: {
      en: "Mapping university research to the Planetary Boundaries",
      es: "Mapeo de investigación universitaria a los Límites Planetarios",
    },
    summary: {
      en: "A reproducible research-intelligence platform that classifies 31,634 abstracts against nine Planetary Boundaries and keeps evidence and abstention visible.",
      es: "Una plataforma reproducible de inteligencia científica que clasifica 31.634 resúmenes frente a nueve Límites Planetarios y mantiene visibles evidencia y abstención.",
    },
    year: 2026,
    featured: true,
    kind: "research",
    visual: "earth",
    categories: ["LLMs", "NLP", "Sustainability", "Research"],
    stack: ["Python", "Qwen 2.5", "TF-IDF", "SPECTER2", "FastAPI", "Docker"],
    repositoryUrl: "https://github.com/cofrian/upv-earth-planetary-boundaries",
    metrics: [
      {
        label: { en: "Scientific abstracts", es: "Resúmenes científicos" },
        value: "31,634",
        evidenceRef: "earth-readme",
      },
      {
        label: { en: "Planetary Boundaries", es: "Límites Planetarios" },
        value: "9",
        evidenceRef: "earth-readme",
      },
      {
        label: { en: "Prompt v4 Top-1", es: "Top-1 del prompt v4" },
        value: "72.1%",
        evidenceRef: "earth-readme",
      },
    ],
    sections: [
      {
        title: { en: "Problem", es: "Problema" },
        body: {
          en: "Sustainability language does not necessarily mean a paper studies an Earth-system process, and relevant work can avoid sustainability vocabulary entirely.",
          es: "El lenguaje de sostenibilidad no implica que un artículo estudie un proceso terrestre, y trabajos relevantes pueden evitar por completo ese vocabulario.",
        },
        bullets: [],
      },
      {
        title: { en: "Evaluation", es: "Evaluación" },
        body: {
          en: "The project compares TF-IDF, scientific embeddings and local LLMs, explicitly measuring positivity bias and the ability to reject irrelevant documents.",
          es: "El proyecto compara TF-IDF, embeddings científicos y LLM locales, midiendo explícitamente el sesgo positivo y la capacidad de rechazar documentos irrelevantes.",
        },
        bullets: [],
      },
      {
        title: { en: "Platform", es: "Plataforma" },
        body: {
          en: "A containerized FastAPI and Next.js platform exposes the corpus, evidence and review workflow, with an optional local RAG assistant.",
          es: "Una plataforma contenedorizada con FastAPI y Next.js expone corpus, evidencia y revisión, con un asistente RAG local opcional.",
        },
        bullets: [],
      },
    ],
    limitations: {
      en: "The auditable agent cascade trades a small amount of Top-1 accuracy for reviewable traces.",
      es: "La cascada auditable de agentes intercambia una pequeña parte de precisión Top-1 por trazas revisables.",
    },
    sources: [
      {
        id: "earth-readme",
        title: "UPV-EARTH repository",
        url: "https://github.com/cofrian/upv-earth-planetary-boundaries",
        section: "README — corpus, evaluation and platform",
        accessedAt,
      },
    ],
    updatedAt: "2026-07-16T17:17:30Z",
  },
  {
    slug: "aion-emergency-routing",
    repository: "aion-emergency-routing-valencia",
    title: "AION",
    subtitle: {
      en: "Predictive traffic intelligence for emergency mobility",
      es: "Inteligencia predictiva de tráfico para movilidad de emergencias",
    },
    summary: {
      en: "A predictive system that models traffic deviations and converts local news, events and weather into structured signals for future emergency-routing decisions.",
      es: "Un sistema predictivo que modela desviaciones del tráfico y convierte noticias, eventos y meteorología en señales estructuradas para futuras decisiones de rutas de emergencia.",
    },
    year: 2025,
    featured: true,
    kind: "system",
    visual: "aion",
    categories: ["Smart Cities", "Predictive ML", "LLMs", "Data Engineering"],
    stack: ["Python", "CatBoost", "LLaMA 3", "Ollama", "MongoDB", "Streamlit"],
    repositoryUrl: "https://github.com/cofrian/aion-emergency-routing-valencia",
    metrics: [
      {
        label: { en: "Test R²", es: "R² de test" },
        value: "0.971",
        evidenceRef: "aion-readme",
      },
      {
        label: { en: "Test MAE", es: "MAE de test" },
        value: "44.5 veh/h",
        evidenceRef: "aion-readme",
      },
      {
        label: { en: "Test sMAPE", es: "sMAPE de test" },
        value: "17.4%",
        evidenceRef: "aion-readme",
      },
    ],
    sections: [
      {
        title: { en: "Problem", es: "Problema" },
        body: {
          en: "Reactive navigation cannot anticipate a concert ending, announced roadworks or future city events that will change emergency accessibility.",
          es: "La navegación reactiva no puede anticipar el final de un concierto, obras anunciadas o eventos futuros que cambiarán la accesibilidad de emergencias.",
        },
        bullets: [],
      },
      {
        title: { en: "Approach", es: "Enfoque" },
        body: {
          en: "A robust baseline, PCA embeddings, CatBoost and sigmoid shrink predict deviations from normality, while an LLM pipeline structures external events.",
          es: "Un baseline robusto, embeddings PCA, CatBoost y sigmoid shrink predicen desviaciones de la normalidad, mientras un pipeline LLM estructura eventos externos.",
        },
        bullets: [],
      },
      {
        title: { en: "Scope", es: "Alcance" },
        body: {
          en: "The public repository documents the capstone system and its roadmap; it does not present an operational emergency-service deployment.",
          es: "El repositorio público documenta el sistema y su roadmap; no presenta un despliegue operativo en servicios de emergencia.",
        },
        bullets: [],
      },
    ],
    limitations: {
      en: "Performance is weaker during low-signal early-morning hours, and API/cloud deployment remains on the roadmap.",
      es: "El rendimiento es menor en horas de madrugada con poca señal, y el despliegue API/cloud permanece en el roadmap.",
    },
    sources: [
      {
        id: "aion-readme",
        title: "AION repository",
        url: "https://github.com/cofrian/aion-emergency-routing-valencia",
        section: "README — validation, architecture and roadmap",
        accessedAt,
      },
    ],
    updatedAt: "2026-07-16T16:39:22Z",
  },
  {
    slug: "outfit-ai-recommender",
    repository: "outfit-ai-recommender",
    title: "Outfit AI Recommender",
    subtitle: {
      en: "Multimodal fashion discovery from text, garments and outfits",
      es: "Descubrimiento multimodal de moda desde texto, prendas y conjuntos",
    },
    summary: {
      en: "A documented hackathon prototype combining segmentation, vision-language features and vector search for fashion discovery.",
      es: "Un prototipo documentado de hackathon que combina segmentación, características visión-lenguaje y búsqueda vectorial para descubrir moda.",
    },
    year: 2025,
    featured: false,
    kind: "experiment",
    visual: "fashion",
    categories: ["Multimodal AI", "Computer Vision", "Vector Search"],
    stack: ["FastAPI", "FAISS", "BLIP", "SegFormer"],
    repositoryUrl: "https://github.com/cofrian/outfit-ai-recommender",
    metrics: [
      {
        label: { en: "Challenge result", es: "Resultado del reto" },
        value: "1st place",
        evidenceRef: "outfit-readme",
      },
    ],
    sections: [
      {
        title: { en: "Case study", es: "Caso de estudio" },
        body: {
          en: "The repository documents the winning Retail & Fashion challenge prototype; it is not presented as a complete public code release.",
          es: "El repositorio documenta el prototipo ganador del reto Retail & Fashion; no se presenta como una publicación completa de código.",
        },
        bullets: [],
      },
    ],
    sources: [
      {
        id: "outfit-readme",
        title: "Outfit AI Recommender repository",
        url: "https://github.com/cofrian/outfit-ai-recommender",
        section: "README — challenge and architecture",
        accessedAt,
      },
    ],
    updatedAt: "2026-07-16T16:47:26Z",
  },
  {
    slug: "genaq-market-selection",
    repository: "genaq-market-selection",
    title: "GENAQ Market Selection",
    subtitle: {
      en: "Market ranking without historical sales labels",
      es: "Ranking de mercado sin etiquetas históricas de ventas",
    },
    summary: {
      en: "A first-principles scoring system that ranks Spanish census sections for atmospheric water generator market entry.",
      es: "Un sistema de scoring desde primeros principios que ordena secciones censales españolas para introducir generadores atmosféricos de agua.",
    },
    year: 2024,
    featured: false,
    kind: "analysis",
    visual: "market",
    categories: ["Market Analysis", "Geospatial", "Open Data"],
    stack: ["Python", "Pandas", "Scikit-learn", "INE", "AEMET"],
    repositoryUrl: "https://github.com/cofrian/genaq-market-selection",
    metrics: [
      {
        label: { en: "Census sections ranked", es: "Secciones censales ordenadas" },
        value: "35,891",
        evidenceRef: "genaq-readme",
      },
    ],
    sections: [
      {
        title: { en: "Method", es: "Método" },
        body: {
          en: "Because no sales label exists, the repository argues the target from first principles and publishes both the complete ranking and its limitations.",
          es: "Como no existe una etiqueta de ventas, el repositorio argumenta el objetivo desde primeros principios y publica el ranking completo y sus limitaciones.",
        },
        bullets: [],
      },
    ],
    sources: [
      {
        id: "genaq-readme",
        title: "GENAQ Market Selection repository",
        url: "https://github.com/cofrian/genaq-market-selection",
        section: "README — methodology and results",
        accessedAt,
      },
    ],
    updatedAt: "2026-07-16T17:08:38Z",
  },
  {
    slug: "exambox",
    repository: "Exam_Box",
    title: "ExamBox",
    subtitle: {
      en: "Reproducible programming examination environments",
      es: "Entornos reproducibles para exámenes de programación",
    },
    summary: {
      en: "A self-hosted FastAPI and JupyterLab platform that makes a pinned Docker environment part of a practical exam.",
      es: "Una plataforma autoalojada con FastAPI y JupyterLab que convierte un entorno Docker fijado en parte del examen práctico.",
    },
    year: 2025,
    featured: false,
    kind: "system",
    visual: "exam",
    categories: ["Infrastructure", "Education", "DevOps"],
    stack: ["Python", "FastAPI", "Docker Compose", "JupyterLab", "SQLite"],
    repositoryUrl: "https://github.com/cofrian/Exam_Box",
    metrics: [
      {
        label: { en: "Academic grade", es: "Calificación académica" },
        value: "10 / 10",
        evidenceRef: "exam-readme",
      },
    ],
    sections: [
      {
        title: { en: "System", es: "Sistema" },
        body: {
          en: "The platform centralizes practical exams on a LAN with timed sessions, progressive question release and reproducible dependencies.",
          es: "La plataforma centraliza exámenes prácticos en una LAN con sesiones temporizadas, desbloqueo progresivo y dependencias reproducibles.",
        },
        bullets: [],
      },
    ],
    limitations: {
      en: "The shipped setup uses one shared JupyterLab instance and no authentication; the README limits it to trusted, proctored LAN use.",
      es: "La configuración actual usa una instancia compartida de JupyterLab y no tiene autenticación; el README la limita a una LAN vigilada y de confianza.",
    },
    sources: [
      {
        id: "exam-readme",
        title: "ExamBox repository",
        url: "https://github.com/cofrian/Exam_Box",
        section: "README — architecture, limits and academic context",
        accessedAt,
      },
    ],
    updatedAt: "2026-07-16T10:29:54Z",
  },
  {
    slug: "nobil-data",
    repository: "nobil_data",
    title: "NOBIL Data",
    subtitle: {
      en: "Real-time EV charging event infrastructure",
      es: "Infraestructura de eventos de carga eléctrica en tiempo real",
    },
    summary: {
      en: "A WebSocket ingestion pipeline that normalizes charging events, rotates JSONL logs, creates snapshots and publishes versioned data.",
      es: "Un pipeline WebSocket que normaliza eventos de carga, rota logs JSONL, crea snapshots y publica datos versionados.",
    },
    year: 2025,
    featured: false,
    kind: "system",
    visual: "pipeline",
    categories: ["Data Engineering", "Real-time Data", "Cloud"],
    stack: ["Python", "WebSockets", "JSONL", "GitHub Actions", "GCS"],
    repositoryUrl: "https://github.com/cofrian/nobil_data",
    metrics: [],
    sections: [
      {
        title: { en: "Pipeline", es: "Pipeline" },
        body: {
          en: "Incoming charging events are normalized into hourly event logs and periodic snapshots, with lag and duplicate metrics derived from the stream.",
          es: "Los eventos de carga se normalizan en logs horarios y snapshots periódicos, calculando latencia y duplicados a partir del flujo.",
        },
        bullets: [],
      },
    ],
    sources: [
      {
        id: "nobil-readme",
        title: "NOBIL Data repository",
        url: "https://github.com/cofrian/nobil_data",
        section: "README — ingestion and storage flow",
        accessedAt,
      },
    ],
    updatedAt: "2026-04-07T19:32:51Z",
  },
  {
    slug: "nba-scouting-analytics",
    repository: "nba-scouting-analytics",
    title: "NBA Scouting Analytics",
    subtitle: {
      en: "Multivariate player roles and All-Star detection",
      es: "Roles multivariantes de jugadores y detección de All-Stars",
    },
    summary: {
      en: "A transparent R analysis that uses PCA, clustering and PLS-DA to study player roles, replacements and All-Star profiles.",
      es: "Un análisis transparente en R que usa PCA, clustering y PLS-DA para estudiar roles, sustitutos y perfiles All-Star.",
    },
    year: 2024,
    featured: false,
    kind: "analysis",
    visual: "sports",
    categories: ["Statistics", "Machine Learning", "Sports Analytics"],
    stack: ["R", "R Markdown", "PCA", "K-means", "PLS-DA"],
    repositoryUrl: "https://github.com/cofrian/nba-scouting-analytics",
    metrics: [
      {
        label: { en: "Players analysed", es: "Jugadores analizados" },
        value: "508",
        evidenceRef: "nba-readme",
      },
      {
        label: { en: "Test sensitivity", es: "Sensibilidad de test" },
        value: "100%",
        evidenceRef: "nba-readme",
      },
    ],
    sections: [
      {
        title: { en: "Analysis", es: "Análisis" },
        body: {
          en: "Minute-adjusted features reduce volume bias before PCA, role clustering and a three-component PLS-DA classifier.",
          es: "Variables ajustadas por minutos reducen el sesgo de volumen antes del PCA, el clustering de roles y un clasificador PLS-DA de tres componentes.",
        },
        bullets: [],
      },
    ],
    sources: [
      {
        id: "nba-readme",
        title: "NBA Scouting Analytics repository",
        url: "https://github.com/cofrian/nba-scouting-analytics",
        section: "README — methodology and evaluation",
        accessedAt,
      },
    ],
    updatedAt: "2026-07-16T10:46:43Z",
  },
  {
    slug: "covid-wealth-mortality",
    repository: "covid19-wealth-mortality",
    title: "COVID-19: Wealth & Mortality",
    subtitle: {
      en: "An interactive, hypothesis-generating country panel",
      es: "Un panel interactivo de países para generar hipótesis",
    },
    summary: {
      en: "Six interactive visualizations investigate the relationship between national wealth, testing and recorded COVID-19 mortality in 2020.",
      es: "Seis visualizaciones interactivas investigan la relación entre riqueza, testeo y mortalidad registrada por COVID-19 en 2020.",
    },
    year: 2024,
    featured: false,
    kind: "analysis",
    visual: "covid",
    categories: ["Data Visualisation", "Public Health", "Statistics"],
    stack: ["Python", "Shiny", "Plotly", "Pandas"],
    repositoryUrl: "https://github.com/cofrian/covid19-wealth-mortality",
    metrics: [
      {
        label: { en: "Countries", es: "Países" },
        value: "189",
        evidenceRef: "covid-readme",
      },
      {
        label: { en: "Daily observations", es: "Observaciones diarias" },
        value: "366 days",
        evidenceRef: "covid-readme",
      },
    ],
    sections: [
      {
        title: { en: "Question", es: "Pregunta" },
        body: {
          en: "The dashboard asks whether wealth protected countries, while keeping detection bias and the non-causal nature of the evidence explicit.",
          es: "El dashboard pregunta si la riqueza protegió a los países, manteniendo explícitos el sesgo de detección y la naturaleza no causal de la evidencia.",
        },
        bullets: [],
      },
    ],
    sources: [
      {
        id: "covid-readme",
        title: "COVID-19 Wealth & Mortality repository",
        url: "https://github.com/cofrian/covid19-wealth-mortality",
        section: "README — dataset and analytical scope",
        accessedAt,
      },
    ],
    updatedAt: "2026-07-16T11:19:17Z",
  },
  {
    slug: "fitplanner",
    repository: "Proyecto_fitplanner",
    title: "FitPlanner",
    subtitle: {
      en: "A fitness planning and product-matching application",
      es: "Una aplicación de planificación deportiva y matching de productos",
    },
    summary: {
      en: "A Streamlit project that combines scraped routines, nutrition APIs and fuzzy product matching from one user form.",
      es: "Un proyecto Streamlit que combina rutinas extraídas, APIs de nutrición y matching difuso de productos desde un formulario.",
    },
    year: 2024,
    featured: false,
    kind: "experiment",
    visual: "fitness",
    categories: ["Recommendation", "Web Scraping", "APIs"],
    stack: ["Python", "Streamlit", "BeautifulSoup", "REST APIs"],
    repositoryUrl: "https://github.com/cofrian/Proyecto_fitplanner",
    metrics: [
      {
        label: { en: "Workout routines", es: "Rutinas deportivas" },
        value: "112",
        evidenceRef: "fit-readme",
      },
      {
        label: { en: "Products matched", es: "Productos comparados" },
        value: "5,023",
        evidenceRef: "fit-readme",
      },
    ],
    sections: [
      {
        title: { en: "Integration", es: "Integración" },
        body: {
          en: "The app integrates scraped training plans, calorie-based menus and product catalogue matching into a single early-stage product experience.",
          es: "La app integra planes de entrenamiento extraídos, menús por calorías y matching de catálogo en una experiencia de producto temprana.",
        },
        bullets: [],
      },
    ],
    sources: [
      {
        id: "fit-readme",
        title: "FitPlanner repository",
        url: "https://github.com/cofrian/Proyecto_fitplanner",
        section: "README — data sources and features",
        accessedAt,
      },
    ],
    updatedAt: "2026-07-16T11:18:18Z",
  },
];
