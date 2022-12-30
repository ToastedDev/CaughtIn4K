const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("editsnipe")
    .setDescription("Snipes an edited message in this channel.")
    .addNumberOption((option) =>
      option
        .setName("position")
        .setDescription("The position of the message.")
        .setRequired(false)
    ),
  run: ({ client, interaction }) => {
    const esnipes = client.esnipes.get(interaction.channel.id);
    if (!esnipes)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("There is nothing to snipe in this channel.")
            .setColor("Red"),
        ],
      });

    let num = interaction.options.getNumber("position") || 1;

    const esnipe = +num - 1 || 0;
    if (esnipes.length < esnipe + 1)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `There ${
                esnipes.length > 1 || esnipes.length === 0 ? "are" : "is"
              } only ${snipes.length} snipeable message${
                esnipes.length > 1 || esnipes.length === 0 ? "s" : ""
              } in this channel.`
            )
            .setColor("Red"),
        ],
      });

    const target = esnipes[esnipe];
    if (!target)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("This snipe has been removed.")
            .setColor("Red"),
        ],
      });

    const { oldmsg, newmsg, time, img } = target;

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("Context")
        .setURL(newmsg.url)
    );

    const embed = new EmbedBuilder()
      .setAuthor({
        name: oldmsg.member.displayName,
        iconURL: oldmsg.member.displayAvatarURL(),
      })
      .addFields(
        {
          name: "Before",
          value: `${oldmsg.content}` || "(no text)",
        },
        {
          name: "After",
          value: `${newmsg.content}` || "(no text)",
        }
      )
      .setImage(img)
      .setColor(client.config.color)
      .setFooter({
        text: `${esnipe + 1}/${esnipes.length}`,
      })
      .setTimestamp(time);

    interaction.reply({ embeds: [embed], components: [row] });
  },
};
