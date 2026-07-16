import type { ProjectRecord } from "@/lib/schemas";
import { cn } from "@/lib/utils";

interface ProjectVisualProps {
  variant: ProjectRecord["visual"];
  title: string;
  className?: string;
  compact?: boolean;
}

const networkPaths = [
  "M-20 32 C80 14 90 116 210 58 S360 42 470 98",
  "M-10 108 C72 80 155 150 260 74 S380 26 490 60",
  "M22 -10 C70 66 130 56 188 144",
  "M126 -20 C145 66 260 42 318 160",
  "M360 -15 C330 52 410 92 460 170",
];

export function ProjectVisual({
  variant,
  title,
  className,
  compact = false,
}: ProjectVisualProps) {
  const isMap = variant === "urbanflow" || variant === "aion" || variant === "market";
  const isEarth = variant === "earth";
  const isGemf = variant === "gemf";

  return (
    <div className={cn("project-visual", `visual-${variant}`, compact && "project-visual-compact", className)}>
      <svg aria-labelledby={`visual-${variant}-title`} role="img" viewBox="0 0 480 220">
        <title id={`visual-${variant}-title`}>{title}</title>
        <defs>
          <linearGradient id={`bg-${variant}`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor={isEarth ? "#f8f4e7" : "#0c292d"} />
            <stop offset="1" stopColor={isEarth ? "#ffffff" : "#071b24"} />
          </linearGradient>
          <filter id={`glow-${variant}`}>
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width="480" height="220" rx="12" fill={`url(#bg-${variant})`} />

        {isMap && (
          <>
            {networkPaths.map((path, index) => (
              <path
                d={path}
                fill="none"
                key={path}
                opacity={0.78}
                stroke={index % 3 === 0 ? "#e5b844" : index % 2 === 0 ? "#79b94f" : "#d36e43"}
                strokeLinecap="round"
                strokeWidth={index === 1 ? 4 : 2.2}
              />
            ))}
            {Array.from({ length: 35 }, (_, index) => (
              <circle
                cx={(index * 67) % 465}
                cy={(index * 41) % 210}
                fill="#bdd8cf"
                key={index}
                opacity="0.22"
                r="1.2"
              />
            ))}
            {variant === "aion" && (
              <>
                <path d="M72 68 C154 98 268 70 395 152" fill="none" stroke="#54d091" strokeWidth="5" />
                <circle cx="72" cy="68" fill="#54d091" filter={`url(#glow-${variant})`} r="8" />
                <circle cx="395" cy="152" fill="#e94b45" filter={`url(#glow-${variant})`} r="10" />
                <path d="M390 146 l10 12 M400 146 l-10 12" stroke="white" strokeWidth="2" />
              </>
            )}
          </>
        )}

        {isEarth && (
          <g transform="translate(240 110)">
            {Array.from({ length: 9 }, (_, index) => {
              const angle = (index / 9) * Math.PI * 2 - Math.PI / 2;
              const length = 48 + ((index * 29) % 58);
              const x = Math.cos(angle) * length;
              const y = Math.sin(angle) * length;
              const color = ["#417d70", "#e2ab42", "#d85b43", "#6aa39a", "#7c8cc7"][index % 5];
              return (
                <g key={index}>
                  <path d={`M0 0 L${x} ${y}`} stroke={color} strokeWidth="20" strokeLinecap="round" opacity="0.86" />
                  <circle cx={x} cy={y} fill={color} r="11" />
                </g>
              );
            })}
            <circle fill="#f7f5ef" r="37" />
            <circle fill="none" r="35" stroke="#315c72" strokeWidth="1.5" />
            <text fill="#15372f" fontSize="13" fontWeight="700" textAnchor="middle" y="5">9 PB</text>
          </g>
        )}

        {isGemf && (
          <g transform="translate(24 48)">
            {["Image", "OCR", "Gemini", "Encoder", "Fusion", "p(y)"].map((label, index) => {
              const x = index * 72;
              const wide = label === "Gemini" || label === "Encoder";
              return (
                <g key={label} transform={`translate(${x} ${index % 2 === 0 ? 0 : 72})`}>
                  <rect fill={label === "Gemini" ? "#d3a94f" : "#f8faf8"} height="46" rx="8" stroke="#9ab0a7" width={wide ? 68 : 58} />
                  <text fill="#173a34" fontSize="10" fontWeight="650" textAnchor="middle" x={wide ? 34 : 29} y="27">{label}</text>
                  {index < 5 && <path d="M59 23 L70 23" stroke="#9ab0a7" strokeWidth="1.5" />}
                </g>
              );
            })}
            <path d="M30 47 C80 120 280 115 392 88" fill="none" stroke="#6aa39a" strokeDasharray="4 4" />
          </g>
        )}

        {!isMap && !isEarth && !isGemf && (
          <g transform="translate(42 42)">
            {Array.from({ length: 4 }, (_, row) =>
              Array.from({ length: 5 }, (_, column) => (
                <rect
                  fill={(row + column) % 3 === 0 ? "#d3a94f" : "#d9e7e1"}
                  height="34"
                  key={`${row}-${column}`}
                  opacity={0.88 - row * 0.1}
                  rx="7"
                  stroke="#63857d"
                  width="58"
                  x={column * 72}
                  y={row * 38}
                />
              )),
            )}
            <path d="M28 17 H330 M28 55 H330 M28 93 H330 M28 131 H330" opacity="0.35" stroke="#123f3a" strokeDasharray="3 5" />
          </g>
        )}
      </svg>
      <div className="visual-label">
        <span>{title}</span>
        <small>{variant === "earth" ? "Research atlas" : variant === "gemf" ? "Multimodal system" : "Verified project view"}</small>
      </div>
    </div>
  );
}
