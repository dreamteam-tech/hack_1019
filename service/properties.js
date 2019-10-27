const Markup = require('telegraf/markup');

module.exports = {
  types: {
    headphones: {
      properties: [
        {
          message: 'Do you need wireless headphones?',
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
          message: 'I see that you are having iphone, do you want to buy aipods?',
          keyboard: Markup.inlineKeyboard([
            Markup.callbackButton('Yes', 'selectMobileIOS'),
            Markup.callbackButton('No', 'selectMobileAndroid'),
          ]),
          name: 'os'
        },
      ]
    }
  }
};
