import { useState } from "react";
import ForceGraph2D from "react-force-graph-2d";

export default function SkillTreeBuilder() {
  const [selectedNodes, setSelectedNodes] = useState([]);

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

  const handleNodeClick = (node) => {
    if (!selectedNodes.includes(node.id)) {
      setSelectedNodes([...selectedNodes, node.id]);
    } else {
      setSelectedNodes(selectedNodes.filter((n) => n !== node.id));
    }
  };

  return (
    <div className="p-6 flex gap-6">
      <div style={{ flex: 1, height: "600px" }}>
        <h1 className="text-xl font-bold mb-2">Árbol de Habilidades (Constructor)</h1>
        <ForceGraph2D
          graphData={graphData}
          nodeLabel={(node) => `${node.nombre} (Nivel ${node.nivel})`}
          nodeAutoColorBy={(node) =>
            selectedNodes.includes(node.id) ? "green" : "nivel"
          }
          linkDirectionalArrowLength={6}
          onNodeClick={handleNodeClick}
        />
      </div>

      <div className="w-64 p-4 border rounded bg-gray-100">
        <h2 className="font-bold mb-2">Selección actual</h2>
        <ul className="list-disc pl-4">
          {selectedNodes.map((id) => (
            <li key={id}>{id}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
