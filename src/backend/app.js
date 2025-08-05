require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
// Aponta para a subpasta 'news'
const { fetchAndCacheNews } = require('./news/news_fetch');

// Importa o router unificado do Instagram
const instagramRouter = require('./routes/instagram');

const app = express();
app.use(cors());
app.use(express.json());

// --- LÓGICA DE NOTÍCIAS ---
// CORREÇÃO: O caminho agora aponta para dentro da pasta 'news'
const newsCachePath = path.join(__dirname, 'news', 'news.json');

// Verifica se o cache de notícias existe na inicialização.
if (!fs.existsSync(newsCachePath)) {
  console.log('Cache de notícias não encontrado. Buscando pela primeira vez...');
  fetchAndCacheNews();
}

// Agenda a busca para rodar a cada 30 minutos
console.log('📰 Agendando busca de notícias a cada 30 minutos.');
cron.schedule('*/30 * * * *', () => {
  fetchAndCacheNews();
});

// Cria a rota da API para servir as notícias cacheadas
app.get('/api/news', (req, res) => {
  res.sendFile(newsCachePath, (err) => {
    if (err) {
      res.status(500).json({ error: 'Não foi possível ler o arquivo de notícias.' });
    }
  });
});


// --- ROTAS EXISTENTES ---
app.get('/', (req, res) => {
  res.send('👍 Servidor está rodando!');
});

app.use('/api/instagram', instagramRouter);


// Inicia o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`👉 Servidor rodando em http://localhost:${PORT}`);
});