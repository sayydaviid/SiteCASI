// src/pages/Home/about/about.styles.js

import styled from 'styled-components';

export const AboutSection = styled.section`
  width: 100%;
  padding: 2rem;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const AboutContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5rem;
  width: 100%;
  max-width: 1200px;
`;

export const TextColumn = styled.div`
  flex: 1.5;
  max-width: 60%;

  h2 {
    font-size: 3rem;
    font-weight: 500;
    color: #343a40;
    margin-bottom: 1.5rem;
  }

  p {
    font-size: 1.1rem;
    color: #495057;
    line-height: 1.7;
    text-align: justify;
  }
`;

export const ImageColumn = styled.div`
  flex: 1;
  max-width: 40%;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    max-width: 100%;
    height: auto;
  }
`;
