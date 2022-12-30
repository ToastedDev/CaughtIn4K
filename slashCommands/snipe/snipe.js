const {
  EmbedBuilder,
  AttachmentBuilder,
  SlashCommandBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("snipe")
    .setDescription("Snipes a deleted message in this channel.")
    .addNumberOption((option) =>
      option
        .setName("position")
        .setDescription("The position of the message.")
        .setRequired(false)
    ),
  run: ({ client, interaction }) => {
    const snipes = client.snipes.get(interaction.channel.id);
    if (!snipes)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("There is nothing to snipe in this channel.")
            .setColor("Red"),
        ],
      });

    let num = interaction.options.getNumber("position") || 1;

    const snipe = +num - 1 || 0;
    if (snipes.length < snipe + 1)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `There ${
                snipes.length > 1 || snipes.length === 0 ? "are" : "is"
              } only ${snipes.length} snipeable message${
                snipes.length > 1 || snipes.length === 0 ? "s" : ""
              } in this channel.`
            )
            .setColor("Red"),
        ],
      });

    const target = snipes[snipe];
    if (!target)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("This snipe has been removed.")
            .setColor("Red"),
        ],
      });

    const { msg, img, url, type, time } = target;
    if (!url) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: msg.member.displayName,
          iconURL: msg.member.displayAvatarURL(),
        })
        .setDescription(`${msg.content || `[${stkname}](${stk})`}` || null)
        .setImage(img)
        .setColor(client.config.color)
        .setFooter({
          text: `${snipe + 1}/${snipes.length}`,
        })
        .setTimestamp(time);

      if (msg.mentions.repliedUser)
        embed.addFields({
          name: "Replied to",
          value: msg.mentions.repliedUser.toString(),
        });

      interaction.reply({ embeds: [embed] });
    } else {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: msg.member.displayName,
          iconURL: msg.member.displayAvatarURL(),
        })
        .setDescription(`${msg.content}\n\n[Attachment](${url})`)
        .setImage(img)
        .setColor(client.config.color)
        .setFooter({
          text: `${snipe + 1}/${snipes.length}`,
        })
        .setTimestamp(time);

      if (msg.mentions.repliedUser)
        embed.addFields({
          name: "Replied to",
          value: msg.mentions.repliedUser.toString(),
        });

      if (type) {
        if (!type.startsWith("image")) {
          const file = new AttachmentBuilder(url);
          interaction.reply({ embeds: [embed], file: [file] });
        } else {
          interaction.reply({ embeds: [embed] });
        }
      } else if (type === null) {
        const file = new AttachmentBuilder(url);
        interaction.reply({ embeds: [embed], file: [file] });
      } else return;
    }
  },
};
