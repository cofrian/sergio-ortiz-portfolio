"use client";

import type { Core, ElementDefinition } from "cytoscape";
import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { localize } from "@/content/profile";
import { localePath } from "@/lib/i18n-client";
import type { Locale } from "@/lib/i18n-types";
import type { CareerRecord, ProjectRecord } from "@/lib/schemas";

type NodeType = "profile" | "project" | "capability" | CareerRecord["kind"];
type GraphFilter = "all" | "project" | "leadership" | "community" | "innovation" | "career";
type SelectedNode = { id: string; label: string; type: NodeType; detail?: string; href?: string } | null;

function capabilityId(value: string) {
  return `cap-${value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
}

function filterCareer(records: CareerRecord[], filter: GraphFilter) {
  if (filter === "all") return records;
  if (filter === "career") return records.filter((record) => record.kind === "experience" || record.kind === "education");
  if (filter === "leadership" || filter === "community" || filter === "innovation") return records.filter((record) => record.kind === filter);
  return [];
}

function makeElements(projects: ProjectRecord[], records: CareerRecord[], locale: Locale, filter: GraphFilter): ElementDefinition[] {
  const elements: ElementDefinition[] = [{ data: { id: "sergio", label: "Sergio Ortiz", type: "profile", detail: locale === "es" ? "Datos · IA · liderazgo · innovación" : "Data · AI · leadership · innovation", href: localePath(locale, "/about") } }];
  const includedProjects = filter === "all" || filter === "project" ? projects : [];
  const includedRecords = filterCareer(records, filter);
  const capabilities = new Set([
    ...includedProjects.flatMap((project) => project.categories.slice(0, 4)),
    ...includedRecords.flatMap((record) => record.capabilities.slice(0, 4)),
  ]);

  for (const capability of capabilities) {
    elements.push({ data: { id: capabilityId(capability), label: capability, type: "capability", detail: locale === "es" ? "Capacidad demostrada" : "Demonstrated capability", href: `${localePath(locale, "/work")}?capability=${encodeURIComponent(capability)}` } });
  }

  for (const project of includedProjects) {
    elements.push({ data: { id: project.slug, label: project.title, type: "project", detail: localize(project.summary, locale), href: localePath(locale, `/work/${project.slug}`) } });
    elements.push({ data: { id: `sergio-project-${project.slug}`, source: "sergio", target: project.slug, relation: "BUILT" } });
    for (const capability of project.categories.slice(0, 4)) {
      elements.push({ data: { id: `${project.slug}-${capabilityId(capability)}`, source: project.slug, target: capabilityId(capability), relation: "DEMONSTRATES" } });
    }
  }

  for (const record of includedRecords) {
    const id = `career-${record.id}`;
    elements.push({ data: { id, label: record.organisation, type: record.kind, detail: `${localize(record.role, locale)} · ${localize(record.summary, locale)}`, href: `${localePath(locale, "/experience")}#${record.id}` } });
    elements.push({ data: { id: `sergio-${id}`, source: "sergio", target: id, relation: record.kind === "leadership" ? "LEADS" : "PART_OF" } });
    for (const capability of record.capabilities.slice(0, 4)) {
      elements.push({ data: { id: `${id}-${capabilityId(capability)}`, source: id, target: capabilityId(capability), relation: "DEMONSTRATES" } });
    }
    if (filter === "all") {
      for (const projectSlug of record.relatedProjects) {
        if (projects.some((project) => project.slug === projectSlug)) {
          elements.push({ data: { id: `${id}-project-${projectSlug}`, source: id, target: projectSlug, relation: "BUILT_DURING" } });
        }
      }
    }
  }
  return elements;
}

const filters: Array<{ id: GraphFilter; en: string; es: string }> = [
  { id: "all", en: "All", es: "Todo" },
  { id: "project", en: "Projects", es: "Proyectos" },
  { id: "leadership", en: "Leadership", es: "Liderazgo" },
  { id: "community", en: "Community", es: "Comunidad" },
  { id: "innovation", en: "Innovation", es: "Innovación" },
  { id: "career", en: "Career", es: "Trayectoria" },
];

