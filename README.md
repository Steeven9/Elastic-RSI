# ElasticRSI

VAA project - group 3

## Set up ElasticSearch and Kibana

Create a `.env` file with `ELASTIC_PASSWORD` and `KIBANA_PASSWORD`

Bring up the stack with:

```bash
docker-compose up -d
```

Then set the Kibana system password (change the values according to what has been set before):

```bash
curl -X POST -u elastic:ELASTIC_PASSWORD -H "Content-Type: application/json" http://localhost:9200/_security/user/kibana_system/_password -d "{\"password\":\"KIBANA_PASSWORD\"}"
docker restart kibana
```

Both containers should show up as healthy after a couple minutes at maximum.

## Ingest the data

TODO
