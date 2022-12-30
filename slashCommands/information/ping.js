const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Pings the bot."),
  run: ({ interaction }) => interaction.reply("pong!"),
};
