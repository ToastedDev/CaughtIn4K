const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "editsnipe",
  aliases: ["es", "esnipe"],
  description: "Snipes an edited message in this channel.",
  run: ({ client, message, args }) => {
    const esnipes = client.esnipes.get(message.channel.id);
    if (!esnipes)
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription("There is nothing to snipe in this channel.")
            .setColor("Red"),
        ],
      });

    const esnipe = +args[0] - 1 || 0;
    if (esnipes.length < esnipe + 1)
      return message.channel.send({
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
      return message.channel.send({
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

    message.channel.send({ embeds: [embed], components: [row] });
  },
};
