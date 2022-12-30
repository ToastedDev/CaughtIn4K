const { Collection } = require("discord.js");

module.exports = (client) => {
  client.snipes = new Collection();
  client.esnipes = new Collection();
};
