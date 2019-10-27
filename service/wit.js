const { Wit, log } = require('node-wit');
const { wit: witConfig } = require('../config');

const witClient = new Wit({
  accessToken: witConfig.token,
  logger: new log.Logger(log.DEBUG)
});

module.exports = {
  query: async (term) => {
    const { entities } = await witClient.message(term);

    return entities;
  }
};
