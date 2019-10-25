const config = require('./config');
const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const middleware = require('./middleware');
const searchService = require('./search');
const petrovich = require('petrovich');
const utils = require('./utils');
const {Wit, log} = require('node-wit');

const client = new Wit({
  accessToken: config.WIT_TOKEN,
  logger: new log.Logger(log.DEBUG) // optional
});

const startKeyboard = Markup.inlineKeyboard([
  Markup.callbackButton('Найти товар', 'findProduct'),
  Markup.callbackButton('Найти услугу', 'findService'),
]);

const bot = new Telegraf(config.TELEGRAM_BOT_TOKEN);
bot.use(session());
bot.use(middleware.commandArgs());

bot.start((ctx) => ctx.reply('Добро пожаловать', Extra.markup(startKeyboard)));
bot.command('add', async ctx => {
  await searchService.add(ctx.contextState.command.args.join(' '));
  ctx.reply('Выполнено');
});
bot.command('refresh', async ctx => {
  await searchService.putMapping();
  ctx.reply('Выполнено');
});

bot.help((ctx) => ctx.reply('Help message'));

bot.on('text', async ({ message, reply }) => {
  reply(`Ищу "${message.text}"...`);

  const { entities } = await client.message(message.text);

  if ('action' in entities) {
    // @todo задать уточняющие вопросы
    console.log(entities['action']); // Действие, купить / найти / дай
  }

  if ('product' in entities) {
    // @todo задать уточняющие вопросы
    console.log(entities['product']); // Какой товар или товары
  }

  try {
    let body = await searchService.search(message.text); // @todo после уточняющих вопросов отфильтровать по параметрам
    let items = body.hits.hits.map(item => item._source.name);
    if (items.length === 0) {
      reply('Простите, ничего не найдено');
    } else {
      reply(`Найдены следующие результаты:\n\n${items.join("\n")}`);
    }
  } catch (e) {
    console.log(e);
    reply(`Произошла ошибка: ${JSON.stringify(e)}`);
  }
});

bot.action('findProduct', ({session, reply}) => {
  session.type = 'product';
  reply('Что хотите найти?')
});

bot.action('findService', ({session, reply}) => {
  session.type = 'service';
  reply('Приносим извинения, раздел находится в разработке');
});

bot.action('delete', ({deleteMessage}) => deleteMessage());

bot.launch();
