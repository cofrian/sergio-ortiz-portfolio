import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/content/projects";
import { getFeatureStatus, getServerEnv } from "@/lib/env/server";
import { isAdminSession, signIn } from "@/app/admin/status/actions";

export const metadata: Metadata = { robots: { index: false, follow: false }, title: "Portfolio status" };

export default async function AdminStatusPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const env = getServerEnv();
  if (!env.ADMIN_SECRET) notFound();
  const authenticated = await isAdminSession();
  if (!authenticated) {
    const { error } = await searchParams;
    return <main className="site-shell empty-state" style={{ minHeight: "100vh" }}><form action={signIn} className="card form-grid" style={{ maxWidth: 460, padding: "1.4rem", width: "100%" }}><p className="eyebrow">Protected status</p><h1 className="display" style={{ fontSize: "3.2rem" }}>Admin session</h1><div className="form-field"><label htmlFor="secret">Admin secret</label><input id="secret" name="secret" type="password" required /></div><button className="button button-primary" type="submit">Open status</button>{error ? <p className="form-message" role="alert">Invalid credentials.</p> : null}</form></main>;
  }
  const status = getFeatureStatus();
  return <main className="site-shell"><header className="page-intro"><p className="eyebrow">Private diagnostics</p><h1 className="display">Portfolio status</h1><p>Configuration state only. No tokens, internal URLs or provider responses are displayed.</p></header><section className="section-block"><div className="grid-three">{Object.entries(status).map(([key, value]) => <article className="card" key={key} style={{ padding: "1.2rem" }}><p className="eyebrow">{key}</p><h2>{value ? "Configured" : "Not configured"}</h2></article>)}</div></section><section className="section-block"><div className="section-heading"><h2>Content bootstrap</h2></div><div className="grid-three"><article className="card" style={{ padding: "1.2rem" }}><p className="eyebrow">Projects</p><h2>{projects.length}</h2></article><article className="card" style={{ padding: "1.2rem" }}><p className="eyebrow">Featured</p><h2>{projects.filter((project) => project.featured).length}</h2></article><article className="card" style={{ padding: "1.2rem" }}><p className="eyebrow">Editorial review</p><h2>Required before generated PR merge</h2></article></div></section></main>;
}
