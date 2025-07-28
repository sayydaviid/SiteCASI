// src/App.jsx
import React from 'react';
import Header from "./layout/Header";
import Home from "./pages/Home";
import MapView from "./pages/Home/location/Location";
import Footer from './layout/Footer/Footer';
// ... seus outros imports

function App() {
  return (
    <>
      <Header />
      <Home />
      <MapView />
      <Footer />
      {/* resto das páginas / rotas */}
    </>
  );
}

export default App;
