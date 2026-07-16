import Link from "next/link";

export default function NotFound() {
  return <main className="site-shell empty-state" style={{ minHeight: "100vh" }}><div><p className="eyebrow">404 · No record found</p><h1 className="display" style={{ fontSize: "clamp(4rem, 12vw, 10rem)" }}>Not indexed yet.</h1><p>The requested record does not exist or has not been added to the portfolio.</p><Link className="button button-primary" href="/en" style={{ marginTop: "1rem" }}>Return home</Link></div></main>;
}
