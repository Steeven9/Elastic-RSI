# ElasticRSI

VAA 2022 final project - group 3

This project can run in two variants: either client-only, using our shared backend and Elasticsearch instance,
or full-stack, bringing up all the services. Refer to the relative section for instructions.

## Client-only mode

Create a `.env` file in the root of the repo with the following:

```bash
REACT_APP_BACKEND_HOSTNAME=https://elastic-rsi.soulsbros.ch
REACT_APP_BACKEND_PORT=443
REACT_APP_BACKEND_API_TOKEN= # ask us for this one
```

Then install the dependencies and start the client:

```bash
npm ri
cd client
npm start
```

Direct your browser to [http://localhost:3000](http://localhost:3000) and start exploring!

## Full-stack mode (aka expert mode)

Note: this assumes you're running two nodes (`elasticsearch`, `elasticsearch02`) on the same machine. Ensure you have a LOT of RAM and I/O throughput. Really.

Create a `.env` file in the root of the repo with the following:

```bash
ELASTIC_PASSWORD=somestuff
KIBANA_PASSWORD=somestuff
REACT_APP_BACKEND_API_TOKEN=somestuff
ELASTIC_API_KEY=
RSI_API_USER=   # get it from RSI
RSI_API_PWD=    # get it from RSI
ELASTIC_URL=http://localhost:9200
```

If it's the first time setting up the project, run the one-time initial setup:

```bash
./setupElastic.sh
```

(if something fails, try running those commands manually).

Then, create an API key (via the Kibana GUI or the Elasticsearch API) with read privileges
on all indices and add it to the `.env` file under the `ELASTIC_API_KEY` key.

For successive restarts, simply bring up the stack with:

```bash
docker-compose up -d
```

All containers should show up as healthy after a couple minutes at maximum.

## Ingesting the data

This assumes you're running the script on the same node of the Elasticsearch instance.
You can override this by manually prepending `ELASTIC_URL` before the script call.

```bash
./ingestData.sh rsi
```

(Note: refer to the [converter README](./converter/README.md) for more information)

## Backend APIs

We documented all our APIs with Swagger; authentication is made via bearer token (the one set with `REACT_APP_BACKEND_API_TOKEN`).
See [https://elastic-rsi.soulsbros.ch/api/docs](https://elastic-rsi.soulsbros.ch/api/docs)

## Useful resources

[https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html#docker-compose-file](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html#docker-compose-file)

[https://www.elastic.co/guide/en/elasticsearch/reference/current/security-basic-setup.html](https://www.elastic.co/guide/en/elasticsearch/reference/current/security-basic-setup.html)

[https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-network.html](https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-network.html)

## Known limitations/bugs

Date/times might be off due to the DST mess; moreover, we use an external library for timezones
which might or might not be correct.

Our Elasticsearch instance doesn't have replica shards for performance reasons,
but in a production environment it should be enabled.
