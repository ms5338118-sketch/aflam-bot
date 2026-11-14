const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const yts = require('yt-search');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ]
  }
});




client.on('code', (code) => {
  console.log('PAIRING CODE: ' + code);
});

client.on('ready', () => {
  console.log('شغال البوت');
});

client.on('message', async msg => {
  const text = msg.body.trim();
  if (text.startsWith('!') || text.length < 2) return;
  if (msg.from.includes('@g.us')) return;
  try {
    const r = await yts(text + ' فيلم trailer');
    const v = r.videos[0];
    if (!v) {
      msg.reply('ده الفيلم ملقيتش اسم ده، جرب اسم تاني');
      return;
    }
    msg.reply(`🎬 ${v.title}\n\n📝 ${v.description.slice(0,300)}\n\n🔗 ${v.url}`);
  } catch (e) {
    msg.reply('حصل مشكلة، جرب تاني');
  }
});

client.initialize();

setTimeout(async () => {
  try {
    const phone = process.env.PHONE_NUMBER;
    if (!phone) {
      console.log('PHONE_NUMBER مش موجود في Variables');
      return;
    }
    const code = await client.requestPairingCode(phone);
    console.log('PAIRING CODE: ' + code);
  } catch (e) {
    console.log('PAIRING ERROR: ' + e.message);
  }
}, 5000);
