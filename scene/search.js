const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const Scene = require('telegraf/scenes/base');
const service = require('../service');

const buyKeyboard = Markup.inlineKeyboard([
  Markup.callbackButton('Buy', 'buy'),
  Markup.callbackButton('Details', 'details')
]);

const searchScene = new Scene('search');
searchScene.enter(async ctx => {
  ctx.reply('Please wait...');

  const {
    productType,
    properties
  } = ctx.scene.state;

  try {
    const body = await service.search.search(productType, properties);
    const products = body.hits.hits.map(item => item._source.name);

    if (products.length === 0) {
      ctx.reply('Sorry, but nothing found');
    } else {
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const lines = [];

        lines.push(product.image);
        lines.push(`Seller: ${product.sellerName}`);
        lines.push(`Review: ${product.review}/5`);
        lines.push(`Price: ${product.price} GRAM`);

        // pipe url content
        ctx.reply(lines.join('\n'), Extra.markup(buyKeyboard));
      }
    }
  } catch (e) {
    console.log(e);
    ctx.reply(`Sad but true. Error: ${e.toString()}`);
  }
});

searchScene.action('details', async ctx => {
  ctx.reply('Sorry, uncomplete yet');
});

searchScene.action('buy', async ctx => {
  try {
    const tx = await service.ton.sendGrams(
      ctx.session.user.privateKeyFiles,
      ctx.session.user.addrKeyFiles,
      ctx.session.user.address,
      ctx.session.amount || 0,
      ctx.session.comment || ''
    );

    ctx.reply('👍');
    ctx.reply(`Successful\nYour transaction ID: ${tx.hash}\nhttps://test.ton.org/testnet/transaction?account=${ctx.session.user.address}&lt=${tx.lt}&hash=${tx.hash}`);
  } catch (e) {
    ctx.reply(e.toString());
  }
});

module.exports = searchScene;
