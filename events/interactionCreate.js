const { EmbedBuilder } = require("discord.js");

/**
 * @param {import('discord.js').Interaction} interaction
 */
module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (!interaction.inGuild())
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("Commands can only be ran in a server.")
          .setColor("Red"),
      ],
    });

  const command = client.slashCommands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.run({ client, interaction });
  } catch (err) {
    console.error(err);

    const embed = new EmbedBuilder()
      .addFields({
        name: "An error occured.",
        value: `\`\`\`${err}\`\`\``,
      })
      .setColor("Red");
    if (interaction.replied) interaction.followUp({ embeds: [embed] });
    else interaction.reply({ embeds: [embed] });
  }
};
