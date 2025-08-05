import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components'; // 1. Importe styled-components

// Importe seus componentes de layout e páginas
import Header from "./layout/Header/Header";
import Footer from './layout/Footer/Footer';
import Home from "./pages/Home/Home";
import MapView from "./pages/Home/location/Location";
import News from './pages/News/News';
import Projects from './pages/Projects/Projects';
// 2. Crie um container para a aplicação com Flexbox
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Garante que o container ocupe no mínimo a altura total do ecrã */
`;

// 3. Faça a secção de conteúdo principal crescer para ocupar o espaço vazio
const MainContent = styled.main`
  flex-grow: 1;
`;

function App() {
  return (
    // 4. Envolva o seu layout com o novo container
    <AppContainer>
      <Header />
      <MainContent>
        <Routes>
          {/* Rota para a Página Inicial */}
          <Route 
            path="/" 
            element={
              <>
                <Home />
                <MapView />
              </>
            } 
          />
          
          {/* Rota para a Página de Notícias */}
          <Route path="/noticias" element={<News />} />
          <Route path="/projetos" element={<Projects />} />
        </Routes>
      </MainContent>
      <Footer />
    </AppContainer>
  );
}

export default App;