import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // This should point to the Surgical Logger App.tsx

const rootElement = document.getElementById('root');

if (!rootElement) {
  const errorMsg = "Error Crítico: No se pudo encontrar el elemento 'root' en el HTML. Verifica que tu index.html tenga un <div id=\"root\"></div> y que este script se ejecute después de que el DOM esté listo.";
  document.body.innerHTML = `<div style="padding: 20px; font-family: sans-serif; color: red; background-color: #ffebee; border: 1px solid red;">
    <h2>Error de Carga Crítico</h2>
    <p>${errorMsg}</p>
    <p>Por favor, revisa la consola del desarrollador (F12) para más detalles.</p>
  </div>`;
  console.error(errorMsg);
  throw new Error(errorMsg);
} else {
  // Ahora intentamos renderizar la aplicación React
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Aplicación React renderizada o en proceso de renderización.");
  } catch (error) {
    console.error("Error al intentar renderizar la aplicación React:", error);
    rootElement.innerHTML = `<div style="padding: 20px; font-family: sans-serif; color: red; background-color: #ffebee; border: 1px solid red;">
      <h2>Error al Renderizar React</h2>
      <p>Ocurrió un error al iniciar la aplicación React.</p>
      <p><strong>Mensaje:</strong> ${(error as Error).message}</p>
      <p>Por favor, revisa la consola del desarrollador (F12) para ver el stack trace completo y más detalles.</p>
    </div>`;
  }
}
