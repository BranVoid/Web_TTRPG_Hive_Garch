import ForceGraph2D from "react-force-graph-2d";

export default function SkillTreeStatic() {
  const graphData = {
    nodes: [
      { id: "yo", nombre: "YO", nivel: 0 },
      { id: "cuerpo_1", nombre: "Fuerza Bruta", nivel: 1 },
      { id: "mente_1", nombre: "Afinidad Arcana", nivel: 1 }
    ],
    links: [
      { source: "yo", target: "cuerpo_1" },
      { source: "yo", target: "mente_1" }
    ]
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Árbol de Habilidades (Estático)</h1>
      <div style={{ height: "600px" }}>
        <ForceGraph2D
          graphData={graphData}
          nodeLabel={(node) => `${node.nombre} (Nivel ${node.nivel})`}
          nodeAutoColorBy="nivel"
          linkDirectionalArrowLength={6}
        />
      </div>
    </div>
  );
}
