"use client";

import type { Core, ElementDefinition } from "cytoscape";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ProjectRecord } from "@/lib/schemas";
import type { Locale } from "@/lib/i18n-types";

type SelectedNode = { id: string; label: string; type: string; detail?: string } | null;

function makeElements(projects: ProjectRecord[]): ElementDefinition[] {
  const elements: ElementDefinition[] = [];
  const capabilities = new Set(projects.flatMap((project) => project.categories.slice(0, 4)));
  for (const capability of capabilities) elements.push({ data: { id: `cap-${capability}`, label: capability, type: "capability" } });
  for (const project of projects) {
    elements.push({ data: { id: project.slug, label: project.title, type: "project", detail: project.repository } });
    for (const capability of project.categories.slice(0, 4)) {
      elements.push({ data: { id: `${project.slug}-${capability}`, source: project.slug, target: `cap-${capability}` } });
    }
  }
  return elements;
}

export function ConnectionsExplorer({ projects, locale }: { projects: ProjectRecord[]; locale: Locale }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Core | null>(null);
  const [selected, setSelected] = useState<SelectedNode>(null);
  const elements = useMemo(() => makeElements(projects), [projects]);

  useEffect(() => {
    let active = true;
    async function mount() {
      if (!containerRef.current) return;
      const cytoscape = (await import("cytoscape")).default;
      if (!active || !containerRef.current) return;
      const graph = cytoscape({
        container: containerRef.current,
        elements,
        layout: { name: "cose", animate: false, padding: 38 },
        style: [
          { selector: "node", style: { "background-color": "#315c72", color: "#151a18", label: "data(label)", "font-family": "Geist", "font-size": 9, "text-valign": "bottom", "text-margin-y": 8, width: 17, height: 17 } },
          { selector: "node[type = 'project']", style: { "background-color": "#064e47", color: "#064e47", "font-size": 12, "font-weight": 650, width: 32, height: 32 } },
          { selector: "edge", style: { width: 1, "line-color": "#bfc9c2", opacity: 0.7, "curve-style": "bezier" } },
          { selector: ":selected", style: { "border-color": "#d3a94f", "border-width": 4 } },
        ],
      });
      graph.on("tap", "node", (event) => {
        const data = event.target.data() as { id: string; label: string; type: string; detail?: string };
        setSelected(data);
      });
      graphRef.current = graph;
    }
    void mount();
    return () => { active = false; graphRef.current?.destroy(); graphRef.current = null; };
  }, [elements]);

  return (
    <div className="connections-layout">
      <div>
        <div className="graph-wrap"><div aria-label={locale === "es" ? "Grafo interactivo de conexiones" : "Interactive connections graph"} className="graph-canvas" ref={containerRef} role="img" /></div>
        <div className="graph-list card" style={{ padding: "1rem" }}>
          <h2>{locale === "es" ? "Lista accesible" : "Accessible list"}</h2>
          <ul className="panel-list">{projects.map((project) => <li key={project.slug}><button onClick={() => setSelected({ id: project.slug, label: project.title, type: "project", detail: project.categories.join(" · ") })} type="button">{project.title}<br /><span className="muted">{project.categories.join(" · ")}</span></button></li>)}</ul>
        </div>
      </div>
      <aside className="card connections-panel">
        <p className="eyebrow">{selected?.type ?? (locale === "es" ? "Explora" : "Explore")}</p>
        <h2 className="display" style={{ fontSize: "3rem" }}>{selected?.label ?? (locale === "es" ? "Selecciona un nodo" : "Select a node")}</h2>
        <p className="muted">{selected?.detail ?? (locale === "es" ? "Los proyectos conectan automáticamente con sus áreas y capacidades verificadas." : "Projects connect automatically to their verified domains and capabilities.")}</p>
        <div className="filter-row" style={{ marginTop: "1rem" }}><span className="tag">Project</span><span className="tag">Capability</span><span className="tag">USES</span></div>
      </aside>
    </div>
  );
}
