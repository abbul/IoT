"use strict";

module.exports =
  /**
   *
   * @param {Boolean} deleteDB Indicamos si queremos hacer el DROP de la base de datos
   * @return {JSON} Retornara todos los datos de configuracion para la base de datos
   */
  function(deleteDB) {
    return {
      database: process.env.DB_NAME || "creando_modulos",
      username: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "35682751.aA",
      host: process.env.DB_HOST || "localhost",
      dialect: "mysql",
      setup: deleteDB || false
    };
  };
