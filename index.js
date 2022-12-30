require("dotenv/config");

const {
  Client,
  GatewayIntentBits,
  Collection,
  Partials,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Object.keys(Partials)],
});
client.config = require("./config.json");
client.commands = new Collection();
client.slashCommands = new Collection();

["commands", "slashCommands", "events", "features", "collections"].forEach(
  (handler) => {
    require(`./handlers/${handler}`)(client);
  }
);

client.login(process.env.TOKEN);
