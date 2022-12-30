const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("optout")
    .setDescription("Opt out of sniping."),
  run: ({ client, interaction }) => {
    client.settings.ensure(interaction.user.id, {
      optedout: false,
    });

    const optedout = client.settings.get(interaction.user.id, "optedout");
    if (optedout) {
      client.settings.set(interaction.user.id, false, "optedout");
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("You are no longer opted out from sniping!")
            .setColor("Green"),
        ],
        ephemeral: true,
      });
    } else {
      client.settings.set(interaction.user.id, true, "optedout");
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("You are now opted out from sniping!")
            .setColor("Green"),
        ],
        ephemeral: true,
      });
    }
  },
};
