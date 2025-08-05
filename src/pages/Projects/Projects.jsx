import React, { useState, useEffect } from 'react';
import {
  ProjectsPageContainer,
  PageTitle,
  MainContent,
  FeaturedPost,
  HighlightsSidebar,
  HighlightCard
} from './Projects.styles.js';

// Função para limitar o texto da legenda
function truncate(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

export default function Projects() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getProjects() {
      try {
        // Usa o endpoint /feed para buscar apenas os posts do CASI
        const response = await fetch('http://localhost:3001/api/instagram/feed?user=casi.ufpa');
        if (!response.ok) {
          throw new Error('Falha ao buscar projetos do servidor.');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    getProjects();
  }, []);

  if (isLoading) {
    return <ProjectsPageContainer><PageTitle>Projetos</PageTitle><p>Carregando...</p></ProjectsPageContainer>;
  }

  if (error) {
    return <ProjectsPageContainer><PageTitle>Projetos</PageTitle><p>Erro: {error}</p></ProjectsPageContainer>;
  }

  if (posts.length === 0) {
    return <ProjectsPageContainer><PageTitle>Projetos</PageTitle><p>Nenhum projeto encontrado.</p></ProjectsPageContainer>;
  }

  const featuredProject = posts[0];
  const highlightProjects = posts.slice(1);

  return (
    <ProjectsPageContainer>
      <PageTitle>Projetos</PageTitle>
      <MainContent>
        <FeaturedPost href={featuredProject.link} target="_blank" rel="noopener noreferrer">
          <img src={featuredProject.imageUrl} alt={featuredProject.caption} />
          <h2>{truncate(featuredProject.caption, 100)}</h2>
        </FeaturedPost>

        <HighlightsSidebar>
          {highlightProjects.map((project, index) => (
            <HighlightCard key={index} href={project.link} target="_blank" rel="noopener noreferrer">
              <img src={project.imageUrl} alt={project.caption} />
              <h3>{truncate(project.caption, 80)}</h3>
            </HighlightCard>
          ))}
        </HighlightsSidebar>
      </MainContent>
    </ProjectsPageContainer>
  );
}
