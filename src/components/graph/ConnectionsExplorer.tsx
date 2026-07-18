"use client";

import type { Core, CoseLayoutOptions, EdgeSingular, ElementDefinition, NodeSingular } from "cytoscape";
import { ArrowRight, Focus, List, Minus, Network, Plus, Search, Shuffle } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { localize } from "@/content/profile";
import { localePath } from "@/lib/i18n-client";
import type { Locale } from "@/lib/i18n-types";
import type { CareerRecord, ProjectRecord } from "@/lib/schemas";

type NodeType = "profile" | "project" | "capability" | CareerRecord["kind"];
type GraphFilter = "all" | "project" | "leadership" | "community" | "innovation" | "career";
type GraphView = "graph" | "list";
type GraphNode = { id: string; label: string; type: NodeType; detail?: string; href?: string };
type RelatedNode = GraphNode & { relation: string };
type SelectedNode = GraphNode | null;

const filters: Array<{ id: GraphFilter; en: string; es: string }> = [
  { id: "all", en: "All", es: "Todo" },
  { id: "project", en: "Projects", es: "Proyectos" },
  { id: "leadership", en: "Leadership", es: "Liderazgo" },
  { id: "community", en: "Community", es: "Comunidad" },
  { id: "innovation", en: "Innovation", es: "Innovación" },
  { id: "career", en: "Career", es: "Trayectoria" },
];

const nodeTypeLabels: Record<NodeType, { en: string; es: string }> = {
  profile: { en: "Profile", es: "Perfil" },
  project: { en: "Project", es: "Proyecto" },
  capability: { en: "Capability", es: "Capacidad" },
  experience: { en: "Experience", es: "Experiencia" },
  education: { en: "Education", es: "Formación" },
  leadership: { en: "Leadership", es: "Liderazgo" },
  community: { en: "Community", es: "Comunidad" },
  innovation: { en: "Innovation", es: "Innovación" },
};

