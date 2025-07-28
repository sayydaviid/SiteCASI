require('dotenv').config();
const express   = require('express');
const NodeCache = require('node-cache');
const puppeteer = require('puppeteer');

const router = express.Router();
const cache  = new NodeCache({ stdTTL: 300, checkperiod: 60 });

// --- Lógica do Puppeteer ---

let browserPromise = null;
let loggedInPage   = null;
let isScraping     = false; // Trava de segurança

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
  if (loggedInPage && !loggedInPage.isClosed()) {
    return loggedInPage;
  }
  const browser = await getBrowser();
  const page    = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
  );
  console.log('🤖 Realizando login no Instagram...');
  await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle2' });
  await page.type('input[name="username"]', process.env.IG_USERNAME, { delay: 50 });
  await page.type('input[name="password"]', process.env.IG_PASSWORD, { delay: 50 });
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle2' })
  ]);
  try {
    await page.waitForSelector('text/Salvar suas informações de login', { timeout: 5000 });
    await page.click('text/Agora não');
  } catch (e) { /* Ignora */ }
  try {
    await page.waitForSelector('text/Ativar notificações', { timeout: 5000 });
    await page.click('text/Agora não');
  } catch (e) { /* Ignora */ }
  console.log('✅ Login bem-sucedido!');
  loggedInPage = page;
  return page;
}

async function scrapeInstagram(user, limit = 6) {
  const page = await ensureLoggedIn();
  console.log(`🔎 Navegando para o perfil de ${user}...`);
  await page.goto(`https://www.instagram.com/${user}/`, { waitUntil: 'networkidle2' });

  await page.waitForSelector('a[href*="/p/"]');
  
  const postLinks = await page.evaluate((user, limit) => {
    const allLinks = Array.from(document.querySelectorAll('a[href*="/p/"]'));
    const userPostLinks = allLinks.filter(link => 
      link.href.startsWith(`https://www.instagram.com/${user}/p/`)
    );
    return userPostLinks.slice(0, limit).map(link => link.href);
  }, user, limit);

  const postsData = [];
  for (const link of postLinks) {
    console.log(`📄 Acessando post: ${link}`);
    await page.goto(link, { waitUntil: 'networkidle2' });
    await page.waitForSelector('time[datetime]');

    // Tenta clicar no botão "mais" para expandir a legenda
    try {
      const moreButton = await page.waitForSelector('text/mais', { timeout: 2000 });
      if (moreButton) {
        console.log('    🖱️ Clicando no botão "mais" para expandir a legenda...');
        await moreButton.click();
        await new Promise(resolve => setTimeout(resolve, 500)); 
      }
    } catch (e) {
      console.log(`    ℹ️ Botão "mais" não encontrado para o post (legenda curta).`);
    }

    const postInfo = await page.evaluate(() => {
      let caption = '';
      const captionSelectors = [
        '[data-testid="post-caption"]',
        'div._a9ym > span',
        'article h1',
        'h1'
      ];
      for (const selector of captionSelectors) {
        const element = document.querySelector(selector);
        if (element && element.innerText) {
          caption = element.innerText;
          break;
        }
      }
      const timeElement = document.querySelector('time[datetime]');
      const timestamp = timeElement ? timeElement.getAttribute('datetime') : '';
      return { caption, timestamp };
    });
    if (postInfo.caption) {
      postsData.push({ ...postInfo, link });
    } else {
      console.warn(`⚠️ Legenda não encontrada para o post: ${link}`);
    }
  }
  return postsData.map(p => {
    const dateObj = new Date(p.timestamp);
    return {
      caption:   p.caption,
      date:      dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }),
      link:      p.link,
      timestamp: Math.floor(dateObj.getTime() / 1000)
    };
  });
}

// --- Definição das Rotas ---

router.get('/combined-feed', async (req, res) => {
  const { user1, user2 } = req.query;
  if (!user1 || !user2) return res.status(400).json({ error: 'Os parâmetros "user1" e "user2" são obrigatórios' });
  if (isScraping) return res.status(429).json({ error: 'Busca em andamento, tente novamente em alguns segundos.' });
  
  const key = `insta-combined:${user1}-${user2}`;
  const cached = cache.get(key);
  if (cached) return res.json(cached);

  try {
    isScraping = true;
    const feed1 = await scrapeInstagram(user1, 6);
    const feed2 = await scrapeInstagram(user2, 6);
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
  if (cached) return res.json(cached);

  try {
    const data = await scrapeInstagram(user);
    cache.set(key, data);
    res.json(data);
  } catch (err) {
    console.error('❌ Erro na rota /feed:', err);
    loggedInPage = null;
    res.status(500).json({ error: 'Falha ao obter dados do Instagram.' });
  }
});

module.exports = router;