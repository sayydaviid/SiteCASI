import React, { useState, useEffect } from 'react';
import {
  NewsPageContainer,
  PageTitle,
  MainContent,
  FeaturedPost,
  HighlightsSidebar,
  HighlightCard
} from './News.styles.js';

export default function News() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getNews() {
      try {
        const response = await fetch('http://localhost:3001/api/news');
        if (!response.ok) {
          throw new Error('Falha ao buscar notícias do servidor.');
        }
        const data = await response.json();
        setArticles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    getNews();
  }, []);

  if (isLoading) {
    return <NewsPageContainer><PageTitle>Notícias</PageTitle><p>Carregando...</p></NewsPageContainer>;
  }

  if (error) {
    return <NewsPageContainer><PageTitle>Notícias</PageTitle><p>Erro: {error}</p></NewsPageContainer>;
  }

  if (articles.length === 0) {
    return <NewsPageContainer><PageTitle>Notícias</PageTitle><p>Nenhuma notícia encontrada.</p></NewsPageContainer>;
  }

  // Separa o primeiro artigo para o destaque e o resto para a barra lateral
  const featuredArticle = articles[0];
  const highlightArticles = articles.slice(1);

  return (
    <NewsPageContainer id = "noticias">
      <PageTitle>Notícias</PageTitle>
      <MainContent>
        <FeaturedPost href={featuredArticle.link} target="_blank" rel="noopener noreferrer">
          <img src={featuredArticle.imageUrl} alt={featuredArticle.title} />
          <h2>{featuredArticle.title}</h2>
          <p>Fonte: {featuredArticle.source}</p>
        </FeaturedPost>

        <HighlightsSidebar>
          {highlightArticles.map((article, index) => (
            <HighlightCard key={index} href={article.link} target="_blank" rel="noopener noreferrer">
              <img src={article.imageUrl} alt={article.title} />
              <h3>{article.title}</h3>
            </HighlightCard>
          ))}
        </HighlightsSidebar>
      </MainContent>
    </NewsPageContainer>
  );
}
