// src/pages/Home/Home.styles.js
import styled from 'styled-components';
import bgImage from '../../assets/images/teste.png';
import researchBgImage from '../../assets/images/ada-branca.png';

export const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  padding: 2rem;
  box-sizing: border-box;
  background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),
    url(${bgImage}) center/cover no-repeat;
`;

export const Hero = styled.section`
  text-align: center;
  color: #fff;
  margin-bottom: 3rem;
  h1 {
    font-size: 4.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  p {
    font-size: 1.1rem;
    font-weight: 300;
    max-width: 600px;
  }
`;

export const CarouselSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1300px;
`;

export const CarouselWindow = styled.div`
  overflow: hidden;
  width: ${props => props.width}px;
  transition: width 0.3s ease;
`;

export const CarouselTrack = styled.div`
  display: flex;
  transition: transform 0.5s ease-in-out;
  transform: translateX(${props => props.translate}px);
`;

export const Card = styled.div`
  background: rgba(17,24,39,0.5);
  backdrop-filter: blur(4px);
  border-radius: 8px;
  min-width: 300px;
  height: 320px;
  margin: 0 0.75rem;
  padding: 1.5rem;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: background 0.3s ease;
  &:hover { background: rgba(17,24,39,0.7); }
  h3 { font-size: 1.2rem; font-weight: 500; line-height: 1.4; }
  div {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  span {
    font-size: 0.85rem;
    color: rgba(255,255,255,0.7);
  }
  a {
    display: block;
    width: 100%;
    padding: 0.6rem 1rem;
    background-color: #111827;
    border-radius: 6px;
    color: #fff;
    text-align: center;
    font-weight: 600;
    font-size: 0.9rem;
    text-decoration: none;
    transition: background-color 0.2s ease;
    &:hover { background-color: #1F2937; }
    text-decoration: none;
  }
`;

export const ArrowButton = styled.button`
  background: transparent;
  border: none;
  font-size: 3rem;
  color: #fff;
  cursor: pointer;
  padding: 0 1rem;
  transition: opacity 0.3s ease, transform 0.3s ease;
  &:hover:not(:disabled) { transform: scale(1.2); }
  &:disabled { opacity: 0.2; cursor: not-allowed; }
`;
