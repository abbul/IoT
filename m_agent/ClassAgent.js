"use strict";

const EventEmitter = require("events");
const uuid = require("uuid");
const os = require("os");
const util = require("util");
const mqtt = require("mqtt");

class ClassAgent extends EventEmitter {
  constructor(opts) {
    super();
    this._options = opts;
    this._started = false;
    this._timer = null;
    this._client = null;
    this._agentID = null;
    this._metrics = new Map();
  }

  connect() {
    if (!this._started) {
      this._client = mqtt.connect(this._options.mqtt.host);
      this._started = true;

      this._client.subscribe("agent/message");
      this._client.subscribe("agent/connected");
      this._client.subscribe("agent/disconnected");

      this._client.on("connect", () => {
        this._agentID = uuid.v4();
        this.emit("connected", this._agentID);
        this._timer = setInterval(async () => {
          if (this._metrics.size > 0) {
            let message = {
              agent: {
                uuid: this._agentID,
                username: this._options.username,
                name: this._options.name,
                hostname: os.hostname() || "localhost",
                pid: process.id
              },
              metrics: [],
              timestamp: new Date().getTime()
            };

            for (let [metric, fn] of this._metrics) {
              if (fn.length == 1) {
                fn = util.promisify(fn);
              }

              message.metrics.push({
                type: metric,
                value: await Promise.resolve(fn())
              });
            }
            this._client.publish("agent/message", JSON.stringify(message));
            this.emit("message", message);
          }
        }, this._options.interval);
      });
      this._client.on("message", (topic, payload) => {
        payload = this.parsePayload(payload);
        let broadcast = false;
        switch (topic) {
          case ("agent/connected", "agent/disconnected", "agent/message"):
            broadcast = payload && payload.agent && payload.agent.uuid !== this._agentID;
            break;
        }
        if (broadcast) {
          this.emit(topic, payload);
        }
      });
      this._client.on("error", () => {
        this.disconnect();
      });
    }
  }

  disconnect() {
    if (this._started) {
      clearInterval(this._timer);
      this._started = false;
      this.emit("disconnected", this._agentID);
      this._client.end();
    }
  }

  addMetric(type, fn) {
    this._metrics.set(type, fn);
  }

  removeMetric(type) {
    this._metrics.delete(type);
  }

  parsePayload(payload) {
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
}

module.exports = {
  ClassAgent
};
