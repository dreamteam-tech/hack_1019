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

bot.start((ctx) => ctx.reply('Hi. I\'am a chat helper. What you want to buy?'));
bot.help((ctx) => ctx.reply('Help message'));
bot.on('text', async (ctx) => {
  ctx.session.query = ctx.message.text;

  const entities = await service.wit.query(ctx.state.query);

  const type = service.properties.types[entities.product_type];

  ctx.scene.enter('properties', {
    productType: entities.product_type,
    properties: type.properties || {}
  });
});

bot.launch();
