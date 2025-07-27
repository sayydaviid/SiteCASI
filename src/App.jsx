// src/App.jsx
import React from 'react';
import Header from "./layout/Header";
import Home from "./pages/Home";
// ... seus outros imports

function App() {
  return (
    <>
      <Header />
      <Home />
      {/* resto das páginas / rotas */}
    </>
  );
}

export default App;
