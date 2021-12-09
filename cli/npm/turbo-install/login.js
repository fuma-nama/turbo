#!/usr/bin/env node
const http = require("http");
const open = require("open");

const DEFAULT_SITE =
  "https://front-l5o6bf585.vercel.sh" || "https://vercel.com";
const DEFAULT_HOSTNAME = "127.0.0.1";
const DEFAULT_PORT = 9789;

let server_ = http.createServer();

const login = async () => {
  const redirectURL = `http://${DEFAULT_HOSTNAME}:${DEFAULT_PORT}`;
  let loginURL = `${DEFAULT_SITE}/turborepo/token?redirect_uri=${encodeURIComponent(
    redirectURL
  )}`;
  // console.log(`Opening login URL. \n${loginURL}\n`);
  let currentWindow;
  const responseParams = await new Promise((resolve) => {
    server_.once("request", async (req, res) => {
      const query = new URL(req.url || "/", "http://localhost").searchParams;
      resolve(query);
      res.statusCode = 302;
      res.setHeader("Location", `${DEFAULT_SITE}/turborepo/success`);
      res.end();
      server_.close();
    });
    server_.listen(
      DEFAULT_PORT,
      DEFAULT_HOSTNAME,
      async () => await open(loginURL)
    );
  });
  return responseParams;
};

login().then(
  (res) => {
    console.log(res.get("token"));

    process.exit(0);
  },
  (err) => {
    server_?.close();
    throw e;
  }
);
