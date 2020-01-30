"use strict";

/**
 * Obtemos el mensaje y lo retornamos como JSON
 * @param {Buffer | String } payload Es el mensaje que recibimos
 * @return {JSON} Retornara el mensaje en formato JSON
 */
function parsePayload(payload) {
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
  parsePayload
};