const relationLabels: Record<string, { en: string; es: string }> = {
  BUILT: { en: "Built", es: "Construido" },
  DEMONSTRATES: { en: "Demonstrates", es: "Demuestra" },
  LEADS: { en: "Leads", es: "Lidera" },
  PART_OF: { en: "Part of", es: "Forma parte" },
  BUILT_DURING: { en: "Built during", es: "Desarrollado durante" },
};

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
  const elements: ElementDefinition[] = [{
    data: {
      id: "sergio",
      label: "Sergio Ortiz",
      type: "profile",
      detail: locale === "es" ? "Datos · IA · liderazgo · innovación" : "Data · AI · leadership · innovation",
      href: localePath(locale, "/about"),
    },
  }];
  const includedProjects = filter === "all" || filter === "project" ? projects : [];
  const includedRecords = filterCareer(records, filter);
  const capabilityEntries = [
    ...includedProjects.flatMap((project) => project.categories.slice(0, 4)),
    ...includedRecords.flatMap((record) => record.capabilities.slice(0, 4)),
  ];
  const capabilityUsage = capabilityEntries.reduce((usage, capability) => {
    usage.set(capability, (usage.get(capability) ?? 0) + 1);
    return usage;
  }, new Map<string, number>());
  const capabilities = new Set(capabilityEntries.filter((capability) => filter !== "all" || (capabilityUsage.get(capability) ?? 0) > 2));

  for (const capability of capabilities) {
    elements.push({
      data: {
        id: capabilityId(capability),
        label: capability,
        type: "capability",
        detail: locale === "es" ? "Capacidad demostrada" : "Demonstrated capability",
        href: `${localePath(locale, "/work")}?capability=${encodeURIComponent(capability)}`,
      },
    });
  }

  for (const project of includedProjects) {
    elements.push({ data: { id: project.slug, label: project.title, type: "project", detail: localize(project.summary, locale), href: localePath(locale, `/work/${project.slug}`) } });
    elements.push({ data: { id: `sergio-project-${project.slug}`, source: "sergio", target: project.slug, relation: "BUILT" } });
    for (const capability of project.categories.slice(0, 4)) {
      if (!capabilities.has(capability)) continue;
      elements.push({ data: { id: `${project.slug}-${capabilityId(capability)}`, source: project.slug, target: capabilityId(capability), relation: "DEMONSTRATES" } });
    }
  }

  for (const record of includedRecords) {
    const id = `career-${record.id}`;
    elements.push({ data: { id, label: record.organisation, type: record.kind, detail: `${localize(record.role, locale)} · ${localize(record.summary, locale)}`, href: `${localePath(locale, "/experience")}#${record.id}` } });
    elements.push({ data: { id: `sergio-${id}`, source: "sergio", target: id, relation: record.kind === "leadership" ? "LEADS" : "PART_OF" } });
    for (const capability of record.capabilities.slice(0, 4)) {
      if (!capabilities.has(capability)) continue;
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

function layoutOptions(reducedMotion: boolean): CoseLayoutOptions {
  return {
    name: "cose",
    animate: !reducedMotion,
    animationDuration: reducedMotion ? 0 : 820,
    animationEasing: "ease-out-cubic",
    randomize: true,
    fit: true,
    padding: 54,
    avoidOverlap: true,
    nodeDimensionsIncludeLabels: true,
    componentSpacing: 72,
    nodeRepulsion: (node) => node.data("type") === "profile" ? 22_000 : node.data("type") === "capability" ? 9_000 : 15_000,
    nodeOverlap: 18,
    idealEdgeLength: (edge) => edge.data("relation") === "DEMONSTRATES" ? 82 : 112,
    edgeElasticity: (edge) => edge.data("relation") === "BUILT_DURING" ? 72 : 110,
    nestingFactor: 1.2,
    gravity: 0.48,
    numIter: 1_200,
    initialTemp: 1_100,
    coolingFactor: 0.985,
    minTemp: 1,
  };
}

function nodeData(node: NodeSingular): GraphNode {
  return node.data() as GraphNode;
}

function relatedNodes(node: NodeSingular): RelatedNode[] {
  const related = new Map<string, RelatedNode>();
  node.connectedEdges().forEach((edge: EdgeSingular) => {
    const neighbour = edge.source().id() === node.id() ? edge.target() : edge.source();
    if (neighbour.id() === node.id()) return;
    const data = nodeData(neighbour);
    related.set(data.id, { ...data, relation: String(edge.data("relation") ?? "RELATED_TO") });
  });
  return [...related.values()].sort((a, b) => a.label.localeCompare(b.label));
}

function clearFocus(graph: Core) {
  graph.elements().removeClass("is-muted is-related is-focused is-flowing");
  graph.elements().unselect();
}

function focusGraphNode(graph: Core, id: string, reducedMotion: boolean) {
  const node = graph.getElementById(id);
  if (!node.length) return [];
  clearFocus(graph);
  const neighbourhood = node.closedNeighborhood();
  graph.elements().difference(neighbourhood).addClass("is-muted");
  neighbourhood.addClass("is-related");
  node.addClass("is-focused").select();
  node.connectedEdges().addClass("is-flowing");
  if (!reducedMotion) {
    graph.animate({ fit: { eles: neighbourhood, padding: 110 }, duration: 460, easing: "ease-out-cubic" });
  } else {
    graph.fit(neighbourhood, 110);
  }
  return relatedNodes(node);
}

export function ConnectionsExplorer({ projects, records, locale }: { projects: ProjectRecord[]; records: CareerRecord[]; locale: Locale }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Core | null>(null);
  const reducedMotionRef = useRef(false);
  const [selected, setSelected] = useState<SelectedNode>(null);
  const [related, setRelated] = useState<RelatedNode[]>([]);
  const [filter, setFilter] = useState<GraphFilter>("all");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<GraphView>("graph");
  const [graphReady, setGraphReady] = useState(false);
  const elements = useMemo(() => makeElements(projects, records, locale, filter), [filter, locale, projects, records]);
  const visibleNodes = useMemo(
    () => elements
      .filter((element) => element.data.source === undefined)
      .map((element) => element.data as GraphNode)
      .filter((node) => Boolean(node?.id && node.label)),
    [elements],
  );
  const edgeCount = elements.length - visibleNodes.length;
  const searchResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return visibleNodes;
    return visibleNodes.filter((node) => `${node.label} ${node.detail ?? ""}`.toLowerCase().includes(normalizedQuery));
  }, [query, visibleNodes]);

  const selectNodeById = useCallback((id: string) => {
    const graph = graphRef.current;
    if (!graph) return;
    const node = graph.getElementById(id);
    if (!node.length) return;
    setSelected(nodeData(node));
    setRelated(focusGraphNode(graph, id, reducedMotionRef.current));
  }, []);

  const resetGraph = useCallback(() => {
    const graph = graphRef.current;
    if (!graph) return;
    clearFocus(graph);
    setSelected(null);
    setRelated([]);
    if (reducedMotionRef.current) graph.fit(graph.elements(), 76);
    else graph.animate({ fit: { eles: graph.elements(), padding: 76 }, duration: 420, easing: "ease-out-cubic" });
  }, []);

  const rearrangeGraph = useCallback(() => {
    const graph = graphRef.current;
    if (!graph) return;
    clearFocus(graph);
    setSelected(null);
    setRelated([]);
    graph.layout(layoutOptions(reducedMotionRef.current)).run();
  }, []);

  const changeZoom = useCallback((delta: number) => {
    const graph = graphRef.current;
    if (!graph) return;
    const nextZoom = Math.min(graph.maxZoom(), Math.max(graph.minZoom(), graph.zoom() + delta));
    if (reducedMotionRef.current) graph.zoom(nextZoom);
    else graph.animate({ zoom: nextZoom, duration: 180, easing: "ease-out-cubic" });
  }, []);

  useEffect(() => {
    let active = true;

    async function mount() {
      if (!containerRef.current) return;
      const cytoscape = (await import("cytoscape")).default;
      if (!active || !containerRef.current) return;
      reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const graph = cytoscape({
        container: containerRef.current,
        elements,
        layout: layoutOptions(reducedMotionRef.current),
        minZoom: 0.42,
        maxZoom: 2.3,
        wheelSensitivity: 0.18,
        boxSelectionEnabled: false,
        style: [
          {
            selector: "node",
            style: {
              "background-color": "#315c72",
              "border-color": "#f7f5ef",
              "border-width": 2,
              color: "#263d36",
              label: "data(label)",
              "font-family": "Geist",
              "font-size": 11,
              "font-weight": 600,
              "text-valign": "bottom",
              "text-halign": "center",
              "text-margin-y": 9,
              "text-wrap": "wrap",
              "text-max-width": "112px",
              "text-background-color": "#f7f5ef",
              "text-background-opacity": 0.9,
              "text-background-padding": "3px",
              "text-background-shape": "roundrectangle",
              "min-zoomed-font-size": 8,
              width: 22,
              height: 22,
              "transition-property": "opacity, border-width, border-color, background-color",
              "transition-duration": 180,
            },
          },
          {
            selector: "node[type = 'profile']",
            style: {
              "background-color": "#151a18",
              "background-image": "/images/profile/github-avatar.webp",
              "background-fit": "cover",
              "border-color": "#064e47",
              "border-width": 4,
              color: "#151a18",
              "font-size": 15,
              "font-weight": 700,
              "min-zoomed-font-size": 0,
              "text-margin-y": 12,
              width: 64,
              height: 64,
            },
          },
          { selector: "node[type = 'project']", style: { "background-color": "#064e47", color: "#064e47", "font-size": 12.5, "font-weight": 700, "min-zoomed-font-size": 0, "text-max-width": "132px", width: 39, height: 39 } },
          { selector: "node[type = 'leadership']", style: { "background-color": "#d3a94f", color: "#6e561c", "font-size": 12, "font-weight": 700, "min-zoomed-font-size": 0, "text-max-width": "124px", width: 39, height: 39 } },
          { selector: "node[type = 'community']", style: { "background-color": "#7a9b78", color: "#3f5a3d", "font-size": 11.5, "min-zoomed-font-size": 0, "text-max-width": "120px", width: 33, height: 33 } },
          { selector: "node[type = 'innovation']", style: { "background-color": "#b85f4b", color: "#7f382a", "font-size": 11.5, "min-zoomed-font-size": 0, "text-max-width": "120px", width: 35, height: 35 } },
          { selector: "node[type = 'experience'], node[type = 'education']", style: { "background-color": "#6b7280", color: "#48505a", "font-size": 11.5, "min-zoomed-font-size": 0, "text-max-width": "120px", width: 33, height: 33 } },
          { selector: "node[type = 'capability']", style: { "font-size": 9, "font-weight": 550, "text-max-width": "94px", width: 18, height: 18, opacity: 0.78 } },
          { selector: "edge", style: { width: 1.15, "line-color": "#aebdb5", opacity: 0.62, "curve-style": "bezier", "line-cap": "round", "transition-property": "opacity, line-color, width", "transition-duration": 180 } },
          { selector: "edge[relation = 'BUILT_DURING']", style: { "line-color": "#c39a3f", width: 1.8, "line-style": "dashed", "line-dash-pattern": [7, 5] } },
          { selector: ".is-muted", style: { opacity: 0.08, "text-opacity": 0 } },
          { selector: "node.is-related", style: { opacity: 1, "border-color": "#d3a94f", "min-zoomed-font-size": 0 } },
          { selector: "edge.is-related", style: { opacity: 0.34 } },
          { selector: "node.is-focused", style: { opacity: 1, "border-color": "#d3a94f", "border-width": 5, "underlay-color": "#d3a94f", "underlay-opacity": 0.17, "underlay-padding": 10 } },
          { selector: "edge.is-flowing", style: { opacity: 0.95, width: 2.7, "line-color": "#d3a94f", "line-style": "dashed", "line-dash-pattern": [9, 6], "target-arrow-color": "#d3a94f", "target-arrow-shape": "triangle", "arrow-scale": 0.65 } },
          { selector: ".is-search-muted", style: { opacity: 0.1, "text-opacity": 0 } },
          { selector: "node.is-search-match", style: { opacity: 1, "border-color": "#d3a94f", "border-width": 4, "min-zoomed-font-size": 0, "underlay-color": "#d3a94f", "underlay-opacity": 0.13, "underlay-padding": 8 } },
          { selector: "node.is-related.is-search-muted, node.is-focused.is-search-muted", style: { opacity: 1, "text-opacity": 1, "min-zoomed-font-size": 0 } },
          { selector: "edge.is-flowing.is-search-muted", style: { opacity: 0.95 } },
        ],
      });

      graphRef.current = graph;
      setGraphReady(true);
      graph.on("tap", "node", (event) => selectNodeById(event.target.id()));
      graph.on("tap", (event) => {
        if (event.target !== graph) return;
        clearFocus(graph);
        setSelected(null);
        setRelated([]);
      });

    }

    void mount();
    return () => {
      active = false;
      graphRef.current?.destroy();
      graphRef.current = null;
    };
  }, [elements, selectNodeById]);

  useEffect(() => {
    const graph = graphRef.current;
    if (!graph || !selected || reducedMotionRef.current) return;
    let flowFrame: number | null = null;
    let lastFlowUpdate = 0;
    let dashOffset = 0;

    const animateFlow = (time: number) => {
      if (time - lastFlowUpdate > 70) {
        dashOffset = (dashOffset - 1.5) % 30;
        graph.edges(".is-flowing").style("line-dash-offset", dashOffset);
        lastFlowUpdate = time;
      }
      flowFrame = window.requestAnimationFrame(animateFlow);
    };

    flowFrame = window.requestAnimationFrame(animateFlow);
    return () => {
      if (flowFrame !== null) window.cancelAnimationFrame(flowFrame);
    };
  }, [selected]);

  useEffect(() => {
    const graph = graphRef.current;
    if (!graph) return;
    graph.nodes().removeClass("is-search-muted is-search-match");
    graph.edges().removeClass("is-search-muted");
    if (!query.trim()) return;
    const matchingIds = new Set(searchResults.map((node) => node.id));
    graph.nodes().forEach((node) => {
      node.addClass(matchingIds.has(node.id()) ? "is-search-match" : "is-search-muted");
    });
    graph.edges().addClass("is-search-muted");
  }, [query, searchResults]);

  useEffect(() => {
    if (view !== "graph" || !graphRef.current) return;
    const frame = window.requestAnimationFrame(() => {
      const graph = graphRef.current;
      if (!graph) return;
      graph.resize();
      graph.fit(graph.elements(), 76);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [view]);

  const setGraphFilter = (nextFilter: GraphFilter) => {
    setGraphReady(false);
    setSelected(null);
    setRelated([]);
    setQuery("");
    setFilter(nextFilter);
  };

  return (
    <div className="connections-explorer">
      <div className="connections-tools">
        <div aria-label={locale === "es" ? "Filtrar conexiones" : "Filter connections"} className="connections-filters" role="group">
          {filters.map((item) => (
            <button aria-pressed={filter === item.id} className={filter === item.id ? "is-active" : undefined} key={item.id} onClick={() => setGraphFilter(item.id)} type="button">
              {item[locale]}
            </button>
          ))}
        </div>
        <label className="connections-search">
          <Search aria-hidden="true" size={16} />
          <span className="sr-only">{locale === "es" ? "Buscar nodos" : "Search nodes"}</span>
          <input onChange={(event) => setQuery(event.target.value)} placeholder={locale === "es" ? "Buscar proyecto, club o capacidad" : "Search project, club or capability"} type="search" value={query} />
        </label>
      </div>

      {query.trim() ? (
        <div aria-label={locale === "es" ? "Resultados de búsqueda" : "Search results"} className="connections-search-results">
          {searchResults.length ? searchResults.slice(0, 8).map((node) => (
            <button disabled={!graphReady} key={node.id} onClick={() => selectNodeById(node.id)} type="button">
              <strong>{node.label}</strong>
              <span>{nodeTypeLabels[node.type][locale]}</span>
            </button>
          )) : <p className="muted">{locale === "es" ? "No hay conexiones que coincidan." : "No matching connections found."}</p>}
        </div>
      ) : null}

      <div className="connections-layout">
        <div className={`connections-main ${view === "list" ? "is-list-view" : ""}`}>
          <div className="graph-toolbar">
            <div className="graph-status">
              <span aria-hidden="true" className="graph-live-dot" />
              <strong>{visibleNodes.length}</strong> {locale === "es" ? "nodos" : "nodes"}
              <span>·</span>
              <strong>{edgeCount}</strong> {locale === "es" ? "relaciones" : "relations"}
            </div>
            <div aria-label={locale === "es" ? "Controles del grafo" : "Graph controls"} className="graph-controls" role="group">
              <button aria-label={locale === "es" ? "Vista de grafo" : "Graph view"} aria-pressed={view === "graph"} onClick={() => setView("graph")} title={locale === "es" ? "Vista de grafo" : "Graph view"} type="button"><Network aria-hidden="true" size={16} /></button>
              <button aria-label={locale === "es" ? "Vista de lista" : "List view"} aria-pressed={view === "list"} onClick={() => setView("list")} title={locale === "es" ? "Vista de lista" : "List view"} type="button"><List aria-hidden="true" size={16} /></button>
              <i aria-hidden="true" />
              <button aria-label={locale === "es" ? "Alejar" : "Zoom out"} onClick={() => changeZoom(-0.18)} title={locale === "es" ? "Alejar" : "Zoom out"} type="button"><Minus aria-hidden="true" size={16} /></button>
              <button aria-label={locale === "es" ? "Acercar" : "Zoom in"} onClick={() => changeZoom(0.18)} title={locale === "es" ? "Acercar" : "Zoom in"} type="button"><Plus aria-hidden="true" size={16} /></button>
              <button aria-label={locale === "es" ? "Mostrar toda la red" : "Fit entire network"} onClick={resetGraph} title={locale === "es" ? "Mostrar toda la red" : "Fit entire network"} type="button"><Focus aria-hidden="true" size={16} /></button>
              <button aria-label={locale === "es" ? "Reorganizar la red" : "Rearrange network"} onClick={rearrangeGraph} title={locale === "es" ? "Reorganizar la red" : "Rearrange network"} type="button"><Shuffle aria-hidden="true" size={16} /></button>
            </div>
          </div>

          <div className="graph-wrap">
            <div aria-label={locale === "es" ? "Grafo interactivo de conexiones" : "Interactive connections graph"} className="graph-canvas" ref={containerRef} role="img" />
            <p className="graph-hint">{locale === "es" ? "Arrastra los nodos · rueda para ampliar · selecciona para seguir una relación" : "Drag nodes · scroll to zoom · select to follow a relationship"}</p>
          </div>

          <div className="graph-list card">
            <div className="graph-list-heading">
              <h2>{locale === "es" ? "Todos los nodos" : "All nodes"}</h2>
              <span className="mono">{searchResults.length}</span>
            </div>
            <ul className="panel-list">
              {searchResults.map((node) => (
                <li key={node.id}>
                  <button disabled={!graphReady} onClick={() => selectNodeById(node.id)} type="button">
                    <span className={`list-node-dot list-node-${node.type}`} />
                    <span><strong>{node.label}</strong><small>{nodeTypeLabels[node.type][locale]} · {node.detail}</small></span>
                    <ArrowRight aria-hidden="true" size={15} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside aria-live="polite" className="card connections-panel">
          <div className="connections-panel-meta">
            <p className="eyebrow">{selected ? nodeTypeLabels[selected.type][locale] : (locale === "es" ? "Explora" : "Explore")}</p>
            {selected ? <span className="mono">{related.length} {locale === "es" ? "conexiones" : "connections"}</span> : null}
          </div>
          <h2 className="display">{selected?.label ?? (locale === "es" ? "Selecciona un nodo" : "Select a node")}</h2>
          <p className="muted">{selected?.detail ?? (locale === "es" ? "Selecciona un proyecto, una experiencia o una capacidad. La red aislará su contexto y mostrará cómo se relaciona con el resto del portfolio." : "Select a project, experience or capability. The network will isolate its context and show how it relates to the rest of the portfolio.")}</p>
          {selected?.href ? <Link className="button button-primary" href={selected.href}>{locale === "es" ? "Abrir registro" : "Open record"}<ArrowRight aria-hidden="true" size={15} /></Link> : null}

          {related.length ? (
            <div className="connections-related">
              <p className="eyebrow">{locale === "es" ? "Conectado con" : "Connected to"}</p>
              <div>
                {related.slice(0, 8).map((node) => (
                  <button key={`${node.id}-${node.relation}`} onClick={() => selectNodeById(node.id)} type="button">
                    <span><strong>{node.label}</strong><small>{relationLabels[node.relation]?.[locale] ?? node.relation}</small></span>
                    <ArrowRight aria-hidden="true" size={14} />
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="connections-legend">
            <span><i className="legend-project" />{nodeTypeLabels.project[locale]}</span>
            <span><i className="legend-leadership" />{nodeTypeLabels.leadership[locale]}</span>
            <span><i className="legend-community" />{nodeTypeLabels.community[locale]}</span>
            <span><i className="legend-innovation" />{nodeTypeLabels.innovation[locale]}</span>
            <span><i className="legend-career" />{locale === "es" ? "Trayectoria" : "Career"}</span>
            <span><i className="legend-capability" />{nodeTypeLabels.capability[locale]}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
