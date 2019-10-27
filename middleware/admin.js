const Composer = require('telegraf/composer');
const { admin } = require('telegraf');
const service = require('../service');

const adminHandler = new Composer();
adminHandler.command('/add', admin(
  async ctx => {
    await service.search.add(ctx.state.command.args);
    ctx.reply('Выполнено');
  })
);
adminHandler.command('/refresh', admin(
  async ctx => {
    await service.search.putMapping();
    ctx.reply('Выполнено');
  })
);

module.exports = () => adminHandler;
