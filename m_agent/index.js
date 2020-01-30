"use strict";

const { ClassAgent } = require("./ClassAgent");

const obj_agent = new ClassAgent({
  name: "myApp",
  username: "abbul",
  interval: 2000,
  mqtt: {
    host: "mqtt://localhost"
  }
});

obj_agent.addMetric("rss", function getRss() {
  return process.memoryUsage().rss;
});

obj_agent.addMetric("promiseMetric", function getRandomPromise() {
  return Promise.resolve(Math.random());
});

obj_agent.addMetric("callbackMetric", function getRandomCallback(callback) {
  setTimeout(() => {
    callback(null, Math.random());
  }, 1000);
});

obj_agent.connect();

// Solamente del AGENT actual
obj_agent.on("connected", handler);
obj_agent.on("disconnected", handler);
obj_agent.on("message", handler);

// De otros AGENTES
obj_agent.on("agent/connected", handler);
obj_agent.on("agent/desconnected", handler);
obj_agent.on("agent/message", handler);

function handler(payload) {
  console.log(payload);
}

setTimeout(() => obj_agent.disconnect(), 10000);
