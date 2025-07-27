// src/pages/Home/Management/management.jsx

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ResearchSection,
  ResearchCarouselSection,
  ResearchWindow,
  ResearchTrack,
  ResearchCard
} from './management.styles.js';
import { ArrowButton } from '../Home.styles.js';  // importa a estilização das setas
import { FaCube, FaWifi, FaSitemap, FaAtom } from 'react-icons/fa';

export default function Management() {
  const researchLines = useMemo(() => [
    { id: 'blockchain', icon: FaCube, title: 'Blockchain', description: 'Blockchain é uma tecnologia descentralizada de registro, transparente e segura por meio de blocos encadeados.' },
    { id: 'iot', icon: FaWifi, title: 'IoT', description: 'IoT conecta dispositivos, coletando e compartilhando dados para melhorar eficiência, automação e interação entre objetos.' },
    { id: 'sdn', icon: FaSitemap, title: 'SDN', description: 'Redes Definidas por Software permite gerenciamento centralizado e flexibilidade para otimizar o tráfego e recursos.' },
    { id: 'quantum', icon: FaAtom, title: 'Redes Quânticas', description: 'A internet quântica utiliza estados quânticos para comunicação ultra-segura e processamento avançado de informações.' },
    { id: 'ml', icon: FaAtom, title: 'Machine Learning', description: 'Técnicas de aprendizado de máquina para análise de dados e predição de comportamentos em larga escala.' },
  ], []);

  const [currentRes, setCurrentRes] = useState(0);
  const resAutoplayRef = useRef(null);

  const RES_CARD_WIDTH = 280;
  const RES_GAP = 32;
  const resCardFull = RES_CARD_WIDTH + RES_GAP;
  const RES_VISIBLE = 4;
  const resMaxIndex = Math.max(0, researchLines.length - RES_VISIBLE);
  const resTranslate = -currentRes * resCardFull;
  const resWindowWidth = RES_VISIBLE * resCardFull;

  const startResAutoplay = () => {
    clearInterval(resAutoplayRef.current);
    resAutoplayRef.current = setInterval(() => {
      setCurrentRes(c => (c === resMaxIndex ? 0 : c + 1));
    }, 3000);
  };

  useEffect(() => {
    startResAutoplay();
    return () => clearInterval(resAutoplayRef.current);
  }, [resMaxIndex]);

  const handleResNav = (direction) => {
    clearInterval(resAutoplayRef.current);
    setCurrentRes(c =>
      direction === 'next'
        ? Math.min(c + 1, resMaxIndex)
        : Math.max(c - 1, 0)
    );
    setTimeout(startResAutoplay, 5000);
  };

  return (
    <ResearchSection id="gestao-atual">
      <h2>Gestão Atual</h2>
      <p>
       Nosso Centro Acadêmico reúne um grupo de estudantes comprometidos em promover a qualidade de vida discente e preservar um ambiente acadêmico inclusivo, colaborativo e de excelência para toda a comunidade universitária.
      </p>

      <ResearchCarouselSection>
        <ArrowButton
          onClick={() => handleResNav('prev')}
          disabled={currentRes === 0}
        >
          ‹
        </ArrowButton>

        <ResearchWindow width={resWindowWidth}>
          <ResearchTrack translate={resTranslate}>
            {researchLines.map(line => (
              <ResearchCard key={line.id}>
                <line.icon className="icon" />
                <h3>{line.title}</h3>
                <p>{line.description}</p>
                <a href="#">Saiba mais ›</a>
              </ResearchCard>
            ))}
          </ResearchTrack>
        </ResearchWindow>

        <ArrowButton
          onClick={() => handleResNav('next')}
          disabled={currentRes >= resMaxIndex}
        >
          ›
        </ArrowButton>
      </ResearchCarouselSection>
    </ResearchSection>
  );
}
