import { ImageResponse } from "next/og";

export const alt = "Sergio Ortiz — Data Science, AI Engineering and intelligent systems";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ alignItems: "stretch", background: "#f7f5ef", color: "#151a18", display: "flex", flexDirection: "column", fontFamily: "serif", height: "100%", justifyContent: "space-between", padding: "65px", width: "100%" }}><div style={{ color: "#064e47", display: "flex", fontFamily: "sans-serif", fontSize: 24, letterSpacing: 4 }}>SERGIO ORTIZ · PORTFOLIO</div><div style={{ display: "flex", fontSize: 86, lineHeight: 0.95, maxWidth: 980 }}>Intelligent systems from real-world data.</div><div style={{ alignItems: "center", display: "flex", fontFamily: "sans-serif", fontSize: 25, justifyContent: "space-between" }}><span>Data Science · AI Engineering · MLOps</span><span style={{ background: "#064e47", borderRadius: 99, color: "white", display: "flex", padding: "15px 24px" }}>Valencia</span></div></div>, size);
}
