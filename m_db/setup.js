"use strict";

const db = require("./");

async function setup(deleteDB) {
  if (!deleteDB) {
    return process.exit(0);
  }

  const config = {
    database: process.env.DB_NAME || "creando_modulos",
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "35682751.aA",
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    setup: true
  };

  await db(config).catch(handleFatalError);
  process.exit(0);
}

function handleFatalError(err) {
  console.log(`ERROR = ${err.message}`);
  console.log(`ERROR SEQUELIZE  = ${err.stack}`);
  process.exit(1);
}

setup();
