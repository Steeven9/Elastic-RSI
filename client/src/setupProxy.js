const { createProxyMiddleware } = require("http-proxy-middleware");

let backendHostname =
  process.env.REACT_APP_BACKEND_HOSTNAME || "http://localhost";
let backendPort = process.env.REACT_APP_BACKEND_PORT || 4000;

module.exports = (app) => {
  app.use(
    "/api",
    createProxyMiddleware({
      target: backendHostname + ":" + backendPort,
      changeOrigin: true,
    })
  );
};
