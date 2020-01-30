"user strict";

const Sequelize = require("sequelize");
const setupDataBase = require("../lib/db");

module.exports = function setupMetricModel(config) {
  const instance_sequelize = setupDataBase(config);

  return instance_sequelize.define("metric", {
    type: {
      type: Sequelize.STRING,
      allowNull: false
    },
    value: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });
};
