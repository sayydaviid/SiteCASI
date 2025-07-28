// src/pages/Home/Home.jsx

import React, { useState, useEffect, useRef } from 'react';
import {
  HomeContainer,
  Hero,
  CarouselSection,
  CarouselWindow,
  CarouselTrack,
  Card,
  ArrowButton
} from './Home.styles.js';

import About from './about/about.jsx';
import Management from './management/management.jsx';

// Chave para salvar e ler os posts do cache do navegador
const CACHE_KEY = 'cached-insta-posts';

// Função auxiliar para limitar o tamanho do texto
function truncate(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Começa como true para a busca inicial

  useEffect(() => {
    // Tenta carregar os posts do cache local imediatamente ao iniciar
    try {
      const cachedPosts = localStorage.getItem(CACHE_KEY);
      if (cachedPosts) {
        setPosts(JSON.parse(cachedPosts));
        setIsLoading(false); // Já temos algo para mostrar, então paramos o loading inicial
      }
    } catch (error) {
      console.error("Falha ao ler posts do cache:", error);
    }

    // Função para buscar novos posts do backend
    async function fetchAndUpdatePosts() {
      try {
        const response = await fetch('http://localhost:3001/api/instagram/combined-feed?user1=casi.ufpa&user2=computacaoufpa');
        if (!response.ok) {
          throw new Error('A resposta da rede não foi bem-sucedida.');
        }
        const data = await response.json();
        
        // Se a API retornar dados válidos, atualizamos o estado e o cache
        if (data && data.length > 0) {
          const postsWithId = data.map((post, index) => ({ ...post, id: post.link || index }));
          setPosts(postsWithId);
          localStorage.setItem(CACHE_KEY, JSON.stringify(postsWithId));
        }
      } catch (e) {
        // Se a busca falhar, o console registrará o erro, mas o usuário continuará vendo
        // os posts do cache, se existirem. Nenhuma ação extra é necessária.
        console.error("Não foi possível buscar novos posts. Usando dados do cache, se disponíveis.", e);
      } finally {
        // Garante que o estado de loading seja falso no final, mesmo que a busca falhe.
        setIsLoading(false);
      }
    }

    fetchAndUpdatePosts();
  }, []); // O array vazio [] garante que o efeito rode apenas uma vez

  // --- Lógica do Carrossel ---
  const [current, setCurrent] = useState(0);
  const autoplayIntervalRef = useRef(null);

  const CARD_WIDTH = 300;
  const CARD_MARGIN_HORIZONTAL = 12;
  const cardFullWidth = CARD_WIDTH + CARD_MARGIN_HORIZONTAL * 2;
  const visibleCards = 3;
  const windowWidth = visibleCards * cardFullWidth;
  const maxIndex = Math.max(0, posts.length - visibleCards);
  const translate = -current * cardFullWidth;

  const startAutoplay = () => {
    clearInterval(autoplayIntervalRef.current);
    if (posts.length > visibleCards) {
      autoplayIntervalRef.current = setInterval(() => {
        setCurrent(prev => (prev >= maxIndex ? 0 : prev + 1));
      }, 3000);
    }
  };

  useEffect(() => {
    startAutoplay();
    return () => clearInterval(autoplayIntervalRef.current);
  }, [posts, maxIndex]);

  const handleManualNavigation = direction => {
    clearInterval(autoplayIntervalRef.current);
    setCurrent(c =>
      direction === 'next' ? Math.min(c + 1, maxIndex) : Math.max(c - 1, 0)
    );
    setTimeout(startAutoplay, 5000);
  };

  const renderCarouselContent = () => {
    // Se está carregando e não há nada no cache, mostra a mensagem
    if (isLoading && posts.length === 0) {
      return <p style={{ color: 'white', textAlign: 'center', width: '100%' }}>Carregando novidades...</p>;
    }
    // Se não está carregando e mesmo assim não há posts, mostra mensagem de "não encontrado"
    if (!isLoading && posts.length === 0) {
        return <p style={{ color: 'white', textAlign: 'center', width: '100%' }}>Nenhuma publicação encontrada.</p>;
    }
    
    return posts.map(p => (
      <Card key={p.id}>
        <h3>{truncate(p.caption, 120)}</h3>
        <div>
          <span>{p.date}</span>
          <a href={p.link} target="_blank" rel="noopener noreferrer">Ler mais</a>
        </div>
      </Card>
    ));
  };

  return (
    <>
      <HomeContainer id="home">
        <Hero>
          <h1>CASI</h1>
          <p>
            Centro Acadêmico de Sistemas de Informação da Universidade Federal do Pará
          </p>
        </Hero>

        <CarouselSection>
          <ArrowButton onClick={() => handleManualNavigation('prev')} disabled={current === 0}>
            ‹
          </ArrowButton>
          <CarouselWindow width={windowWidth}>
            <CarouselTrack translate={translate}>
              {renderCarouselContent()}
            </CarouselTrack>
          </CarouselWindow>
          <ArrowButton onClick={() => handleManualNavigation('next')} disabled={current >= maxIndex || posts.length <= visibleCards}>
            ›
          </ArrowButton>
        </CarouselSection>
      </HomeContainer>

      <About />
      <Management />
    </>
  );
}