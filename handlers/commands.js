const fs = require("fs");

module.exports = (client) => {
  fs.readdirSync("./commands").forEach((dir) => {
    const commandFiles = fs
      .readdirSync(`./commands/${dir}`)
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(`../commands/${dir}/${file}`);
      if (!command.name || !command.run) return;

      client.commands.set(command.name, { directory: dir, ...command });
    }
  });
};
