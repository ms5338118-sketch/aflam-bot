const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const yts = require('yt-search');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('البوت شغال');
});

client.on('message', async msg => {
  const text = msg.body.trim();
  if (text.startsWith('!') || text.length < 2) return;
  if (msg.from.includes('@g.us')) return;
  try {
    const r = await yts(text + ' فيلم trailer');
    const v = r.videos[0];
    if (!v) {
      msg.reply('ملقيتش الفيلم ده، جرب اسم تاني');
      return;
    }
    msg.reply(`🎬 ${v.title}\n\n📝 ${v.description.slice(0, 300)}\n\n⏱️ المدة: ${v.timestamp}\n👁️ المشاهدات: ${v.views}\n\n🔗 لينك المشاهدة:\n${v.url}`);
  } catch (e) {
    msg.reply('حصل مشكلة، جرب تاني');
  }
});

client.initialize();
