const express = require("express");
const { Queue } = require("bullmq");
const { createBullBoard } = require("@bull-board/api");
const { BullAdapter } = require("@bull-board/api/bullAdapter");
const { BullMQAdapter } = require("@bull-board/api/bullMQAdapter");
const { ExpressAdapter } = require("@bull-board/express");

const Redis = require("ioredis");
const redis = new Redis("redis://localhost:6380");

const someQueue = new Queue("stockScreener", { connection: redis }); // if you have a special connection to redis.

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [new BullMQAdapter(someQueue)],
  serverAdapter: serverAdapter,
});

const app = express();

app.use("/admin/queues", serverAdapter.getRouter());

// other configurations of your server

app.listen(3008, () => {
  console.log("Running on 3008...");
  console.log("For the UI, open http://localhost:3008/admin/queues");
  console.log("Make sure Redis is running on port 6379 by default");
});
