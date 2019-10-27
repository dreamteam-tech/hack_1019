const Extra = require('telegraf/extra');
const WizardScene = require('telegraf/scenes/wizard');

const wizardScene = new WizardScene('properties', async ctx => {
  const {
    productType,
    properties
  } = ctx.scene.state;

  if (typeof ctx.session.properties === 'undefined') {
    ctx.session.properties = {};
  }

  if (properties.length > 0) {
    for (let i = 0; i < properties.length; i++) {
      const {
        keyboard,
        name, // @todo use name in dynamic callback
        message
      } = properties[i];

      ctx.wizard.steps.push(async ctx => {
        ctx.reply(message, Extra.markup(keyboard));
      });
    }

    ctx.wizard.steps.push(async ctx => {
      const properties = {
        ...ctx.session.properties
      };

      ctx.session.requiredProperties = [];
      ctx.session.properties = {};

      return ctx.scene.enter('search', {
        properties,
        productType
      });
    });
  }

  ctx.session.cursor = ctx.wizard.cursor + 1;
  ctx.wizard.next();
  return ctx.wizard.steps[ctx.wizard.cursor](ctx);
});

// @todo change callback to dynamically set value possibility
wizardScene.action('selectLowPrice', ctx => {
  ctx.session.properties['price'] = 'low';
  ctx.session.cursor++;
  return ctx.wizard.steps[ctx.session.cursor](ctx);
});
wizardScene.action('selectMidPrice', ctx => {
  ctx.session.properties['price'] = 'mid';
  ctx.session.cursor++;
  return ctx.wizard.steps[ctx.session.cursor](ctx);
});
wizardScene.action('selectHighPrice', ctx => {
  ctx.session.properties['price'] = 'high';
  ctx.session.cursor++;
  return ctx.wizard.steps[ctx.session.cursor](ctx);
});
wizardScene.action('selectWireless', ctx => {
  ctx.session.properties['wireless'] = true;
  ctx.session.cursor++;
  return ctx.wizard.steps[ctx.session.cursor](ctx);
});
wizardScene.action('selectCable', ctx => {
  ctx.session.properties['wireless'] = false;
  ctx.session.cursor++;
  return ctx.wizard.steps[ctx.session.cursor](ctx);
});
wizardScene.action('selectMobileAndroid', ctx => {
  ctx.session.properties['os'] = 'android';
  ctx.session.cursor++;
  return ctx.wizard.steps[ctx.session.cursor](ctx);
});
wizardScene.action('selectMobileIOS', ctx => {
  ctx.session.properties['os'] = 'ios';
  ctx.session.cursor++;
  return ctx.wizard.steps[ctx.session.cursor](ctx);
});

module.exports = wizardScene;
