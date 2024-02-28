const gateway = require("fast-gateway");
const server = gateway({
  routes: [
    {
      prefix: "/http-auth",
      target: "http://localhost:3001",
    },
    {
      prefix: "/http-product",
      target: "http://localhost:3002",
    },
    {
      prefix: "/http-review",
      target: "http://localhost:3000",
    },
    {
      prefix: "/http-shop",
      target: "http://localhost:3003",
    },
  ],
});

server.start(3004);
