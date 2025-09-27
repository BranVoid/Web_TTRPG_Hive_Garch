import React, { useRef, useState, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

const SkillTree = () => {
  const graphRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);
  const [acquiredSkills, setAcquiredSkills] = useState(new Set(['yo']));

  // Categorías principales
  const CATEGORIAS = {
    CUERPO: { color: '#FF6B6B', nombre: 'Cuerpo' },
    MENTE: { color: '#4ECDC4', nombre: 'Mente' },
    ESPIRITU: { color: '#FFD166', nombre: 'Espíritu' },
    TECNICA: { color: '#06D6A0', nombre: 'Técnica' },
    INSTINTO: { color: '#118AB2', nombre: 'Instinto' },
    HIBRIDO: { color: '#8A2BE2', nombre: 'Híbrido' },
    base: { color: '#000000', nombre: 'Base' }
  };

  // Niveles de rareza
  const RAREZA = {
    COMUN: { color: '#B0B0B0' },
    INFRECUENTE: { color: '#2E8B57' },
    RARO: { color: '#4169E1' },
    EPICO: { color: '#8A2BE2' }
  };

  // Datos expandidos del árbol de habilidades
  const graphData = useMemo(() => {
    const nodes = [
      // Nodo central - YO
      { 
        id: "yo", 
        nombre: "YO", 
        nivel: 0, 
        categoria: "base", 
        rareza: "COMUN",
        descripcion: "Punto de partida de tu desarrollo",
        adquirible: false
      },

      // CAPA 1 - Talentos básicos
      { id: "cuerpo_1", nombre: "Fuerza Bruta", nivel: 1, categoria: "CUERPO", rareza: "COMUN", descripcion: "Aumenta tu capacidad física básica" },
      { id: "cuerpo_2", nombre: "Resistencia", nivel: 1, categoria: "CUERPO", rareza: "COMUN", descripcion: "Mejora tu aguante y vitalidad" },
      { id: "cuerpo_3", nombre: "Agilidad", nivel: 1, categoria: "CUERPO", rareza: "COMUN", descripcion: "Aumenta tu velocidad y reflejos" },
      { id: "cuerpo_4", nombre: "Robustez", nivel: 1, categoria: "CUERPO", rareza: "INFRECUENTE", descripcion: "Cuerpo especialmente resistente" },

      // Mente
      { id: "mente_1", nombre: "Afinidad Arcana", nivel: 1, categoria: "MENTE", rareza: "COMUN", descripcion: "Sensibilidad hacia las energías mágicas" },
      { id: "mente_2", nombre: "Concentración", nivel: 1, categoria: "MENTE", rareza: "COMUN", descripcion: "Capacidad de enfoque mental" },
      { id: "mente_3", nombre: "Memoria Eidética", nivel: 1, categoria: "MENTE", rareza: "RARO", descripcion: "Recuerdo perfecto de lo experimentado" },

      // Espíritu
      { id: "espiritu_1", nombre: "Voluntad Inquebrantable", nivel: 1, categoria: "ESPIRITU", rareza: "COMUN", descripcion: "Fuerza de voluntad excepcional" },
      { id: "espiritu_2", nombre: "Empatía", nivel: 1, categoria: "ESPIRITU", rareza: "COMUN", descripcion: "Conexión emocional con otros" },

      // Técnica
      { id: "tecnica_1", nombre: "Inventiva", nivel: 1, categoria: "TECNICA", rareza: "COMUN", descripcion: "Habilidad para crear y modificar objetos" },
      { id: "tecnica_2", nombre: "Estrategia", nivel: 1, categoria: "TECNICA", rareza: "COMUN", descripcion: "Pensamiento táctico y planificación" },

      // Instinto
      { id: "instinto_1", nombre: "Percepción Agudizada", nivel: 1, categoria: "INSTINTO", rareza: "COMUN", descripcion: "Sentidos más allá de lo normal" },
      { id: "instinto_2", nombre: "Sigilo Natural", nivel: 1, categoria: "INSTINTO", rareza: "COMUN", descripcion: "Movimiento silencioso y discreto" },

      // CAPA 2 - Habilidades avanzadas
      { id: "habilidad_1", nombre: "Golpe Poderoso", nivel: 2, categoria: "CUERPO", rareza: "INFRECUENTE", descripcion: "Ataque físico devastador", requisitos: ["cuerpo_1"] },
      { id: "habilidad_2", nombre: "Armadura Mejorada", nivel: 2, categoria: "CUERPO", rareza: "INFRECUENTE", descripcion: "Defensa corporal excepcional", requisitos: ["cuerpo_2"] },
      { id: "habilidad_3", nombre: "Bola de Fuego", nivel: 2, categoria: "MENTE", rareza: "INFRECUENTE", descripcion: "Conjuración elemental básica", requisitos: ["mente_1"] },
      { id: "habilidad_4", nombre: "Meditación Profunda", nivel: 2, categoria: "MENTE", rareza: "INFRECUENTE", descripcion: "Recuperación mental acelerada", requisitos: ["mente_2"] },
      
      // Habilidades híbridas
      { id: "hibrido_1", nombre: "Guerrero Arcano", nivel: 2, categoria: "HIBRIDO", rareza: "RARO", descripcion: "Combina fuerza física y magia", requisitos: ["cuerpo_1", "mente_1"] },
      { id: "hibrido_2", nombre: "Asesino Místico", nivel: 3, categoria: "HIBRIDO", rareza: "EPICO", descripcion: "Sigilo y magia de sombras", requisitos: ["instinto_2", "mente_1", "tecnica_1"] }
    ];

    const links = [
      // Conexiones desde YO hacia talentos básicos
      { source: "yo", target: "cuerpo_1" },
      { source: "yo", target: "cuerpo_2" },
      { source: "yo", target: "cuerpo_3" },
      { source: "yo", target: "cuerpo_4" },
      { source: "yo", target: "mente_1" },
      { source: "yo", target: "mente_2" },
      { source: "yo", target: "mente_3" },
      { source: "yo", target: "espiritu_1" },
      { source: "yo", target: "espiritu_2" },
      { source: "yo", target: "tecnica_1" },
      { source: "yo", target: "tecnica_2" },
      { source: "yo", target: "instinto_1" },
      { source: "yo", target: "instinto_2" },

      // Conexiones avanzadas
      { source: "cuerpo_1", target: "habilidad_1" },
      { source: "cuerpo_2", target: "habilidad_2" },
      { source: "mente_1", target: "habilidad_3" },
      { source: "mente_2", target: "habilidad_4" },
      
      // Conexiones híbridas
      { source: "cuerpo_1", target: "hibrido_1" },
      { source: "mente_1", target: "hibrido_1" },
      { source: "instinto_2", target: "hibrido_2" },
      { source: "mente_1", target: "hibrido_2" },
      { source: "tecnica_1", target: "hibrido_2" }
    ];

    return { nodes, links };
  }, []);

  // Verificar si un nodo puede ser adquirido
  const canAcquireSkill = (nodeId) => {
    if (acquiredSkills.has(nodeId)) return false;
    
    const node = graphData.nodes.find(n => n.id === nodeId);
    if (!node || !node.requisitos) return true;
    
    return node.requisitos.every(req => acquiredSkills.has(req));
  };

  // Adquirir una habilidad
  const acquireSkill = (nodeId) => {
    if (canAcquireSkill(nodeId)) {
      setAcquiredSkills(prev => new Set([...prev, nodeId]));
    }
  };

  // Función para determinar el color del nodo
  const getNodeColor = (node) => {
    if (node.id === 'yo') return '#000000';
    if (acquiredSkills.has(node.id)) {
      return CATEGORIAS[node.categoria]?.color || RAREZA[node.rareza].color;
    }
    return '#666666'; // No adquirido (más oscuro para mejor contraste)
  };

  // Tooltip mejorado
  const nodeLabel = (node) => {
    const adquirido = acquiredSkills.has(node.id);
    const puedeAdquirir = canAcquireSkill(node.id);
    
    let estado = adquirido ? '✅ Adquirido' : puedeAdquirir ? '🔓 Disponible' : '🔒 Bloqueado';
    
    return `
${node.nombre}
• Nivel: ${node.nivel}
• Categoría: ${CATEGORIAS[node.categoria]?.nombre || node.categoria}
• Rareza: ${node.rareza}
• ${node.descripcion}
• Estado: ${estado}
${node.requisitos ? `• Requisitos: ${node.requisitos.length} habilidades previas` : ''}
    `;
  };

  return (
    <div className="skill-tree-container">
      <div className="container">
        <div className="skill-tree-header">
          <h2>Esfera YO - Árbol de Habilidades</h2>
          <p>Desarrolla tu personaje de forma única. Habilidades adquiridas: <strong>{acquiredSkills.size - 1}</strong></p>
          
          {/* Leyenda interactiva */}
          <div style={{ 
            background: 'rgba(22, 33, 62, 0.8)', 
            padding: '15px', 
            borderRadius: '8px', 
            margin: '20px 0',
            border: '1px solid #0f3460'
          }}>
            <h4 style={{ color: '#e94560', marginBottom: '10px' }}>Leyenda del Árbol:</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
              {Object.entries(CATEGORIAS).map(([key, cat]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{
                    display: 'inline-block',
                    width: '12px',
                    height: '12px',
                    backgroundColor: cat.color,
                    borderRadius: '50%',
                    marginRight: '8px'
                  }}></span>
                  <span style={{ color: '#e6e6e6' }}>{cat.nombre}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
              {Object.entries(RAREZA).map(([key, rareza]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{
                    display: 'inline-block',
                    width: '12px',
                    height: '12px',
                    backgroundColor: rareza.color,
                    borderRadius: '2px',
                    marginRight: '8px'
                  }}></span>
                  <span style={{ color: '#e6e6e6' }}>{key}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="graph-container" style={{ height: '600px' }}>
          <ForceGraph2D
            ref={graphRef}
            graphData={graphData}
            nodeLabel={nodeLabel}
            nodeColor={(node) => getNodeColor(node)}
            nodeRelSize={8}
            linkDirectionalArrowLength={5}
            linkDirectionalArrowRelPos={1}
            linkCurvature={0.15}
            linkColor={() => 'rgba(255, 255, 255, 0.3)'}
            linkWidth={2}
            onNodeClick={(node) => {
              setSelectedNode(node);
              if (node.id !== 'yo' && canAcquireSkill(node.id)) {
                acquireSkill(node.id);
              }
            }}
            onNodeRightClick={(node) => {
              setSelectedNode(node);
            }}
            width={800}
            height={600}
          />
        </div>

        {/* Panel de información del nodo seleccionado */}
        {selectedNode && (
          <div style={{
            background: '#16213e',
            padding: '20px',
            borderRadius: '8px',
            marginTop: '20px',
            border: `2px solid ${CATEGORIAS[selectedNode.categoria]?.color || '#0f3460'}`,
            color: '#e6e6e6'
          }}>
            <h3 style={{ color: CATEGORIAS[selectedNode.categoria]?.color || '#e94560', marginBottom: '15px' }}>
              {selectedNode.nombre}
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <div>
                <p><strong>Categoría:</strong> {CATEGORIAS[selectedNode.categoria]?.nombre || selectedNode.categoria}</p>
                <p><strong>Nivel:</strong> {selectedNode.nivel}</p>
                <p><strong>Rareza:</strong> 
                  <span style={{ color: RAREZA[selectedNode.rareza].color, marginLeft: '5px' }}>
                    {selectedNode.rareza}
                  </span>
                </p>
              </div>
              
              <div>
                <p><strong>Descripción:</strong></p>
                <p style={{ fontStyle: 'italic' }}>{selectedNode.descripcion}</p>
              </div>
            </div>

            <p style={{ 
              marginTop: '10px',
              padding: '8px',
              background: acquiredSkills.has(selectedNode.id) ? '#2E8B57' : canAcquireSkill(selectedNode.id) ? '#4169E1' : '#B0B0B0',
              borderRadius: '4px',
              textAlign: 'center',
              fontWeight: 'bold'
            }}>
              {acquiredSkills.has(selectedNode.id) ? '✅ HABILIDAD ADQUIRIDA' : 
               canAcquireSkill(selectedNode.id) ? '🔓 DISPONIBLE PARA ADQUIRIR' : '🔒 BLOQUEADA'}
            </p>
            
            {selectedNode.requisitos && selectedNode.requisitos.length > 0 && (
              <div style={{ marginTop: '15px' }}>
                <strong>Requisitos:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
                  {selectedNode.requisitos.map(reqId => {
                    const reqNode = graphData.nodes.find(n => n.id === reqId);
                    const adquirido = acquiredSkills.has(reqId);
                    return (
                      <span key={reqId} style={{
                        padding: '5px 10px',
                        background: adquirido ? '#2E8B57' : '#B0B0B0',
                        borderRadius: '15px',
                        fontSize: '0.9em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        {reqNode?.nombre || reqId} {adquirido ? '✅' : '❌'}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedNode.id !== 'yo' && !acquiredSkills.has(selectedNode.id) && canAcquireSkill(selectedNode.id) && (
              <button 
                onClick={() => acquireSkill(selectedNode.id)}
                style={{
                  background: '#e94560',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: '15px',
                  fontWeight: 'bold',
                  width: '100%',
                  transition: 'background-color 0.3s'
                }}
                onMouseOver={(e) => e.target.style.background = '#d63447'}
                onMouseOut={(e) => e.target.style.background = '#e94560'}
              >
                🎯 Adquirir Habilidad
              </button>
            )}
          </div>
        )}

        {/* Instrucciones de uso */}
        <div style={{
          background: 'rgba(22, 33, 62, 0.6)',
          padding: '15px',
          borderRadius: '8px',
          marginTop: '20px',
          fontSize: '0.9em',
          color: '#cccccc'
        }}>
          <strong>💡 Cómo usar el árbol:</strong>
          <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
            <li>Haz <strong>clic izquierdo</strong> en un nodo para seleccionarlo y adquirirlo si está disponible</li>
            <li>Haz <strong>clic derecho</strong> en un nodo para ver información sin adquirirlo</li>
            <li>Los nodos <span style={{color: '#666666'}}>grises</span> están bloqueados hasta que cumplas los requisitos</li>
            <li>Arrastra el gráfico para navegar y usa la rueda del mouse para hacer zoom</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SkillTree;