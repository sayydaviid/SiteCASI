require('dotenv').config();
const express   = require('express');
const NodeCache = require('node-cache');
const puppeteer = require('puppeteer');

const router = express.Router();
const cache  = new NodeCache({ stdTTL: 300, checkperiod: 60 });

let browserPromise = null;
let loggedInPage   = null;
let isScraping     = false;

function getBrowser() {
  if (!browserPromise) {
    browserPromise = puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
  }
  return browserPromise;
}

async function ensureLoggedIn() {
  if (loggedInPage && !loggedInPage.isClosed()) return loggedInPage;
  const browser = await getBrowser();
  const page    = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36');
  console.log('🤖 Realizando login no Instagram...');
  await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle2', timeout: 60000 });
  await page.type('input[name="username"]', process.env.IG_USERNAME, { delay: 50 });
  await page.type('input[name="password"]', process.env.IG_PASSWORD, { delay: 50 });
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 })
  ]);
  try { await page.click('text/Agora não', { timeout: 5000 }); } catch (e) { /* Ignora */ }
  try { await page.click('text/Agora não', { timeout: 5000 }); } catch (e) { /* Ignora */ }
  console.log('✅ Login bem-sucedido!');
  loggedInPage = page;
  return page;
}

async function scrapeInstagram(user, limit = 12) {
  const page = await ensureLoggedIn();
  console.log(`🔎 Navegando para o perfil de ${user}...`);
  
  try {
    await page.goto(`https://www.instagram.com/${user}/`, { waitUntil: 'networkidle2', timeout: 60000 });
  } catch (e) {
    console.warn(`⚠️ Timeout ao navegar para o perfil de ${user}. Tentando novamente...`);
    await page.goto(`https://www.instagram.com/${user}/`, { waitUntil: 'networkidle2', timeout: 60000 });
  }

  await page.waitForSelector('a[href*="/p/"]');
  
  const postLinks = await page.evaluate((user, limit) => {
    const links = Array.from(document.querySelectorAll('a[href*="/p/"]'));
    return links.filter(link => link.href.startsWith(`https://www.instagram.com/${user}/p/`))
                .slice(0, limit)
                .map(link => link.href);
  }, user, limit);

  const postsData = [];
  for (const link of postLinks) {
    console.log(`📄 Acessando post: ${link}`);
    try {
        await page.goto(link, { waitUntil: 'networkidle2', timeout: 60000 });
    } catch(e) {
        console.warn(`⚠️ Timeout ao navegar para o post ${link}. Tentando novamente...`);
        await page.goto(link, { waitUntil: 'networkidle2', timeout: 60000 });
    }
    await page.waitForSelector('time[datetime]');
    try {
      const moreButton = await page.waitForSelector('text/mais', { timeout: 2000 });
      if (moreButton) await moreButton.click();
    } catch (e) { /* Ignora */ }

    const postInfo = await page.evaluate(() => {
      let caption = '', imageUrl = '', timestamp = '';
      
      const captionSelectors = ['[data-testid="post-caption"]', 'div._a9ym > span', 'article h1', 'h1'];
      for (const selector of captionSelectors) {
        const element = document.querySelector(selector);
        if (element && element.innerText) { caption = element.innerText; break; }
      }
      
      // --- LÓGICA DE EXTRAÇÃO DE IMAGEM ATUALIZADA ---
      // Estratégia 1: Tenta encontrar a imagem de um post de vídeo primeiro.
      const videoElement = document.querySelector('article video');
      if (videoElement && videoElement.poster) {
          imageUrl = videoElement.poster;
      }

      // Estratégia 2: Se não for vídeo, procura pela imagem principal com múltiplas resoluções (srcset).
      if (!imageUrl) {
          const mainImage = document.querySelector('div._aagv > img');
          if (mainImage && mainImage.srcset) {
              const sources = mainImage.srcset.split(',').map(src => {
                  const [url, width] = src.trim().split(' ');
                  return { url, width: parseInt(width.replace('w', ''), 10) };
              });
              if (sources.length > 0) {
                  imageUrl = sources.sort((a, b) => b.width - a.width)[0].url;
              }
          } else if (mainImage && mainImage.src) {
              imageUrl = mainImage.src;
          }
      }

      // Estratégia 3: Como último recurso, pega a primeira imagem que encontrar no post.
      if (!imageUrl) {
          const fallbackImage = document.querySelector('article img');
          if (fallbackImage && fallbackImage.src) {
              imageUrl = fallbackImage.src;
          }
      }

      const timeElement = document.querySelector('time[datetime]');
      if (timeElement) timestamp = timeElement.getAttribute('datetime');
      
      return { caption, imageUrl, timestamp };
    });

    if (postInfo.caption && postInfo.imageUrl) {
      postsData.push({ ...postInfo, link });
    } else {
      console.warn(`⚠️ Dados incompletos para o post: ${link} (Legenda: ${!!postInfo.caption}, Imagem: ${!!postInfo.imageUrl})`);
    }
  }
  return postsData.map(p => ({
    caption: p.caption,
    date: new Date(p.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }),
    link: p.link,
    imageUrl: p.imageUrl,
    timestamp: new Date(p.timestamp).getTime()
  }));
}

router.get('/combined-feed', async (req, res) => {
  const { user1, user2 } = req.query;
  if (!user1 || !user2) return res.status(400).json({ error: 'Os parâmetros "user1" e "user2" são obrigatórios' });
  if (isScraping) return res.status(429).json({ error: 'Busca em andamento, tente novamente.' });
  
  const key = `insta-combined:${user1}-${user2}`;
  const cached = cache.get(key);
  if (cached) return res.json(cached);

  try {
    isScraping = true;
    const feed1 = await scrapeInstagram(user1, 6);
    cache.set(`insta:${user1}`, feed1);

    const feed2 = await scrapeInstagram(user2, 6);
    cache.set(`insta:${user2}`, feed2);

    const combinedFeed = [...feed1, ...feed2].sort((a, b) => b.timestamp - a.timestamp).slice(0, 6);
    cache.set(key, combinedFeed);
    
    res.json(combinedFeed);
  } catch (err) {
    console.error('❌ Erro na rota /combined-feed:', err);
    loggedInPage = null;
    res.status(500).json({ error: 'Falha ao obter feeds combinados do Instagram.' });
  } finally {
    isScraping = false;
  }
});

router.get('/feed', async (req, res) => {
  const user = req.query.user;
  if (!user) return res.status(400).json({ error: 'Parâmetro "user" é obrigatório' });
  
  const key = `insta:${user}`;
  const cached = cache.get(key);

  if (cached) {
    console.log(`⚡️ Servindo feed individual de ${user} do cache.`);
    return res.json(cached);
  }

  console.log(`🟡 Cache para ${user} vazio. A página Home precisa ser visitada primeiro.`);
  res.json([]);
});

module.exports = router;
