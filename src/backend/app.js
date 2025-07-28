require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importa o único router que agora contém todas as rotas do Instagram
const instagramRouter = require('./routes/instagram');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('👍 Servidor com Puppeteer está rodando!');
});

// Usa o router importado para o prefixo /api/instagram
app.use('/api/instagram', instagramRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`👉 Servidor rodando em http://localhost:${PORT}`);
});
