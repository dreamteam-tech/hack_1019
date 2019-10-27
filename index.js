const { telegram: telegramConfig } = require('./config');
const Telegraf = require('telegraf');
const session = require('telegraf/session');
const middleware = require('./middleware');
const scene = require('./scene');
const service = require('./service');
const Stage = require('telegraf/stage');

const stage = new Stage([scene.search, scene.properties], { ttl: 300 });

const bot = new Telegraf(telegramConfig.token);
if (telegramConfig.verbose) {
  bot.use(Telegraf.log());
}
bot.use(session());
bot.use(stage.middleware());
bot.use(middleware.commandArgs());
bot.use(middleware.admin());

bot.start((ctx) => ctx.reply('Hello! What do you wish?'));
bot.help((ctx) => ctx.reply('Help message'));
bot.on('text', async (ctx) => {
  ctx.session.query = ctx.message.text;

  if (ctx.message.text.toLowerCase().indexOf('headphones') === -1) {
    ctx.reply("The product is out of stock.\nBut we have headphones for sell 🙂");
  } else {
    // const entities = await service.wit.query(ctx.state.query);
    const entities = {
      product_type: 'headphones'
    };

    const type = service.properties.types[entities.product_type];

    ctx.scene.enter('properties', {
      productType: entities.product_type,
      properties: type.properties || {}
    });
  }
});

bot.launch();
