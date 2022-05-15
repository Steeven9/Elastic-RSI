# ElasticRSI

VAA project - group 3

## Set up ElasticSearch and Kibana

Create a `.env` file with `ELASTIC_PASSWORD` and `KIBANA_PASSWORD`

Bring up the stack with:

```bash
docker-compose up -d
```

Then set the Kibana system password (change the passwords according to what you set before):

```bash
curl -X POST -u elastic:ELASTIC_PASSWORD \
http://localhost:9200/_security/user/kibana_system/_password \
-H "Content-Type: application/json" 
-d "{\"password\":\"KIBANA_PASSWORD\"}"
```

If you get get `{}` back as an answer, the operation was successful and you can restart Kibana to apply it:

```bash
docker restart kibana
```

Both containers should show up as healthy after a couple minutes at maximum.

Then, create an API key (via the Kibana GUI or the Elasticsearch API) with read privileges
on the `rsi` index and add it to the `.env` file as `ELASTIC_API_KEY`.

## Ingest the data

```bash
./ingestData.sh <ELASTIC_PASSWORD> http://localhost:9200
```

(Note: refer to the [converter README](./converter/README.md) for more information)

## Backend APIs

`GET api/elastic/status`\
Returns the status of the cluster

`GET api/elastic/search`\
Auth: bearer token\
Body: `{ "queryString": "string to match for" }`\
Returns the search results for the given query

`GET api/elastic/getAll`\
Auth: bearer token\
Returns all data
