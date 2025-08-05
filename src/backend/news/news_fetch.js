const Parser = require('rss-parser');
const fs = require('fs/promises');
const path = require('path');

const parser = new Parser();

// Lista de feeds RSS dos sites que você quer monitorizar
const FEEDS = [
  'https://tecnoblog.net/feed/',
  'https://canaltech.com.br/rss/',
  'https://www.tecmundo.com.br/rss',
  'https://mittechreview.com.br/feed/'
];

// Função para tentar extrair uma imagem de boa qualidade do conteúdo
function extractImageUrl(item) {
  if (item.enclosure && item.enclosure.url) {
    return item.enclosure.url;
  }
  const content = item['content:encoded'] || item.content || '';
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch ? imgMatch[1] : 'https://via.placeholder.com/400x200.png?text=Sem+Imagem'; // Imagem padrão
}

async function fetchAndCacheNews() {
  console.log('📰 Buscando novas notícias...');
  try {
    const allItems = [];
    
    // Busca os feeds um por um para isolar erros
    for (const feedUrl of FEEDS) {
      try {
        console.log(`    -> Buscando de: ${feedUrl}`);
        const feed = await parser.parseURL(feedUrl);
        if (feed && feed.items) {
          feed.items.forEach(item => {
            // Garante que o item tem um título e link antes de adicionar
            if (item.title && item.link) {
              allItems.push({
                title: item.title,
                link: item.link,
                pubDate: item.pubDate,
                isoDate: item.isoDate,
                source: feed.title,
                imageUrl: extractImageUrl(item)
              });
            }
          });
        }
      } catch (error) {
        // Se um feed falhar, regista o erro e continua para o próximo
        console.warn(`⚠️  Falha ao buscar o feed: ${feedUrl}. Erro: ${error.message}`);
      }
    }

    // Se, no final, nenhum artigo foi encontrado, não faz nada
    if (allItems.length === 0) {
        console.warn('🚫 Nenhuma notícia foi encontrada em nenhum dos feeds. O cache não será atualizado.');
        return;
    }

    // Ordena todos os itens por data de publicação
    allItems.sort((a, b) => new Date(b.isoDate) - new Date(a.isoDate));

    // Pega os 10 mais recentes e salva em um ficheiro JSON
    const latestItems = allItems.slice(0, 10);
    // CORREÇÃO: Guarda o ficheiro na mesma pasta que este script (src/backend/news)
    const cachePath = path.join(__dirname, 'news.json');
    await fs.writeFile(cachePath, JSON.stringify(latestItems, null, 2));

    console.log(`✅ Notícias salvas com sucesso! ${latestItems.length} artigos no cache.`);
  } catch (error) {
    // Este erro só acontecerá se houver um problema ao escrever o ficheiro
    console.error('❌ Erro geral ao processar notícias:', error);
  }
}

module.exports = { fetchAndCacheNews };