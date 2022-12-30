const {
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("prefix")
    .setDescription("Change the prefix for your server.")
    .addStringOption((option) =>
      option
        .setName("new_prefix")
        .setDescription("The new prefix.")
        .setMaxLength(5)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  run: ({ client, interaction }) => {
    const prefix = interaction.options.getString("new_prefix");

    client.settings.set(interaction.guild.id, prefix, "prefix");
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`Prefix set to \`${prefix}\`.`)
          .setColor("Green"),
      ],
    });
  },
};
