import React, { useState, useRef, useCallback, useEffect } from 'react';

const Map = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [visitedLocations, setVisitedLocations] = useState(new Set());
  const [activeFilter, setActiveFilter] = useState('TODOS');
  const mapContainerRef = useRef();
  const mapImageRef = useRef();

  // Datos expandidos de las ubicaciones del mapa
  const locations = [
    {
      id: 1,
      name: "Bosque de los Susurros",
      type: "BOSQUE",
      level: "1-10",
      description: "Un bosque antiguo donde los árboles parecen hablar entre sí. Ideal para nuevos aventureros.",
      lore: "Se dice que los árboles aquí guardan secretos ancestrales de la Colmena.",
      rewards: "Hierbas raras, madera encantada",
      x: 25,
      y: 30,
      color: "#2E8B57",
      icon: "🌳"
    },
    {
      id: 2,
      name: "Montañas del Alba",
      type: "MONTAÑA",
      level: "15-25",
      description: "Picos nevados que tocan el cielo. Hogar de criaturas poderosas y tesoros antiguos.",
      lore: "Las cumbres nunca conquistadas esconden la entrada a la Forja de los Dioses.",
      rewards: "Minerales raros, artefactos ancestrales",
      x: 60,
      y: 15,
      color: "#8B4513",
      icon: "⛰️"
    },
    {
      id: 3,
      name: "Ciudad de Garch",
      type: "CIUDAD",
      level: "SEGURO",
      description: "La capital de La Colmena. Centro de comercio y punto de encuentro de aventureros.",
      lore: "Fundada sobre las ruinas de una civilización antigua, ahora es el corazón del mundo conocido.",
      rewards: "Comercio, misiones, entrenamiento",
      x: 45,
      y: 50,
      color: "#4169E1",
      icon: "🏰"
    },
    {
      id: 4,
      name: "Desierto de las Almas",
      type: "DESIERTO",
      level: "30-40",
      description: "Un vasto desierto donde el sol nunca perdona. Tesoros ancestrales esperan bajo la arena.",
      lore: "Antiguo lecho marino que esconde ciudades sumergidas y criaturas del abismo.",
      rewards: "Reliquias antiguas, gemas del desierto",
      x: 15,
      y: 70,
      color: "#DAA520",
      icon: "🏜️"
    },
    {
      id: 5,
      name: "Islas del Misterio",
      type: "ARCHIPIÉLAGO",
      level: "40-50",
      description: "Islas rodeadas de niebla eterna. Solo los más valientes se atreven a explorarlas.",
      lore: "Las islas cambian de posición con las fases de la luna. Nadie ha cartografiado todas.",
      rewards: "Tesoros piratas, conocimientos perdidos",
      x: 80,
      y: 40,
      color: "#4682B4",
      icon: "🏝️"
    },
    {
      id: 6,
      name: "Pantano de las Sombras",
      type: "PANTANO",
      level: "20-30",
      description: "Un lugar oscuro y húmedo donde la luz parece no poder entrar.",
      lore: "Las aguas estancadas esconden secretos de magia prohibida y juramentos olvidados.",
      rewards: "Componentes alquímicos, huevos de criaturas",
      x: 35,
      y: 65,
      color: "#2F4F4F",
      icon: "🐊"
    },
    {
      id: 7,
      name: "Valle de los Suspiros",
      type: "VALLE",
      level: "10-20",
      description: "Un valle tranquilo donde el viento susurra historias del pasado.",
      lore: "Aquí meditan los monjes del Silencio Eterno, guardianes del equilibrio.",
      rewards: "Pergaminos de sabiduría, hierbas medicinales",
      x: 70,
      y: 60,
      color: "#6A5ACD",
      icon: "🌄"
    },
    {
      id: 8,
      name: "Cavernas Cristalinas",
      type: "CAVERNA",
      level: "35-45",
      description: "Cuevas que brillan con la luz de cristales mágicos. Peligrosas pero hermosas.",
      lore: "Los cristales crecen alimentándose de energía arcana. Algunos dicen que están vivos.",
      rewards: "Cristales mágicos, geodos raros",
      x: 55,
      y: 25,
      color: "#9370DB",
      icon: "💎"
    }
  ];

  // Filtros por tipo
  const locationTypes = ['TODOS', ...new Set(locations.map(loc => loc.type))];

  // Filtrar ubicaciones según el tipo activo
  const filteredLocations = activeFilter === 'TODOS' 
    ? locations 
    : locations.filter(loc => loc.type === activeFilter);

  // Funciones de zoom mejoradas
  const zoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom * 1.3, 4));
  };

  const zoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom / 1.3, 0.3));
  };

  const resetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // Zoom con rueda del mouse
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const zoomIntensity = 0.1;
    const newZoom = e.deltaY < 0 
      ? Math.min(zoom * (1 + zoomIntensity), 4)
      : Math.max(zoom * (1 - zoomIntensity), 0.3);
    
    setZoom(newZoom);
  }, [zoom]);

  // Funciones de arrastre mejoradas
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    e.currentTarget.style.cursor = 'grabbing';
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Limitar el movimiento de forma más natural
    const maxMove = 200 * (zoom - 1);
    setPosition({
      x: Math.max(Math.min(newX, maxMove), -maxMove),
      y: Math.max(Math.min(newY, maxMove), -maxMove)
    });
  }, [isDragging, dragStart, zoom]);

  const handleMouseUp = () => {
    setIsDragging(false);
    if (mapContainerRef.current) {
      mapContainerRef.current.style.cursor = 'grab';
    }
  };

  // Manejar clic en el mapa mejorado
  const handleMapClick = (e) => {
    if (isDragging) return;

    const rect = mapImageRef.current.getBoundingClientRect();
    const scale = zoom;
    const offsetX = position.x;
    const offsetY = position.y;
    
    const x = ((e.clientX - rect.left - offsetX) / (rect.width * scale)) * 100;
    const y = ((e.clientY - rect.top - offsetY) / (rect.height * scale)) * 100;

    const clickedLocation = locations.find(loc => 
      Math.sqrt(Math.pow(loc.x - x, 2) + Math.pow(loc.y - y, 2)) < 4
    );

    if (clickedLocation) {
      setSelectedLocation(clickedLocation);
      
      // Posicionar el popup para que no se salga de la pantalla
      const viewportWidth = window.innerWidth;
      const popupWidth = 320;
      const popupX = e.clientX + popupWidth > viewportWidth - 20 
        ? e.clientX - popupWidth - 10 
        : e.clientX + 20;
      
      setPopupPosition({ 
        x: popupX, 
        y: Math.min(e.clientY, window.innerHeight - 300) 
      });
      setShowPopup(true);
      
      // Marcar como visitada
      if (!visitedLocations.has(clickedLocation.id)) {
        setVisitedLocations(prev => new Set([...prev, clickedLocation.id]));
      }
    } else {
      setShowPopup(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedLocation(null);
  };

  // Viajar a una ubicación
  const travelToLocation = () => {
    if (selectedLocation) {
      alert(`¡Viajando a ${selectedLocation.name}! La aventura comienza...`);
      closePopup();
    }
  };

  // Efectos para event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove]);

  // Agregar listener para la rueda del mouse
  useEffect(() => {
    const mapContainer = mapContainerRef.current;
    if (mapContainer) {
      mapContainer.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (mapContainer) {
        mapContainer.removeEventListener('wheel', handleWheel);
      }
    };
  }, [handleWheel]);

  return (
    <div className="map-container">
      <div className="container">
        <div className="map-header">
          <h2>🗺️ Mapa de La Colmena de Garch</h2>
          <p>Explora el mundo y descubre nuevas aventuras. {visitedLocations.size > 0 && 
            <span className="visited-count">Lugares descubiertos: {visitedLocations.size}/{locations.length}</span>}
          </p>
        </div>

        {/* Controles del mapa */}
        <div className="map-controls">
          <div className="controls-left">
            <div className="zoom-controls">
              <button onClick={zoomOut} className="zoom-button" title="Alejar">−</button>
              <span className="zoom-level">{Math.round(zoom * 100)}%</span>
              <button onClick={zoomIn} className="zoom-button" title="Acercar">+</button>
              <button onClick={resetZoom} className="reset-button" title="Restablecer vista">⟲</button>
            </div>
            
            <div className="filter-controls">
              <span>Filtrar por tipo:</span>
              <select 
                value={activeFilter} 
                onChange={(e) => setActiveFilter(e.target.value)}
                className="filter-select"
              >
                {locationTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="map-instructions">
            <span>🎯 Haz clic en los iconos para explorar • 🖱️ Rueda para zoom • Arrastra para moverte</span>
          </div>
        </div>

        {/* Contenedor principal del mapa */}
        <div className="map-content-wrapper">
          <div 
            ref={mapContainerRef}
            className="map-image-container"
            onMouseDown={handleMouseDown}
            onClick={handleMapClick}
          >
            <div 
              ref={mapImageRef}
              className="map-image"
              style={{
                transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.1s ease'
              }}
            >
              {/* Fondo del mapa */}
              <div className="map-background">
                {/* Puntos de interés en el mapa */}
                {filteredLocations.map(location => {
                  const isVisited = visitedLocations.has(location.id);
                  const isSelected = selectedLocation?.id === location.id;
                  
                  return (
                    <div
                      key={location.id}
                      className={`map-location ${isVisited ? 'visited' : ''} ${isSelected ? 'selected' : ''}`}
                      style={{
                        left: `${location.x}%`,
                        top: `${location.y}%`,
                        backgroundColor: location.color,
                        borderColor: isSelected ? '#fff' : location.color,
                        transform: `scale(${isSelected ? 1.3 : 1})`
                      }}
                      title={`${location.name} (Nivel ${location.level})`}
                    >
                      <span className="location-icon">{location.icon}</span>
                      {isVisited && <div className="visited-badge">✓</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Leyenda del mapa */}
          <div className="map-legend">
            <h4>📋 Leyenda del Mapa</h4>
            <div className="legend-grid">
              {locationTypes.filter(type => type !== 'TODOS').map(type => {
                const typeLocations = locations.filter(loc => loc.type === type);
                if (typeLocations.length === 0) return null;
                
                return (
                  <div key={type} className="legend-category">
                    <h5>{type}</h5>
                    <div className="legend-items">
                      {typeLocations.map(location => (
                        <div key={location.id} className="legend-item">
                          <span 
                            className="legend-color" 
                            style={{ backgroundColor: location.color }}
                          ></span>
                          <div className="legend-text">
                            <span className="legend-name">{location.name}</span>
                            <span className="legend-level">Nv. {location.level}</span>
                          </div>
                          {visitedLocations.has(location.id) && 
                            <span className="visited-indicator">✓</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Popup de información de ubicación */}
        {showPopup && selectedLocation && (
          <div 
            className="location-popup"
            style={{
              left: `${popupPosition.x}px`,
              top: `${popupPosition.y}px`
            }}
          >
            <div className="popup-content">
              <button 
                className="popup-close"
                onClick={closePopup}
                title="Cerrar"
              >
                ×
              </button>
              
              <div className="popup-header">
                <span className="location-icon">{selectedLocation.icon}</span>
                <div>
                  <h3>{selectedLocation.name}</h3>
                  <div className="location-meta">
                    <span className="location-type">{selectedLocation.type}</span>
                    <span className="location-level">Nivel {selectedLocation.level}</span>
                    {visitedLocations.has(selectedLocation.id) && 
                      <span className="visited-tag">✅ Visitado</span>}
                  </div>
                </div>
              </div>
              
              <div className="location-details">
                <p className="location-description">{selectedLocation.description}</p>
                
                <div className="location-info">
                  <div className="info-section">
                    <h4>📖 Lore</h4>
                    <p>{selectedLocation.lore}</p>
                  </div>
                  
                  <div className="info-section">
                    <h4>💰 Recompensas</h4>
                    <p>{selectedLocation.rewards}</p>
                  </div>
                </div>
              </div>
              
              <div className="popup-actions">
                <button 
                  onClick={travelToLocation}
                  className="travel-button"
                  disabled={selectedLocation.level === 'SEGURO' ? false : parseInt(selectedLocation.level.split('-')[0]) > 10}
                >
                  {selectedLocation.level === 'SEGURO' ? '🏃 Viajar' : '⚔️ Aventurarse'}
                </button>
                
                {selectedLocation.level !== 'SEGURO' && 
                  parseInt(selectedLocation.level.split('-')[0]) > 10 && (
                  <span className="level-warning">
                    Nivel recomendado: {selectedLocation.level}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Map;