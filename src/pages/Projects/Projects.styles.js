import styled from 'styled-components';

// Reutilizamos os mesmos estilos da página de notícias
export const ProjectsPageContainer = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
`;

export const PageTitle = styled.h1`
  font-size: 2.5rem;
  border-bottom: 2px solid #ccc;
  padding-bottom: 10px;
  margin-bottom: 30px;
`;

export const MainContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const FeaturedPost = styled.a`
  display: block;
  text-decoration: none;
  color: inherit;
  
  img {
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    margin-bottom: 15px;
    border-radius: 8px;
  }

  h2 {
    font-size: 2rem;
    line-height: 1.2;
    margin-bottom: 10px;
  }
`;

export const HighlightsSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const HighlightCard = styled.a`
  display: flex;
  gap: 15px;
  text-decoration: none;
  color: inherit;

  img {
    width: 120px;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
  }

  h3 {
    font-size: 1rem;
    line-height: 1.3;
    margin: 0;
  }
`;
