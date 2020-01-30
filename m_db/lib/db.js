"use strict";

const Sequelize = require("sequelize");
let conexion_sequelize = null;

module.exports = function setupDataBase(config) {
  if (!conexion_sequelize) {
    conexion_sequelize = new Sequelize(config);
  }

  return conexion_sequelize;
};
