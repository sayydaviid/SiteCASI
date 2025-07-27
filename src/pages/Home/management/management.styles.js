// src/pages/Home/management/management.styles.js

import styled from 'styled-components';
import researchBgImage from '../../../assets/images/ada-branca.png';

export const ResearchSection = styled.section`
  width: 100%;
  padding: 6rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: linear-gradient(
      rgba(0, 0, 0, 0.75),
      rgba(0, 0, 0, 0.75)
    ),
    url(${researchBgImage}) center/cover no-repeat;

  h2 {
    font-size: 2.8rem;
    font-weight: 600;
    color: #fff;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.1rem;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.85);
    max-width: 700px;
    margin-bottom: 4rem;
  }
`;

export const ResearchCarouselSection = styled.div`
  position: relative;
  width: 100%;
  max-width: 1300px;
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ResearchWindow = styled.div`
  overflow: hidden;
  width: ${props => props.width}px;
`;

export const ResearchTrack = styled.div`
  display: flex;
  gap: 2rem;
  transition: transform 0.5s ease;
  transform: translateX(${props => props.translate}px);
`;

export const ResearchCard = styled.div`
  background-color: #fff;
  color: #343a40;
  border-radius: 16px;
  padding: 2rem 1.5rem;
  width: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  flex-shrink: 0;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
  }

  .icon {
    font-size: 3.5rem;
    color: #2e8b57;
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  p {
    font-size: 0.95rem;
    line-height: 1.6;
    color: #495057;
    flex-grow: 1;
    margin-bottom: 1.5rem;
  }

  a {
    display: inline-block;
    background-color: #2e8b57;
    color: #fff;
    padding: 0.7rem 1.8rem;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 600;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #256d45;
    }
  }
`;
