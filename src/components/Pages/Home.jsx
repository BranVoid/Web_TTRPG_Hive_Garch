import React from 'react';

const Home = () => {
  return (
    <div className="home-container">
      <div className="container">
        <div className="home-header">
          <h1>La Colmena de Garch</h1>
          <p>Un mundo de fantasía donde tus decisiones moldean tu destino</p>
        </div>
        <div className="home-content">
          <div className="info-card">
            <h3>¿Qué es La Colmena de Garch?</h3>
            <p>La Colmena de Garch es un TTRPG (Tabletop Role-Playing Game) ambientado en un mundo de fantasía único donde los jugadores pueden explorar, combatir y desarrollar sus personajes a través de un sistema de habilidades dinámico.</p>
          </div>
          <div className="info-card">
            <h3>El Sistema de Habilidades</h3>
            <p>Nuestro sistema de árbol de habilidades permite a los jugadores personalizar completamente a sus personajes. Comenzando desde el centro (YO), puedes expandir tus habilidades en diferentes direcciones según tu estilo de juego.</p>
          </div>
          <div className="info-card">
            <h3>Explora el Mundo</h3>
            <p>Desde las majestuosas montañas del Norte hasta los oscuros bosques del Sur, La Colmena de Garch ofrece un mundo vasto y diverso lleno de secretos por descubrir y desafíos por superar.</p>
          </div>
          <div className="info-card">
            <h3>Únete a la Aventura</h3>
            <p>Crea tu personaje, desarrolla tus habilidades y únete a otros jugadores en épicas aventuras que pondrán a prueba tu ingenio, valor y determinación.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;