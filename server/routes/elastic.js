const express = require("express");
const router = express.Router();
const { Client } = require("@elastic/elasticsearch");

if (!process.env.ELASTIC_URL) {
  console.error("[ERROR] ELASTIC_URL not set!");
  process.exit(1);
}
if (!process.env.ELASTIC_API_KEY) {
  console.error("[ERROR] ELASTIC_API_KEY not set!");
  process.exit(1);
}
if (!process.env.REACT_APP_BACKEND_API_TOKEN) {
  console.error("[ERROR] REACT_APP_BACKEND_API_TOKEN not set!");
  process.exit(1);
}

const INDEX = "rsi";
const client = new Client({
  node: process.env.ELASTIC_URL,
  auth: {
    apiKey: process.env.ELASTIC_API_KEY,
  },
});

const validateAuth = (auth) => {
  if (!auth) {
    return false;
  }
  const [type, token] = auth.split(" ");
  return !(
    type !== "Bearer" ||
    token.length === 0 ||
    token !== process.env.REACT_APP_BACKEND_API_TOKEN
  );
};

// Returns the status of the cluster
router.get("/status", async (_req, res) => {
  const helth = await client.cluster.health();
  res.send(helth);
});

// Accepts an aggregations filter and returns the buckets
router.post("/aggs", async (req, res) => {
  // Validate "auth"
  if (!validateAuth(req.headers.authorization)) {
    res.status(401).send("Missing or malformed auth token");
    return;
  }

  try {
    const response = await client.search(
      {
        size: 0,
        index: INDEX,
        aggs: req.body,
      },
      {
        headers: {
          Authorization: `ApiKey ${process.env.ELASTIC_API_KEY}`,
        },
      }
    );
    res.status(200).json(response.aggregations);
  } catch (err) {
    res.status(500).send(err.meta.body);
  }
});

// Generic endpoint that accepts a query object
// and returns everything
router.post("/get", async (req, res) => {
  // Validate "auth"
  if (!validateAuth(req.headers.authorization)) {
    res.status(401).send("Missing or malformed auth token");
    return;
  }

  try {
    const response = await client.search(req.body, {
      headers: {
        Authorization: `ApiKey ${process.env.ELASTIC_API_KEY}`,
      },
    });
    res.status(200).json(response);
  } catch (err) {
    res.status(500).send(err.meta.body);
  }
});

// Returns all data (limited to 10'000 records)
router.get("/getAll", async (req, res) => {
  // Validate "auth"
  if (!validateAuth(req.headers.authorization)) {
    res.status(401).send("Missing or malformed auth token");
    return;
  }

  try {
    const response = await client.search(
      {
        index: INDEX,
        size: 10000,
        query: {
          match_all: {},
        },
      },
      {
        headers: {
          Authorization: `ApiKey ${process.env.ELASTIC_API_KEY}`,
        },
      }
    );
    res.status(200).json(response.hits.hits);
  } catch (err) {
    res.status(500).send(err.meta.body);
  }
});

module.exports = router;
