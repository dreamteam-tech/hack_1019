const { Client } = require('@elastic/elasticsearch');
const { elasticsearch } = require('../config');

const client = new Client({
  node: elasticsearch.host,
  log: 'trace'
});

/*
curl --request PUT \
  --url http://localhost:9200/product \
  --header 'content-type: application/json' \
  --data ' {
"mappings": {
  "product": {
    "properties": {
      "name": {
        "type": "text",
          "analyzer": "russian"
      },
      "description": {
        "type": "text",
          "analyzer": "russian"
      }
    }
  }
}
}'
*/

client.ping((error) => {
  if (error) {
    console.trace('elasticsearch cluster is down!');
  }
  console.log('All is well');
});

module.exports = {
  add: async term => {
    await client.index({
      index: elasticsearch.index,
      body: {
        name: term
      }
    });

    await client.indices.refresh({
      index: elasticsearch.index
    });
  },

  search: async (
    productType,
    properties
  ) => {
    // Let's search!
    const {
      body
    } = await client.search({
      index: elasticsearch.index,
      body: {
        query: {
          match: {
            productType,
            properties
          }
        }
      }
    });

    return body;
  }
};
