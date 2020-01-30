"use strict";

module.exports = function setupAgent(AgentModel) {
  async function createOrUpdate(agent) {
    const cond = {
      where: {
        uuid: agent.uuid
      }
    };

    const existingAgent = await AgentModel.findOne(cond);

    if (existingAgent) {
      const updated = await AgentModel.update(agent, cond);
      return updated ? AgentModel.findOne(cond) : existingAgent;
    }
    const result = await AgentModel.create(agent);
    return result.toJSON();
  }
  async function findById(id) {
    return AgentModel.findById(id);
  }
  async function findByUuid(uuid) {
    return AgentModel.findOne({
      where: {
        uuid
      }
    });
  }
  async function findAll() {
    return AgentModel.findAll();
  }
  async function findConnected() {
    return AgentModel.findAll({
      where: {
        connected: true
      }
    });
  }
  async function findByUserName(username) {
    return AgentModel.findAll({
      where: {
        username,
        connected: true
      }
    });
  }
  return {
    createOrUpdate,
    findById,
    findByUuid,
    findAll,
    findConnected,
    findByUserName
  };
};
