const express = require("express");
const http = require("http");
const cors = require("cors");
const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");

const serverPort = process.env.REACT_APP_BACKEND_PORT || 4000;
const system = require("./routes/system");
const elastic = require("./routes/elastic");
const swaggerDocument = YAML.load("./swagger.yaml");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/system", system);
app.use("/api/elastic", elastic);
app.use("/api/health", (_req, res) => res.send("Ok elastic-rsi"));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

let nextClientId = 0;

io.on("connection", (socket) => {
  let clientId = ++nextClientId;
  console.info(`[INFO] Client #${clientId} connected`);

  socket.on("disconnect", () => {
    console.info(`[INFO] Client #${clientId} disconnected`);
  });
});

server.listen(serverPort, () =>
  console.info(`[INFO] elastic-rsi server listening on port ${serverPort}`)
);
