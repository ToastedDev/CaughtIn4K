const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "prefix",
  description: "Change the prefix for your server.",
  userPermissions: ["ManageGuild"],
  run: ({ client, message, args }) => {
    if (!args[0])
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription("You must specify a prefix.")
            .setColor("Red"),
        ],
      });
    if (args[0].length > 5)
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription("The prefix must be less than 5 characters.")
            .setColor("Red"),
        ],
      });

    client.settings.set(message.guild.id, args[0], "prefix");
    message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setDescription(`Prefix set to \`${args[0]}\`.`)
          .setColor("Green"),
      ],
    });
  },
};