export function ConnectionsExplorer({ projects, records, locale }: { projects: ProjectRecord[]; records: CareerRecord[]; locale: Locale }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Core | null>(null);
  const [selected, setSelected] = useState<SelectedNode>(null);
  const [filter, setFilter] = useState<GraphFilter>("all");
  const [query, setQuery] = useState("");
  const elements = useMemo(() => makeElements(projects, records, locale, filter), [filter, locale, projects, records]);
  const visibleNodes = useMemo(() => elements.filter((element) => element.data.source === undefined).map((element) => element.data as SelectedNode).filter((node): node is NonNullable<SelectedNode> => Boolean(node?.id && node.label)), [elements]);
  const searchResults = visibleNodes.filter((node) => `${node.label} ${node.detail ?? ""}`.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    let active = true;
    async function mount() {
      if (!containerRef.current) return;
      const cytoscape = (await import("cytoscape")).default;
      if (!active || !containerRef.current) return;
      const graph = cytoscape({
        container: containerRef.current,
        elements,
        layout: { name: "cose", animate: false, padding: 44, nodeRepulsion: () => 8_000 },
        style: [
          { selector: "node", style: { "background-color": "#315c72", color: "#151a18", label: "data(label)", "font-family": "Geist", "font-size": 9, "text-valign": "bottom", "text-margin-y": 8, width: 18, height: 18 } },
          { selector: "node[type = 'profile']", style: { "background-color": "#151a18", color: "#151a18", "font-size": 14, "font-weight": 700, width: 46, height: 46 } },
          { selector: "node[type = 'project']", style: { "background-color": "#064e47", color: "#064e47", "font-size": 11, "font-weight": 700, width: 30, height: 30 } },
          { selector: "node[type = 'leadership']", style: { "background-color": "#d3a94f", color: "#7d6327", "font-size": 11, width: 32, height: 32 } },
          { selector: "node[type = 'community']", style: { "background-color": "#7a9b78", color: "#486247", "font-size": 11, width: 27, height: 27 } },
          { selector: "node[type = 'innovation']", style: { "background-color": "#b85f4b", color: "#8f4231", "font-size": 11, width: 28, height: 28 } },
          { selector: "node[type = 'experience'], node[type = 'education']", style: { "background-color": "#6b7280", color: "#505660", "font-size": 11, width: 27, height: 27 } },
          { selector: "edge", style: { width: 1, "line-color": "#bfc9c2", opacity: 0.65, "curve-style": "bezier" } },
          { selector: "edge[relation = 'BUILT_DURING']", style: { "line-color": "#d3a94f", width: 2, "line-style": "dashed" } },
          { selector: ":selected", style: { "border-color": "#d3a94f", "border-width": 4 } },
        ],
      });
      graph.on("tap", "node", (event) => {
        const data = event.target.data() as NonNullable<SelectedNode>;
        setSelected(data);
      });
      graphRef.current = graph;
    }
    void mount();
    return () => { active = false; graphRef.current?.destroy(); graphRef.current = null; };
  }, [elements]);

  return (
    <div className="connections-explorer">
      <div className="connections-tools">
        <div aria-label={locale === "es" ? "Filtrar conexiones" : "Filter connections"} className="connections-filters" role="group">
          {filters.map((item) => <button aria-pressed={filter === item.id} className={filter === item.id ? "is-active" : undefined} key={item.id} onClick={() => { setSelected(null); setFilter(item.id); }} type="button">{item[locale]}</button>)}
        </div>
        <label className="connections-search"><Search aria-hidden="true" size={16} /><span className="sr-only">{locale === "es" ? "Buscar nodos" : "Search nodes"}</span><input onChange={(event) => setQuery(event.target.value)} placeholder={locale === "es" ? "Buscar proyecto, club o capacidad" : "Search project, club or capability"} type="search" value={query} /></label>
      </div>
      {query.trim() ? (
        <div aria-label={locale === "es" ? "Resultados de búsqueda" : "Search results"} className="connections-search-results">
          {searchResults.length ? searchResults.slice(0, 8).map((node) => (
            <button key={node.id} onClick={() => setSelected(node)} type="button">
              <strong>{node.label}</strong>
              <span>{node.type}</span>
            </button>
          )) : <p className="muted">{locale === "es" ? "No hay conexiones que coincidan." : "No matching connections found."}</p>}
        </div>
      ) : null}
      <div className="connections-layout">
        <div>
          <div className="graph-wrap"><div aria-label={locale === "es" ? "Grafo interactivo de conexiones" : "Interactive connections graph"} className="graph-canvas" ref={containerRef} role="img" /></div>
          <div className="graph-list card">
            <h2>{locale === "es" ? "Lista accesible" : "Accessible list"}</h2>
            <ul className="panel-list">{searchResults.map((node) => <li key={node.id}><button onClick={() => setSelected(node)} type="button"><strong>{node.label}</strong><br /><span className="muted">{node.type} · {node.detail}</span></button></li>)}</ul>
          </div>
        </div>
        <aside aria-live="polite" className="card connections-panel">
          <p className="eyebrow">{selected?.type ?? (locale === "es" ? "Explora" : "Explore")}</p>
          <h2 className="display">{selected?.label ?? (locale === "es" ? "Selecciona un nodo" : "Select a node")}</h2>
          <p className="muted">{selected?.detail ?? (locale === "es" ? "Conecta proyectos, capacidades, experiencia, liderazgo, clubes e innovación. Filtra la red o busca un nodo concreto." : "Connect projects, capabilities, experience, leadership, clubs and innovation. Filter the network or search for a specific node.")}</p>
          {selected?.href ? <Link className="button button-primary" href={selected.href}>{locale === "es" ? "Abrir registro" : "Open record"}<ArrowRight aria-hidden="true" size={15} /></Link> : null}
          <div className="connections-legend">
            <span><i className="legend-project" />Project</span><span><i className="legend-leadership" />Leadership</span><span><i className="legend-community" />Community</span><span><i className="legend-innovation" />Innovation</span><span><i className="legend-capability" />Capability</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
