# ElasticRSI

VAA 2022 final project - group 3

## Set up ElasticSearch and Kibana

Create a `.env` file with the following:

```bash
ELASTIC_PASSWORD=somestuff
KIBANA_PASSWORD=somestuff
REACT_APP_BACKEND_API_TOKEN=somestuff
ELASTIC_API_KEY=
RSI_API_USER=   # get from RSI
RSI_API_PWD=    # get from RSI
```

Bring up the stack with:

```bash
docker-compose up -d
```

Then set the Kibana system password:

```bash
source ./exportEnv.sh

curl -X POST -u elastic:${ELASTIC_PASSWORD} \
http://localhost:9200/_security/user/kibana_system/_password \
-H "Content-Type: application/json" 
-d "{\"password\":\"${KIBANA_PASSWORD}\"}"
```

If you get get `{}` back as an answer, the operation was successful and you can restart Kibana to apply it:

```bash
docker restart kibana
```

Both containers should show up as healthy after a couple minutes at maximum.

Then, create an API key (via the Kibana GUI or the Elasticsearch API) with read privileges
on the index and add it to the `.env` file under `ELASTIC_API_KEY`.

## Ingest the data

```bash
./ingestData.sh ${ELASTIC_PASSWORD} http://localhost:9200
```

(Note: refer to the [converter README](./converter/README.md) for more information)

## Start the webserver

```bash
cd server
npm run dev
```

And in a new shell:

```bash
cd client
npm start
```

## Backend APIs

`GET api/elastic/status`\
Returns the status of the cluster

`POST api/elastic/aggs`\
Auth: bearer token (`REACT_APP_BACKEND_API_TOKEN`)\
Body: an aggregation filter\
Returns the buckets for the given filter

`POST api/elastic/get`\
Auth: bearer token (`REACT_APP_BACKEND_API_TOKEN`)\
Body: a query object\
Returns the result for the given query, as if used in the dev tools

`GET api/elastic/getAll`\
Auth: bearer token\
Returns all data
