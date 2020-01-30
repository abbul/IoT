/* 
"use strict";


async function hanndleEvent(packet) {
  var payload = parsePayload(packet.payload);

  switch (packet.topic) {
    case "agent/connected":
      agentConnect(payload);
      break;
    case "agent/disconnected":
      agentDisconnect(payload);
      break;

    case "agent/message":
      agentMessage(payload);
      break;

    default:
      break;
  }
}

async function agentConnect(payload) {
  return console.log("CONECTADO");
}

async function agentDisconnect(payload) {
  return console.log("DESCONECTADO");
}

async function agentMessage(payload) {
  if (!payload || payload === {}) {
    return;
  }
  payload.agent.connect = true;
  var agent;
  try {
    agent = await Agent.createOrUpdate(payload.agent);
  } catch (e) {
    return handleError(e);
  }

  if (!clients.get(client.id)) {
    clients.set(client.id, agent);
    server.publish({
      topic: "agent/connected",
      payload: JSON.stringify({
        agent
      })
    });
  }
}


async function parsePayload(payload) {
  if (payload instanceof Buffer) {
    payload = payload.toString("utf8");
  }

  try {
    payload = JSON.parse(payload);
  } catch (e) {
    payload = null;
  }

  return payload;
}

module.exports = {
  hanndleEvent
};
 */
