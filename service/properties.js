const Markup = require('telegraf/markup');

module.exports = {
  types: {
    headphones: {
      properties: [
        {
          message: 'You need wireless headphones?',
          keyboard: Markup.inlineKeyboard([
            Markup.callbackButton('Wireless', 'selectWireless'),
            Markup.callbackButton('Cable', 'selectCable'),
          ]),
          name: 'wireless',
        },
        {
          message: 'Whats your budget?',
          keyboard: Markup.inlineKeyboard([
            Markup.callbackButton('Low price', 'selectLowPrice'),
            Markup.callbackButton('Mid price', 'selectMidPrice'),
            Markup.callbackButton('High price', 'selectHighPrice'),
          ]),
          name: 'price'
        },
        {
          message: 'Prefered OS?',
          keyboard: Markup.inlineKeyboard([
            Markup.callbackButton('Android', 'selectMobileAndroid'),
            Markup.callbackButton('iOS', 'selectMobileIOS'),
          ]),
          name: 'os'
        },
      ]
    }
  }
};
