const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const Scene = require('telegraf/scenes/base');
const service = require('../service');

const buyKeyboard = Markup.inlineKeyboard([
  Markup.callbackButton('Buy', 'buy')
]);

const searchScene = new Scene('search');
searchScene.enter(async ctx => {
  ctx.reply('Please wait...');

  const {
    productType,
    properties
  } = ctx.scene.state;

  ctx.reply(`Search with parameters: ${service.utils.prettyJson(properties)}`);

  try {
    const body = await service.search.search(productType, properties);
    const products = body.hits.hits.map(item => item._source.name);

    if (products.length === 0) {
      ctx.reply('Sorry, but nothing found');
    } else {
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const lines = [];

        if (product.isShop) {
          lines.push(`Shop: ${product.sellerName}`);
        } else {
          lines.push(product.sellerName);
        }
        lines.push(`Review: ${product.review}/5`);
        lines.push(`Price: ${product.price}$`);

        ctx.reply(lines.join('\n'), Extra.markup(buyKeyboard));
      }
    }
  } catch (e) {
    console.log(e);
    ctx.reply(`Sad but true. Error: ${e.toString()}`);
  }
});

searchScene.action('buy', async ctx => {
  /*
  if (!ctx.session.user) {
    ctx.reply('Please sign-in!');
  } else {
    const privateKeyFiles = []; // @todo
    const addrKeyFiles = []; // @todo
    const amount = 0; // @todo
    const comment = ''; // @todo

    const { address } = ctx.session.user;

    const state = await service.ton.sendGrams(
      privateKeyFiles,
      addrKeyFiles,
      address,
      amount,
      comment
    );

    ctx.reply(state ? 'Success 👍' : 'Failed');
  }
  */

  ctx.reply('Experimental feature. Incomplete yet. In the future you can make payment with grams ;)');
});

module.exports = searchScene;
