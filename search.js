const {Client} = require('@elastic/elasticsearch');
const client = new Client({
  node: 'http://localhost:9200',
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

const ELASTIC_INDEX = 'product';

module.exports = {
  add: async term => {
    await client.index({
      index: ELASTIC_INDEX,
      body: {
        name: term
      }
    });

    await client.indices.refresh({
      index: ELASTIC_INDEX
    });
  },

  search: async term => {
    // Let's search!
    const {body} = await client.search({
      index: ELASTIC_INDEX,
      body: {
        query: {
          match: { name: term }
        }
      }
    });

    return body;
  }
};
