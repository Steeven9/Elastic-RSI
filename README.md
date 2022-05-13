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

Build the converter program

```bash
cd converter
./build.sh ../data/converter
```

Assuming the data is in `.log` format and stored in the `data/` folder, first convert the data to the correct format:

```bash
cd data
./converter output.ndjson *.log
```

(Note: refer to the [converter README](./converter/README.md) for more information)

Then upload everything to ElasticSearch:

```bash
ELASTIC_URL=http://localhost:9200 ELASTIC_INDEX=rsi ./upload.sh ELASTIC_PASSWORD output.njdson.*.part
```
