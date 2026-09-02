export interface OrbitNode {
  x: number;
  y: number;
}

export interface OrbitGeometry {
  nodes: OrbitNode[];
  path: string;
}

export function getOrbitNodeYRadius(input: {
  svgWidth: number;
  svgHeight: number;
  xRadius: number;
}): number {
  if (input.svgHeight <= 0) return 0;

  return (
    input.xRadius *
    (input.svgWidth / 100) /
    (input.svgHeight / 1000)
  );
}

export function getOrbitGeometry(count: number): OrbitGeometry {
  if (count <= 0) {
    return {
      nodes: [],
      path: "M 50 0 L 50 1000",
    };
  }

  const spacing = 1000 / count;
  const controlOffset = spacing / 4;
  const nodes = Array.from({ length: count }, (_, index) => ({
    x: index % 2 === 0 ? 32 : 68,
    y: (index + 0.5) * spacing,
  }));
  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  const segments = [
    "M 50 0",
    `C 50 ${first.y - controlOffset} ${first.x} ${first.y - controlOffset} ${first.x} ${first.y}`,
    ...nodes.slice(1).map(
      (node) =>
        `S ${node.x} ${node.y - controlOffset} ${node.x} ${node.y}`,
    ),
    `C ${last.x} ${last.y + controlOffset} 50 ${last.y + controlOffset} 50 1000`,
  ];

  return {
    nodes,
    path: segments.join(" "),
  };
}
