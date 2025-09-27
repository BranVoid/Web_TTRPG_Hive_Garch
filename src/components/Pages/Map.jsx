import React, { useState, useRef } from 'react';

const Map = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const mapRef = useRef();

  // Datos de las ubicaciones del mapa
  const locations = [
    {
      id: 1,
      name: "Bosque de los Susurros",
      type: "Bosque",
      level: "1-10",
      description: "Un bosque antiguo donde los árboles parecen hablar entre sí. Ideal para nuevos aventureros.",
      x: 25,
      y: 30,
      color: "#2E8B57"
    },
    {
      id: 2,
      name: "Montañas del Alba",
      type: "Montaña",
      level: "15-25",
      description: "Picos nevados que tocan el cielo. Hogar de criaturas poderosas y tesoros antiguos.",
      x: 60,
      y: 15,
      color: "#8B4513"
    },
    {
      id: 3,
      name: "Ciudad de Garch",
      type: "Ciudad",
      level: "Seguro",
      description: "La capital de La Colmena. Centro de comercio y punto de encuentro de aventureros.",
      x: 45,
      y: 50,
      color: "#4169E1"
    },
    {
      id: 4,
      name: "Desierto de las Almas",
      type: "Desierto",
      level: "30-40",
      description: "Un vasto desierto donde el sol nunca perdona. Tesoros ancestrales esperan bajo la arena.",
      x: 15,
      y: 70,
      color: "#DAA520"
    },
    {
      id: 5,
      name: "Islas del Mistério",
      type: "Archipiélago",
      level: "40-50",
      description: "Islas rodeadas de niebla eterna. Solo los más valientes se atreven a explorarlas.",
      x: 80,
      y: 40,
      color: "#4682B4"
    },
    {
      id: 6,
      name: "Pantano de las Sombras",
      type: "Pantano",
      level: "20-30",
      description: "Un lugar oscuro y húmedo donde la luz parece no poder entrar.",
      x: 35,
      y: 65,
      color: "#2F4F4F"
    }
  ];

  const handleMapClick = (e) => {
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Encontrar la ubicación más cercana (dentro de un radio de 5%)
    const clickedLocation = locations.find(loc => 
      Math.abs(loc.x - x) < 5 && Math.abs(loc.y - y) < 5
    );

    if (clickedLocation) {
      setSelectedLocation(clickedLocation);
      setPopupPosition({ x: e.clientX, y: e.clientY });
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedLocation(null);
  };

  return (
    <div className="map-container">
      <div className="container">
        <div className="map-header">
          <h2>Mapa de La Colmena de Garch</h2>
          <p>Explora el mundo y descubre nuevas aventuras. Haz clic en los puntos del mapa para obtener información.</p>
        </div>

        <div className="map-content">
          <div 
            ref={mapRef}
            className="map-image-container"
            onClick={handleMapClick}
            style={{ position: 'relative', cursor: 'pointer' }}
          >
            {/* Imagen del mapa - reemplaza con tu imagen PNG */}
            <div style={{
              width: '100%',
              height: '600px',
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              border: '3px solid #0f3460',
              borderRadius: '10px',
              position: 'relative',
              backgroundImage: 'url("/mapa-colmena.png")', // Tu imagen PNG
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}>
              {/* Si no tienes la imagen, muestra un placeholder */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: '#cccccc',
                fontSize: '1.2rem',
                textAlign: 'center',
                padding: '2rem'
              }}>
                {!selectedLocation && (
                  <div>
                    <p>🌍 Mapa de La Colmena de Garch</p>
                    <p>Haz clic en los puntos de interés para explorar</p>
                  </div>
                )}
              </div>

              {/* Puntos de interés en el mapa */}
              {locations.map(location => (
                <div
                  key={location.id}
                  style={{
                    position: 'absolute',
                    left: `${location.x}%`,
                    top: `${location.y}%`,
                    width: '20px',
                    height: '20px',
                    backgroundColor: location.color,
                    borderRadius: '50%',
                    border: '3px solid white',
                    cursor: 'pointer',
                    transform: 'translate(-50%, -50%)',
                    boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translate(-50%, -50%) scale(1.3)';
                    e.target.style.zIndex = '10';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translate(-50%, -50%) scale(1)';
                    e.target.style.zIndex = '1';
                  }}
                  title={location.name}
                />
              ))}
            </div>
          </div>

          {/* Leyenda del mapa */}
          <div className="map-legend">
            <h4>Leyenda del Mapa:</h4>
            <div className="legend-items">
              {locations.map(location => (
                <div key={location.id} className="legend-item">
                  <span 
                    className="legend-color" 
                    style={{ backgroundColor: location.color }}
                  ></span>
                  <span className="legend-text">{location.name} (Nv. {location.level})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Popup de información de ubicación */}
        {showPopup && selectedLocation && (
          <div 
            className="location-popup"
            style={{
              position: 'fixed',
              left: `${popupPosition.x + 20}px`,
              top: `${popupPosition.y}px`,
              transform: 'translateY(-50%)',
              zIndex: 1000
            }}
          >
            <div className="popup-content">
              <button 
                className="popup-close"
                onClick={closePopup}
              >
                ×
              </button>
              <h3>{selectedLocation.name}</h3>
              <div className="location-details">
                <p><strong>Tipo:</strong> {selectedLocation.type}</p>
                <p><strong>Nivel Recomendado:</strong> {selectedLocation.level}</p>
                <p><strong>Descripción:</strong> {selectedLocation.description}</p>
              </div>
              <button className="auth-button" style={{ marginTop: '1rem' }}>
                Viajar a {selectedLocation.name}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Map;