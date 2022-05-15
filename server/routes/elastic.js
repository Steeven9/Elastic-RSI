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
  if (type !== "Bearer" || token.length === 0 || token !== "ciaomamma") {
    return false;
  }
  return true;
};

// Returns the status of the cluster
router.get("/status", async (_req, res) => {
  const helth = await client.cluster.health();
  res.send(helth);
});

// Returns the search results for the given query
router.get("/search", async (req, res) => {
  // Validate "auth"
  if (!validateAuth(req.headers.authorization)) {
    res.status(401).send("Missing or malformed auth token");
    return;
  }

  // Validate request
  if (typeof req.body.queryString !== "string") {
    res.status(400).send('Missing parameter "body.queryString"');
    return;
  }

  try {
    const response = await client.search(
      {
        index: INDEX,
        query: {
          match: { field: req.body.queryString },
        },
      },
      {
        headers: {
          Authorization: `ApiKey ${process.env.ELASTIC_API_KEY}`,
        },
      }
    );
    res.status(200).json(response);
  } catch (err) {
    res.status(500).send(err.meta.body);
  }
});

// Returns all data
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
    res.status(200).json(response);
  } catch (err) {
    res.status(500).send(err.meta.body);
  }
});

module.exports = router;
