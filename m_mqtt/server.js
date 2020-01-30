"use strict";
//const mqtt = require("mqtt");
//const client = mqtt.connect("mqtt://test.mosquitto.org");
const mosca = require("mosca");
const redis = require("redis");
const db = require("m_db");
const configDB = require("./configDB")(false);
const { parsePayload } = require("./utils");

const backend = {
  type: "redis",
  redis,
  return_buffers: true
};

const settings = {
  port: 1883,
  backend
};

const server = new mosca.Server(settings);
const clients = new Map();
let Agent, Metric;

server.on("clientConnected", client => {
  console.log(`Cliente conectado... ${client.id}`);
  clients.set(client.id, null);
});

server.on("clientDisconnected", async client => {
  const agent = clients.get(client.id);
  if (agent) {
    try {
      agent.connected = false;
      await Agent.createOrUpdate(agent);
      clients.delete(client.id);
      server.publish({
        topic: "agent/disconnected",
        payload: JSON.stringify({
          uuid: agent.uuid
        })
      });
      console.info("AGENT DESCONETADO");
    } catch (e) {
      handleError(e);
    }
  }
});

server.on("published", async (packet, client) => {
  switch (packet.topic) {
    case ("agent/connected", "agent/disconnected"):
      console.log(`PAYLOAD: ${packet.payload}`);
      break;

    case "agent/message":
      var payload = await parsePayload(packet.payload);

      if (payload) {
        try {
          console.log(payload);
          payload.agent.connected = true;
          var agent;
          agent = await Agent.createOrUpdate(payload.agent);
        } catch (e) {
          return handleError(e);
        }

        if (!clients.get(client.id)) {
          clients.set(client.id, agent);
          server.publish({
            topic: "agent/connected",
            payload: JSON.stringify({
              agent: {
                uuid: agent.uuid,
                name: agent.name,
                hostname: agent.hostname,
                pid: agent.pid,
                connected: agent.connected
              }
            })
          });
        }

        for (const metric of payload.metrics) {
          try {
            await Metric.create(agent.uuid, metric);
          } catch (e) {
            return handleError(e);
          }
        }
      }

      break;
  }
});

server.on("ready", async () => {
  const services = await db(configDB).catch(handleFatalError);
  Agent = services.Agent;
  Metric = services.Metric;
  console.log(`Server Is Running`);
});

server.on("error", handleFatalError);

function handleFatalError(err) {
  console.error(`ERROR FATAL : ${err.message}`);
  console.error(`ERROR INSTANCE : ${err.stack}`);
  process.exit(1);
}

function handleError(err) {
  console.error(`ERROR : ${err.message}`);
  console.error(`ERROR INSTANCE : ${err.stack}`);
}

process.on("uncaughtException", handleFatalError);
process.on("unhandledRejection", handleFatalError);
