// src/pages/Home/Home.jsx

import React, { useState, useMemo, useEffect, useRef } from 'react';
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

export default function Home() {
  // --- Projects Carousel ---
  const projects = useMemo(() => [
    {
      id: 1,
      title:
        'Using fuzzy link cost and dynamic choice of link quality metrics to achieve QoS and QoE in wireless mesh networks. Journal of Network and Computer Applications',
      date: '26 de Novembro de 2024',
      link: '#'
    },
    {
      id: 2,
      title:
        'A Scheduling Algorithm for Computational Grids that Minimizes Centralized Processing',
      date: '26 de Novembro de 2024',
      link: '#'
    },
    {
      id: 3,
      title:
        'Control of QoE based on Algorithms for the Disposal of Packets concerned with Streaming Video',
      date: '26 de Novembro de 2024',
      link: '#'
    },
    {
      id: 4,
      title:
        'A real-time video quality estimator for emerging wireless multimedia systems',
      date: '13 de Novembro de 2024',
      link: '#'
    },
    {
      id: 5,
      title: 'Novo Projeto sobre Inteligência Artificial e Redes Neurais',
      date: '10 de Outubro de 2024',
      link: '#'
    },
    {
      id: 6,
      title: 'Desenvolvimento de um Sistema de Baixa Latência para IoT',
      date: '05 de Setembro de 2024',
      link: '#'
    }
  ], []);

  const [current, setCurrent] = useState(0);
  const autoplayIntervalRef = useRef(null);

  const CARD_WIDTH = 300;
  const CARD_MARGIN_HORIZONTAL = 12;
  const cardFullWidth = CARD_WIDTH + CARD_MARGIN_HORIZONTAL * 2;
  const visibleCards = 3;
  const windowWidth = visibleCards * cardFullWidth;
  const maxIndex = Math.max(0, projects.length - visibleCards);
  const translate = -current * cardFullWidth;

  const startAutoplay = () => {
    clearInterval(autoplayIntervalRef.current);
    autoplayIntervalRef.current = setInterval(() => {
      setCurrent(prev => (prev === maxIndex ? 0 : prev + 1));
    }, 3000);
  };

  useEffect(() => {
    startAutoplay();
    return () => clearInterval(autoplayIntervalRef.current);
  }, [maxIndex]);

  const handleManualNavigation = direction => {
    clearInterval(autoplayIntervalRef.current);
    setCurrent(c =>
      direction === 'next' ? Math.min(c + 1, maxIndex) : Math.max(c - 1, 0)
    );
    setTimeout(startAutoplay, 5000);
  };

  return (
    <>
      <HomeContainer id = "home">
        <Hero>
          <h1>CASI</h1>
          <p>
            Centro Acadêmico de Sistemas de Informação da Universidade Federal do Pará
          </p>
        </Hero>

        <CarouselSection>
          <ArrowButton
            onClick={() => handleManualNavigation('prev')}
            disabled={current === 0}
          >
            ‹
          </ArrowButton>

          <CarouselWindow width={windowWidth}>
            <CarouselTrack translate={translate}>
              {projects.map(p => (
                <Card key={p.id}>
                  <h3>{p.title}</h3>
                  <div>
                    <span>{p.date}</span>
                    <a href={p.link}>Ler mais</a>
                  </div>
                </Card>
              ))}
            </CarouselTrack>
          </CarouselWindow>

          <ArrowButton
            onClick={() => handleManualNavigation('next')}
            disabled={current >= maxIndex}
          >
            ›
          </ArrowButton>
        </CarouselSection>
      </HomeContainer>

      <About />

      <Management />
    </>
  );
}
