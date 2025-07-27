// src/pages/Home/about/About.jsx

import React from 'react';
import {
  AboutSection,
  AboutContent,
  TextColumn,
  ImageColumn
} from './about.styles.js';      // ← IMPORT DO ARQUIVO CERTO
import networkImage from '../../../assets/images/cbsi.png';

export default function About() {
  return (
    <AboutSection id = "sobre">
      <AboutContent>
        <TextColumn>
          <h2>Sobre</h2>
          <p>
            Fundado em 2022 pela gestão Ada Lovelance, o Centro Acadêmico de Sistemas de Informação
            passou por significativas melhorias sob a presidência de Mayara Lima. Atualmente,
            a chapa Ada Lovelance 2025 conduz as atividades do CA e já iniciou o processo eleitoral
            para eleger a próxima gestão.
          </p>
        </TextColumn>
        <ImageColumn>
          <img
            src={networkImage}
            alt="Grafo representando a rede de pesquisa GERCOM"
          />
        </ImageColumn>
      </AboutContent>
    </AboutSection>
  );
}
