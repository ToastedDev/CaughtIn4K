const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");

module.exports = async (client) => {
  const commands = [];

  fs.readdirSync("./slashCommands/").forEach((dir) => {
    const slashCommandFiles = fs
      .readdirSync(`./slashCommands/${dir}`)
      .filter((file) => file.endsWith(".js"));

    for (const file of slashCommandFiles) {
      const command = require(`../slashCommands/${dir}/${file}`);
      commands.push(command.data.toJSON());
      client.slashCommands.set(command.data.toJSON().name, command);
    }
  });

  client.on("ready", async () => {
    if (client.config.guildId && client.config.guildId.length) {
      const guild = client.guilds.cache.get(client.config.guildId);
      if (!guild)
        return console.log(`No guild found with ID ${client.config.guildId}`);

      guild.commands.set(commands);
      console.log(`Registered commands in ${guild.name}.`);
    } else {
      client.application?.commands.set(commands);
      console.log("Registered commands globally.");
    }
  });
};
