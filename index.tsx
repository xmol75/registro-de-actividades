
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App'; // This should point to the new Surgical Logger App.tsx

const rootElement = document.getElementById('root');

if (!rootElement) {
  const errorMsg = "Error Crítico: No se pudo encontrar el elemento 'root' en el HTML. Verifica que tu index.html tenga un <div id=\"root\"></div> y que este script se ejecute después de que el DOM esté listo.";
  // Intenta mostrar el error en la página si es posible
  document.body.innerHTML = `<div style="padding: 20px; font-family: sans-serif; color: red; background-color: #ffebee; border: 1px solid red;">
    <h2>Error de Carga</h2>
    <p>${errorMsg}</p>
    <p>Por favor, revisa la consola del desarrollador (F12) para más detalles.</p>
  </div>`;
  console.error(errorMsg);
  throw new Error(errorMsg);
} else {
  rootElement.innerHTML = `<div style="padding: 20px; font-family: sans-serif; color: green; background-color: #e8f5e9; border: 1px solid green;">
    <h1>¡Prueba Exitosa!</h1>
    <p>El archivo index.tsx se ha cargado y ejecutado correctamente.</p>
    <p>El elemento 'root' fue encontrado.</p>
    <p>El siguiente paso es verificar la carga de React y el componente App.</p>
  </div>`;
  console.log("index.tsx ejecutado con éxito. Elemento 'root' encontrado:", rootElement);
}

// Comentamos la parte de React temporalmente:
// const root = ReactDOM.createRoot(rootElement);
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
