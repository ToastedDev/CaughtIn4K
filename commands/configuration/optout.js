const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "optout",
  description: "Opt out of sniping.",
  run: ({ client, message }) => {
    client.settings.ensure(message.author.id, {
      optedout: false,
    });

    const optedout = client.settings.get(message.author.id, "optedout");
    if (optedout) {
      client.settings.set(message.author.id, false, "optedout");
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription("You are no longer opted out from sniping!")
            .setColor("Green"),
        ],
      });
    } else {
      client.settings.set(message.author.id, true, "optedout");
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription("You are now opted out from sniping!")
            .setColor("Green"),
        ],
      });
    }
  },
};
