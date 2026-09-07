export interface Project {
  id: string;
  title: string;
  category: string;
  impact: string;
  technologies: string[];
  demoUrl: string;
  githubUrl?: string;
  accent?: "violet" | "cyan" | "pink" | "teal";
}

export const projects: Project[] = [
  {
    id: "sample-orbital-relay",
    title: "Sample Project 1 — Orbital Relay",
    category: "Sample / Demo",
    impact: "Placeholder case study for the gallery data boundary; replace with a real project summary later.",
    technologies: ["Astro", "TypeScript", "Tailwind CSS"],
    demoUrl: "https://example.com/orbital-relay",
    accent: "violet",
  },
  {
    id: "sample-lunar-map",
    title: "Sample Project 2 — Lunar Map",
    category: "Sample / Demo",
    impact: "Placeholder for an interactive showcase entry with a clear, easy-to-edit demo link.",
    technologies: ["Svelte", "Motion", "SVG"],
    demoUrl: "https://example.com/lunar-map",
    accent: "cyan",
  },
  {
    id: "sample-starlane-archive",
    title: "Sample Project 3 — Starlane Archive",
    category: "Sample / Demo",
    impact: "Placeholder project used to validate multi-card gallery layouts and content rendering.",
    technologies: ["Astro", "Markdown", "Design Systems"],
    demoUrl: "https://example.com/starlane-archive",
    accent: "pink",
  },
  {
    id: "sample-aurora-console",
    title: "Sample Project 4 — Aurora Console",
    category: "Sample / Demo",
    impact: "Placeholder for a dashboard-style project that later tasks can replace with real content.",
    technologies: ["TypeScript", "Data Viz", "UI Engineering"],
    demoUrl: "https://example.com/aurora-console",
    accent: "teal",
  },
  {
    id: "sample-vector-harbor",
    title: "Sample Project 5 — Vector Harbor",
    category: "Sample / Demo",
    impact: "Placeholder entry reserved for the final gallery slot and future user-provided project details.",
    technologies: ["Accessibility", "Animation", "Performance"],
    demoUrl: "https://example.com/vector-harbor",
    accent: "violet",
  },
];
