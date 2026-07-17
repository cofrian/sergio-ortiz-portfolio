import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FeaturedProject } from "@/components/projects/FeaturedProject";
import { ProjectVisual } from "@/components/projects/ProjectVisual";
import { PortfolioAsk } from "@/components/chat/PortfolioAsk";
import { notes } from "@/content/notes";
import { linkedinPosts } from "@/content/linkedin";
import { profile, verifiedMilestones } from "@/content/profile";
import { projects } from "@/content/projects";
import { hasLocale, localePath } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";
import { JsonLd } from "@/components/seo/JsonLd";
import { personJsonLd } from "@/lib/seo/structured-data";
import { careerMetrics, leadershipAndCommunity } from "@/content/career";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: candidate } = await params;
  if (!hasLocale(candidate)) notFound();
  const locale = candidate;
  const featured = projects.filter((project) => project.featured).slice(0, 4);
  const latest = [...projects].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5);
  const capabilities = ["Machine Learning", "LLMs", "MLOps", "Optimisation", "Data Engineering", "Research", "Smart Cities", "Automation", "Multimodal AI", "Data Visualisation"];

  return (
    <div className="site-shell">
      <JsonLd data={personJsonLd} />
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Sergio Ortiz · Data Science · Valencia</p>
          <h1 className="display">{locale === "es" ? "Construyo sistemas inteligentes con datos del mundo real." : "I build intelligent systems from real-world data."}</h1>
          <p>{locale === "es" ? "Diseño y desarrollo productos de datos, modelos de machine learning y sistemas reproducibles para problemas reales." : "I design and ship data products, machine-learning models and reproducible systems for meaningful real-world problems."}</p>
          <div className="hero-actions">
            <Link className="button button-primary" href={localePath(locale, "/work")}>{locale === "es" ? "Ver proyectos" : "View selected work"}<ArrowRight aria-hidden="true" size={16} /></Link>
            <Link className="button button-secondary" href="#ask-portfolio"><Search aria-hidden="true" size={16} />{locale === "es" ? "Preguntar al portfolio" : "Ask my portfolio"}</Link>
          </div>
        </div>
        <div aria-label={locale === "es" ? "Collage de proyectos destacados" : "Featured project collage"} className="hero-collage">
          <ProjectVisual title="UrbanFlow Valencia" variant="urbanflow" />
          <ProjectVisual title="GEMF" variant="gemf" />
          <ProjectVisual title="UPV-EARTH" variant="earth" />
        </div>
      </section>

      <section aria-label={locale === "es" ? "Reconocimientos verificados" : "Verified recognition"} className="recognition-strip">
        {verifiedMilestones.map((item) => <a className="recognition-item" href={item.href} key={item.title} rel="noreferrer" target="_blank"><strong>{item.title}</strong><span>{item.year} · {item.type[locale]}</span></a>)}
      </section>

      <section className="section-block" id="ask-portfolio">
        <div className="home-ask">
          <div className="home-ask-copy">
            <p className="eyebrow">01 · {locale === "es" ? "Asistente del portfolio" : "Portfolio assistant"}</p>
            <h2 className="display">{locale === "es" ? "Pregunta por mi trabajo. Recibe una respuesta con fuentes." : "Ask about my work. Get a sourced answer."}</h2>
            <p>{locale === "es" ? "Explora proyectos, experiencia e investigación sin buscar por toda la web. El asistente responde solo con contenido público verificado." : "Explore projects, experience and research without searching the whole site. The assistant answers only from verified public content."}</p>
            <ul className="home-ask-proof" aria-label={locale === "es" ? "Garantías del asistente" : "Assistant safeguards"}>
              <li>{locale === "es" ? "Solo evidencia pública" : "Public evidence only"}</li>
              <li>{locale === "es" ? "Fuentes en cada respuesta" : "Sources with every answer"}</li>
              <li>{locale === "es" ? "Disponible en español e inglés" : "Available in English and Spanish"}</li>
            </ul>
            <Link className="home-ask-link" href={localePath(locale, "/ask")}>{locale === "es" ? "Abrir la vista completa" : "Open the full assistant"}<ArrowRight aria-hidden="true" size={16} /></Link>
          </div>
          <PortfolioAsk locale={locale} />
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading"><div><p className="eyebrow">02 · {locale === "es" ? "Trabajo seleccionado" : "Selected work"}</p><h2>{locale === "es" ? "Sistemas, no solo modelos." : "Systems, not just models."}</h2></div><p>{locale === "es" ? "Cada caso conecta el problema, los datos, la decisión técnica y la forma de ponerla en uso." : "Each case connects the problem, the data, the technical decision and how it was made usable."}</p></div>
        <div className="featured-work">{featured.map((project) => <FeaturedProject key={project.slug} locale={locale} project={project} />)}</div>
      </section>

      <section className="section-block">
        <div className="section-heading"><div><p className="eyebrow">03 · Leadership · Community</p><h2>{locale === "es" ? "Más allá de los proyectos." : "Beyond the projects."}</h2></div><Link className="button button-ghost" href={localePath(locale, "/experience")}>{locale === "es" ? "Ver trayectoria" : "View experience"}<ArrowRight aria-hidden="true" size={16} /></Link></div>
        <div className="leadership-home">
          <div className="leadership-home-copy">
            <p className="display">{locale === "es" ? "Coordinar, conectar y convertir ideas en iniciativas." : "Coordinate, connect and turn ideas into initiatives."}</p>
            <p className="muted">{locale === "es" ? "Sigma Data Club, UPV Investment Club y tutoría universitaria forman una parte real de mi perfil: liderazgo operativo, comunicación, mentoría y colaboración con empresas." : "Sigma Data Club, UPV Investment Club and peer tutoring are a real part of my profile: operational leadership, communication, mentoring and company collaboration."}</p>
          </div>
          <div className="leadership-metric-grid">{careerMetrics.map((metric) => <div key={metric.value}><strong className="display">{metric.value}</strong><span>{metric.label[locale]}</span></div>)}</div>
          <div className="leadership-role-list">{leadershipAndCommunity.map((record) => <Link href={`${localePath(locale, "/experience")}#${record.id}`} key={record.id}><span>{record.organisation}</span><strong>{record.role[locale]}</strong><ArrowRight aria-hidden="true" size={15} /></Link>)}</div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading"><div><p className="eyebrow">04 · Capabilities · Connections</p><h2>{locale === "es" ? "Explora el mapa del portfolio." : "Explore the portfolio map."}</h2></div><Link className="button button-ghost" href={localePath(locale, "/connections")}>{locale === "es" ? "Abrir grafo interactivo" : "Open interactive graph"}<ArrowRight aria-hidden="true" size={16} /></Link></div>
        <div className="capability-grid">{capabilities.map((capability, index) => <Link href={`${localePath(locale, "/work")}?capability=${encodeURIComponent(capability)}`} key={capability}><strong>{String(index + 1).padStart(2, "0")}</strong>{capability}</Link>)}</div>
        <Link aria-label={locale === "es" ? "Abrir Explore connections" : "Open Explore connections"} className="connections-teaser" href={localePath(locale, "/connections")}>
          <div className="connections-teaser-copy"><span className="eyebrow">Obsidian-inspired</span><strong>{locale === "es" ? "Proyectos, capacidades, liderazgo e innovación en una sola red." : "Projects, capabilities, leadership and innovation in one network."}</strong><span>{locale === "es" ? "Selecciona un nodo para seguir sus relaciones." : "Select a node to follow its relationships."}</span></div>
          <div aria-hidden="true" className="connections-teaser-network"><span className="network-node network-node-main">Sergio</span><span className="network-node network-node-project">UrbanFlow</span><span className="network-node network-node-leadership">Sigma</span><span className="network-node network-node-innovation">Akademia</span><span className="network-node network-node-capability">MLOps</span></div>
        </Link>
      </section>

      <section className="section-block">
        <div className="section-heading"><div><p className="eyebrow">05 · GitHub</p><h2>{locale === "es" ? "Actividad reciente." : "Recent activity."}</h2></div><span className="status-line"><span className="status-dot" />{locale === "es" ? "Bootstrap verificado" : "Verified bootstrap"}</span></div>
        <div className="repository-list">{latest.map((project) => <a className="repository-row" href={project.repositoryUrl} key={project.slug} rel="noreferrer" target="_blank"><strong>{project.repository}</strong><span className="muted">{project.stack[0]}</span><span className="muted">{formatDate(project.updatedAt, locale)}</span><ArrowRight aria-hidden="true" size={17} /></a>)}</div>
      </section>

      <section className="section-block">
        <div className="section-heading"><div><p className="eyebrow">06 · Notes</p><h2>{locale === "es" ? "Decisiones detrás del resultado." : "Behind the result."}</h2></div><Link className="button button-ghost" href={localePath(locale, "/notes")}>{locale === "es" ? "Todas las notas" : "All notes"}<ArrowRight aria-hidden="true" size={16} /></Link></div>
        <div className="notes-grid">{notes.slice(0, 2).map((note) => <article className="card note-card" key={note.slug}><ProjectVisual compact title={note.title[locale]} variant={note.visual} /><div className="note-card-copy"><div className="note-meta"><span>{note.category}</span><span>{formatDate(note.date, locale)}</span></div><h2>{note.title[locale]}</h2><p className="muted">{note.excerpt[locale]}</p><Link className="button button-ghost" href={localePath(locale, `/notes/${note.slug}`)}>{locale === "es" ? "Leer nota" : "Read note"}<ArrowRight aria-hidden="true" size={15} /></Link></div></article>)}</div>
        {linkedinPosts.length > 0 ? <div className="linkedin-home-row"><p className="eyebrow">LinkedIn</p>{linkedinPosts.slice(0, 3).map((post) => <a href={post.url} key={post.id} rel="noreferrer" target="_blank"><strong>{post.title}</strong><span>{formatDate(post.publishedAt, locale)}</span><ArrowRight aria-hidden="true" size={15} /></a>)}</div> : null}
      </section>

      <section className="section-block about-grid">
        <div className="portrait-placeholder" role="img" aria-label={locale === "es" ? "Retrato pendiente de Sergio Ortiz" : "Sergio Ortiz portrait pending"}>{profile.initials}</div>
        <div><p className="eyebrow">07 · About</p><h2 className="display" style={{ fontSize: "clamp(3.2rem, 6vw, 6.5rem)" }}>{locale === "es" ? "Me interesa lo que ocurre después de que el modelo funciona." : "I care about what happens after the model works."}</h2><p className="muted" style={{ fontSize: "1.1rem", lineHeight: 1.75 }}>{profile.bio[locale]}</p><Link className="button button-primary" href={localePath(locale, "/about")}>{locale === "es" ? "Sobre mí" : "More about me"}<ArrowRight aria-hidden="true" size={16} /></Link></div>
      </section>
    </div>
  );
}
