// src/layout/Footer/Footer.styles.js

import styled from 'styled-components';

export const FooterContainer = styled.footer`
  width: 100%;
  padding: 2rem 1rem;
  background-color: #343a40; /* Um cinza escuro e profissional */
  color: #f8f9fa; /* Texto quase branco */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

export const SocialLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;

  a {
    color: #f8f9fa;
    font-size: 1.75rem; /* Tamanho dos ícones */
    transition: color 0.3s ease, transform 0.3s ease;

    &:hover {
      color: #fff; /* Cor mais brilhante no hover */
      transform: translateY(-3px); /* Efeito de levantar o ícone */
    }
  }
`;

export const CopyrightText = styled.p`
  font-size: 0.9rem;
  color: #adb5bd; /* Um cinza mais claro para o texto de copyright */
  margin: 0;
`;