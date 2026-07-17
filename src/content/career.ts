import { careerRecordSchema, type CareerRecord } from "@/lib/schemas";

const linkedInProfile = "https://www.linkedin.com/in/sergioortizmontesinos/";
const linkedInExperience = `${linkedInProfile}details/experience/`;
const linkedInVolunteering = `${linkedInProfile}details/volunteering-experiences/`;
const linkedInEducation = `${linkedInProfile}details/education/`;
const linkedInCertifications = `${linkedInProfile}details/certifications/`;

const rawCareerRecords: CareerRecord[] = [
  {
    id: "sigma-coordinator-vice-president",
    kind: "leadership",
    organisation: "Sigma Data Club UPV",
    role: {
      en: "Coordinator & Vice President",
      es: "Coordinador y Vicepresidente",
    },
    period: { en: "Sep 2025 — Present", es: "Sep 2025 — Actualidad" },
    location: { en: "Valencia, Spain", es: "Valencia, España" },
    summary: {
      en: "Strategic and operational leadership of a university data and AI community with more than 100 active students.",
      es: "Liderazgo estratégico y operativo de una comunidad universitaria de datos e IA con más de 100 estudiantes activos.",
    },
    bullets: [
      {
        en: "Coordinates departments and the board, aligning initiatives and responsibilities.",
        es: "Coordina los departamentos y la junta directiva, alineando iniciativas y responsabilidades.",
      },
      {
        en: "Plans workshops, applied projects and training activities in Data Science and AI.",
        es: "Planifica workshops, proyectos aplicados y actividades formativas en Data Science e IA.",
      },
      {
        en: "Manages administration and budget, represents the club at the university and develops company collaborations.",
        es: "Gestiona administración y presupuesto, representa al club ante la universidad e impulsa colaboraciones con empresas.",
      },
    ],
    capabilities: ["Leadership", "Team Coordination", "Programme Management", "Partnerships", "Community"],
    relatedProjects: [],
    source: {
      id: "linkedin-sigma-leadership",
      title: "LinkedIn — Sigma Data Club leadership",
      url: linkedInExperience,
      section: "Experience · Coordinator & Vice President",
      accessedAt: "2026-07-17",
    },
    order: 1,
  },
  {
    id: "artecoin-automation",
    kind: "experience",
    organisation: "ARTECOIN",
    role: {
      en: "Process Automation Engineer",
      es: "Ingeniero de automatización de procesos",
    },
    period: { en: "Jul 2025 — Sep 2025", es: "Jul 2025 — Sep 2025" },
    location: { en: "Albacete, Spain", es: "Albacete, España" },
    summary: {
      en: "Identified and automated internal processes with Python to reduce manual work and improve operational reliability.",
      es: "Identificación y automatización de procesos internos con Python para reducir carga manual y mejorar la fiabilidad operativa.",
    },
    bullets: [
      {
        en: "Built reusable modules and data-transformation flows for reporting and operational tasks.",
        es: "Desarrolló módulos reutilizables y flujos de transformación de datos para reporting y tareas operativas.",
      },
      {
        en: "Applied version control, technical documentation and maintainable development practices.",
        es: "Aplicó control de versiones, documentación técnica y prácticas de desarrollo mantenibles.",
      },
    ],
    capabilities: ["Python", "Automation", "Data Engineering", "Documentation", "Process Improvement"],
    relatedProjects: [],
    source: {
      id: "linkedin-artecoin-experience",
      title: "LinkedIn — ARTECOIN experience",
      url: linkedInExperience,
      section: "Experience · Process Automation Engineer",
      accessedAt: "2026-07-17",
    },
    order: 2,
  },
  {
    id: "ag-engineers-technical-support",
    kind: "experience",
    organisation: "AG INGENIEROS",
    role: {
      en: "Technical Draftsperson / Engineering Project Support",
      es: "Delineante técnico / apoyo a proyectos de ingeniería",
    },
    period: { en: "Jun 2022 — Sep 2023", es: "Jun 2022 — Sep 2023" },
    location: { en: "Albacete, Spain", es: "Albacete, España" },
    summary: {
      en: "Early professional experience supporting energy-efficiency, photovoltaic and building-services engineering projects during the summers of 2022 and 2023.",
      es: "Primera experiencia profesional apoyando proyectos de eficiencia energética, fotovoltaica e instalaciones durante los veranos de 2022 y 2023.",
    },
    bullets: [
      {
        en: "Produced technical drawings in AutoCAD and worked with CYPE tools and Office 365 documentation.",
        es: "Elaboró planos técnicos en AutoCAD y trabajó con herramientas de CYPE y documentación en Office 365.",
      },
      {
        en: "Supported calculations, energy certificates, legalisation work and grant documentation.",
        es: "Apoyó cálculos, certificados energéticos, legalizaciones y documentación de subvenciones.",
      },
    ],
    capabilities: ["Engineering", "Technical Documentation", "AutoCAD", "Energy Systems", "Project Support"],
    relatedProjects: [],
    source: {
      id: "linkedin-ag-engineers-experience",
      title: "LinkedIn — AG INGENIEROS experience",
      url: linkedInExperience,
      section: "Experience · Technical project support",
      accessedAt: "2026-07-17",
    },
    order: 3,
  },
  {
    id: "upv-investment-club",
    kind: "community",
    organisation: "UPV Investment Club",
    role: {
      en: "Member · Investments & Software Departments",
      es: "Miembro · Departamentos de Inversión y Software",
    },
    period: { en: "Jan 2025 — Present", es: "Ene 2025 — Actualidad" },
    summary: {
      en: "Combines business analysis and valuation with the development of internal software initiatives for the club.",
      es: "Combina análisis empresarial y valoración con el desarrollo de iniciativas internas de software para el club.",
    },
    bullets: [
      {
        en: "Co-authored and presented an investment thesis on DIA using business analysis, financial statements, ratios and a DCF framework.",
        es: "Coautor y presentador de una tesis de inversión sobre DIA con análisis de negocio, cuentas, ratios y valoración DCF.",
      },
      {
        en: "Contributed to internal tools while taking part in training, talks and investment-focused networking.",
        es: "Contribuyó a herramientas internas y participó en formación, charlas y networking sobre inversión.",
      },
    ],
    capabilities: ["Investment Analysis", "Valuation", "Software", "Strategic Thinking", "Teamwork"],
    relatedProjects: [],
    source: {
      id: "linkedin-investment-club",
      title: "LinkedIn — UPV Investment Club",
      url: linkedInVolunteering,
      section: "Volunteering · Investments and Software Departments",
      accessedAt: "2026-07-17",
    },
    order: 4,
  },
  {
    id: "etsinf-peer-tutor",
    kind: "community",
    organisation: "ETSINF UPV",
    role: { en: "Peer Tutor · PIAE+", es: "Tutor de estudiantes · PIAE+" },
    period: { en: "Jul 2024 — Present", es: "Jul 2024 — Actualidad" },
    summary: {
      en: "Supports first-year students through their academic, personal and social transition into university.",
      es: "Acompaña a estudiantes de primer curso en su transición académica, personal y social a la universidad.",
    },
    bullets: [
      {
        en: "Provides guidance on study strategies, organisation and effective use of UPV resources.",
        es: "Ofrece orientación sobre estrategias de estudio, organización y uso eficaz de los recursos de la UPV.",
      },
    ],
    capabilities: ["Mentoring", "Communication", "Education", "Community", "Student Support"],
    relatedProjects: [],
    source: {
      id: "linkedin-peer-tutor",
      title: "LinkedIn — ETSINF peer tutoring",
      url: linkedInVolunteering,
      section: "Volunteering · Peer Tutor",
      accessedAt: "2026-07-17",
    },
    order: 5,
  },
  {
    id: "samsung-ai-programme",
    kind: "innovation",
    organisation: "Samsung Innovation Campus",
    role: {
      en: "Artificial Intelligence Extension Programme · 467 hours",
      es: "Diploma de Extensión Universitaria en Inteligencia Artificial · 467 horas",
    },
    period: { en: "Issued Nov 2025", es: "Expedido en nov 2025" },
    summary: {
      en: "Applied AI specialisation covering machine learning, deep learning, data engineering and real-world solution development, including AION.",
      es: "Especialización aplicada en IA, machine learning, deep learning, ingeniería de datos y desarrollo de soluciones reales, incluido AION.",
    },
    bullets: [],
    capabilities: ["Artificial Intelligence", "Deep Learning", "Data Engineering", "Innovation"],
    relatedProjects: ["aion-emergency-routing"],
    source: {
      id: "linkedin-samsung-certification",
      title: "LinkedIn — Samsung Innovation Campus diploma",
      url: linkedInCertifications,
      section: "Licences & certifications · 467-hour AI programme",
      accessedAt: "2026-07-17",
    },
    order: 6,
  },
  {
    id: "akademia-future-builders",
    kind: "innovation",
    organisation: "Fundación Innovación Bankinter",
    role: {
      en: "Akademia Future Builders 2024–25",
      es: "Akademia Future Builders 2024–25",
    },
    period: { en: "Issued Feb 2025", es: "Expedido en feb 2025" },
    summary: {
      en: "Innovation, emerging trends and multidisciplinary problem-solving programme, completed with the GENAQ market-selection challenge.",
      es: "Programa de innovación, tendencias emergentes y resolución multidisciplinar de problemas, finalizado con el reto de selección de mercado de GENAQ.",
    },
    bullets: [],
    capabilities: ["Innovation", "Entrepreneurship", "Market Intelligence", "Teamwork"],
    relatedProjects: ["genaq-market-selection"],
    source: {
      id: "linkedin-akademia-certification",
      title: "LinkedIn — Akademia Future Builders",
      url: linkedInCertifications,
      section: "Licences & certifications · Akademia 2024–25",
      accessedAt: "2026-07-17",
    },
    order: 7,
  },
  {
    id: "accenture-genai-maverick",
    kind: "innovation",
    organisation: "Accenture Spain",
    role: {
      en: "GenAI Maverick · Retail & Fashion Challenge Winner",
      es: "GenAI Maverick · Ganador del reto Retail & Fashion",
    },
    period: { en: "2025", es: "2025" },
    summary: {
      en: "Built a multimodal outfit-recommendation prototype combining text and image retrieval for a product challenge.",
      es: "Desarrolló un prototipo multimodal de recomendación de conjuntos combinando recuperación por texto e imagen.",
    },
    bullets: [],
    capabilities: ["Generative AI", "Multimodal AI", "Product Innovation", "Rapid Prototyping"],
    relatedProjects: ["outfit-ai-recommender"],
    source: {
      id: "github-outfit-ai-recognition",
      title: "GitHub — Outfit AI Recommender",
      url: "https://github.com/cofrian/outfit-ai-recommender",
      section: "Repository description and portfolio case study",
      accessedAt: "2026-07-17",
    },
    order: 8,
  },
  {
    id: "upv-data-science",
    kind: "education",
    organisation: "Universitat Politècnica de València (UPV)",
    role: { en: "BSc in Data Science", es: "Grado en Ciencia de Datos" },
    period: { en: "2023 — 2028", es: "2023 — 2028" },
    summary: {
      en: "Data Science degree combining statistics, machine learning, data engineering and applied projects.",
      es: "Grado en Ciencia de Datos que combina estadística, machine learning, ingeniería de datos y proyectos aplicados.",
    },
    bullets: [],
    capabilities: ["Data Science", "Machine Learning", "Statistics", "Data Engineering"],
    relatedProjects: [],
    source: {
      id: "linkedin-upv-education",
      title: "LinkedIn — UPV education",
      url: linkedInEducation,
      section: "Education · Data Science",
      accessedAt: "2026-07-17",
    },
    order: 9,
  },
];

export const careerRecords = careerRecordSchema.array().parse(rawCareerRecords);

export const professionalExperience = careerRecords.filter((record) => record.kind === "experience" || record.kind === "leadership");
export const leadershipAndCommunity = careerRecords.filter((record) => record.kind === "leadership" || record.kind === "community");
export const communityRecords = careerRecords.filter((record) => record.kind === "community");
export const innovationRecords = careerRecords.filter((record) => record.kind === "innovation");
export const educationRecords = careerRecords.filter((record) => record.kind === "education");

export const careerMetrics = [
  {
    value: "100+",
    label: { en: "active students coordinated", es: "estudiantes activos coordinados" },
    evidenceRef: "linkedin-sigma-leadership",
  },
  {
    value: "467h",
    label: { en: "applied AI programme", es: "programa aplicado de IA" },
    evidenceRef: "linkedin-samsung-certification",
  },
  {
    value: "3",
    label: { en: "community and mentoring roles", es: "roles de comunidad y mentoría" },
    evidenceRef: "linkedin-investment-club",
  },
] as const;
