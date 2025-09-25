import React from 'react'

const Loading = () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: '#1a1a2e',
      color: '#e94560',
      fontSize: '1.2rem'
    }}>
      <div>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          Cargando La Colmena de Garch...
        </div>
        <div style={{ 
          width: '50px', 
          height: '50px', 
          border: '3px solid #e94560',
          borderTop: '3px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }}></div>
      </div>
      
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  )
}

export default Loading