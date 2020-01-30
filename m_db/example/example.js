"use strict";

const db = require("../");

async function run() {
  const config = {
    database: process.env.DB_NAME || "creando_modulos",
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "35682751.aA",
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql"
  };

  const { Agent, Metric } = await db(config).catch(handleFatalError);

  const obj_agent = await Agent.createOrUpdate({
    uuid: "dos",
    name: "abbul",
    username: "kaka",
    hostname: "test",
    pid: 1,
    connected: true
  }).catch(handleFatalError);

  const all_agents = await Agent.findAll().catch(handleFatalError);

  const obj_metric = await Metric.create(obj_agent.uuid, {
    type: "tipo",
    value: "300"
  }).catch(handleFatalError);
}

function handleFatalError(err) {
  console.log(err.message);
  console.log(err.stack);
  process.exit(1);
}

run();
