import React, { useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

const SkillTree = () => {
  const graphRef = useRef();

  const graphData = {
    nodes: [
      { id: "yo", nombre: "YO", nivel: 0 },
      { id: "cuerpo_1", nombre: "Fuerza Bruta", nivel: 1 },
      { id: "cuerpo_2", nombre: "Resistencia", nivel: 1 },
      { id: "mente_1", nombre: "Afinidad Arcana", nivel: 1 },
      { id: "mente_2", nombre: "Concentración", nivel: 1 },
      { id: "habilidad_1", nombre: "Golpe Poderoso", nivel: 2 },
      { id: "habilidad_2", nombre: "Armadura Mejorada", nivel: 2 },
      { id: "habilidad_3", nombre: "Bola de Fuego", nivel: 2 },
      { id: "habilidad_4", nombre: "Meditación", nivel: 2 }
    ],
    links: [
      { source: "yo", target: "cuerpo_1" },
      { source: "yo", target: "cuerpo_2" },
      { source: "yo", target: "mente_1" },
      { source: "yo", target: "mente_2" },
      { source: "cuerpo_1", target: "habilidad_1" },
      { source: "cuerpo_2", target: "habilidad_2" },
      { source: "mente_1", target: "habilidad_3" },
      { source: "mente_2", target: "habilidad_4" }
    ]
  };

  return (
    <div className="skill-tree-container">
      <div className="container">
        <div className="skill-tree-header">
          <h2>Árbol de Habilidades</h2>
          <p>Explora y desarrolla las habilidades de tu personaje</p>
        </div>
        <div className="graph-container">
          <ForceGraph2D
            ref={graphRef}
            graphData={graphData}
            nodeLabel={(node) => `${node.nombre} (Nivel ${node.nivel})`}
            nodeAutoColorBy="nivel"
            linkDirectionalArrowLength={6}
            linkDirectionalArrowRelPos={1}
            linkCurvature={0.1}
            width={800}
            height={600}
          />
        </div>
      </div>
    </div>
  );
};

export default SkillTree;