// src/layout/Footer/Footer.jsx

import React from 'react';
import {
  FooterContainer,
  SocialLinks,
  CopyrightText
} from './Footer.styles';

// Importando os ícones desejados da biblioteca Font Awesome
import { FaInstagram, FaGithub, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <SocialLinks>
        <a 
          href="https://instagram.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label="Instagram"
        >
          <FaInstagram />
        </a>
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label="GitHub"
        >
          <FaGithub />
        </a>
        <a 
          href="mailto:contato@cbsi.com.br" 
          aria-label="Email"
        >
          <FaEnvelope />
        </a>
      </SocialLinks>
      <CopyrightText>
        © {currentYear} Centro Acadêmico de Sistemas de Informação (CBSI). Todos os direitos reservados.
      </CopyrightText>
    </FooterContainer>
  );
}