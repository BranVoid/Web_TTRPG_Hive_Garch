import React, { useState, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

const SkillTreeConstructor = () => {
  const [nodes, setNodes] = useState([
    { id: "yo", nombre: "YO", nivel: 0, x: 400, y: 300 }
  ]);
  const [links, setLinks] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [newNodeName, setNewNodeName] = useState('');
  const graphRef = useRef();

  const addNode = () => {
    if (!selectedNode || !newNodeName) return;

    const newNodeId = `node_${Date.now()}`;
    const newLevel = nodes.find(n => n.id === selectedNode).nivel + 1;

    const newNode = {
      id: newNodeId,
      nombre: newNodeName,
      nivel: newLevel,
      x: Math.random() * 300 + 250,
      y: Math.random() * 200 + 200
    };

    setNodes([...nodes, newNode]);
    setLinks([...links, { source: selectedNode, target: newNodeId }]);
    setNewNodeName('');
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node.id);
  };

  const graphData = { nodes, links };

  return (
    <div className="skill-tree-container">
      <div className="container">
        <div className="skill-tree-header">
          <h2>Constructor de Árbol de Habilidades</h2>
          <p>Crea y personaliza tu propio árbol de habilidades</p>
        </div>

        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ flex: 1 }}>
            <h3>Controles</h3>
            <div className="form-group">
              <label>Nodo seleccionado: {selectedNode || 'Ninguno'}</label>
            </div>
            <div className="form-group">
              <label>Nombre del nuevo nodo:</label>
              <input
                type="text"
                value={newNodeName}
                onChange={(e) => setNewNodeName(e.target.value)}
              />
            </div>
            <button onClick={addNode} className="auth-button" disabled={!selectedNode || !newNodeName}>
              Añadir Nodo
            </button>
          </div>

          <div style={{ flex: 1 }}>
            <h3>Instrucciones</h3>
            <p>1. Selecciona un nodo haciendo clic en él</p>
            <p>2. Escribe el nombre del nuevo nodo</p>
            <p>3. Haz clic en "Añadir Nodo" para crear una nueva habilidad conectada</p>
          </div>
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
            onNodeClick={handleNodeClick}
            width={800}
            height={600}
          />
        </div>
      </div>
    </div>
  );
};

export default SkillTreeConstructor;