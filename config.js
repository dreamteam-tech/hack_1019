module.exports = {
  wit: {
    token: process.env.WIT_TOKEN || '7DBSLYZEHB2ZXLZE63MBZYYZU5VQKM2F',
  },
  telegram: {
    token: process.env.TELEGRAM_BOT_TOKEN || '1012381439:AAHiLlWfgCNRpngZVHD3jCpj4KYWK4TNAPk',
    verbose: true,
  },
  elasticsearch: {
    host: 'http://localhost:9200',
    index: 'product'
  }
};
