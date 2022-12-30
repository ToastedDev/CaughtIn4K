const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

module.exports = {
  name: "snipe",
  description: "Snipes a deleted message in this channel.",
  /**
   * @param {{ client: import('discord.js').Client, message: import('discord.js').Message, args: string[] }} params
   */
  run: ({ client, message, args }) => {
    const snipes = client.snipes.get(message.channel.id);
    if (!snipes)
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription("There is nothing to snipe in this channel.")
            .setColor("Red"),
        ],
      });

    const snipe = +args[0] - 1 || 0;
    if (snipe > snipes.length)
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `There are only ${snipes.length} messages to snipe in this channel.`
            )
            .setColor("Red"),
        ],
      });

    const target = snipes[snipe];
    if (!target)
      return message.channel.send({
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

      message.channel.send({ embeds: [embed] });
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
          message.channel.send({ embeds: [embed], file: [file] });
        } else {
          message.channel.send({ embeds: [embed] });
        }
      } else if (type === null) {
        const file = new AttachmentBuilder(url);
        message.channel.send({ embeds: [embed], file: [file] });
      } else return;
    }
  },
};
