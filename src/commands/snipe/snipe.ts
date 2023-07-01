import { AttachmentBuilder, EmbedBuilder, Message } from "discord.js";
import { BotClient } from "../../structures/BotClient";
import { Command } from "../../structures/Command";

export default class Snipe extends Command {
  constructor(client: BotClient) {
    super(client, {
      name: "snipe",
      aliases: ["s"],
      description: "Snipes a deleted message in this channel.",
    });
  }

  public run(message: Message<true>, args: string[]) {
    const snipes = this.client.snipes.get(message.channel.id);
    if (!snipes)
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription("There is nothing to snipe in this channel.")
            .setColor("Red"),
        ],
      });

    const snipe = parseInt(args[0]) - 1 || 0;
    if (snipes.length < snipe + 1)
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `There ${snipes.length !== 1 ? "are" : "is"} only ${
                snipes.length
              } snipeable message${
                snipes.length !== 1 ? "s" : ""
              } in this channel.`
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

    const { message: msg, image, url, type, time, sticker } = target;
    if (!url) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: msg.member!.displayName,
          iconURL: msg.member!.displayAvatarURL(),
        })
        .setDescription(
          msg.content || `[${sticker.name}](${sticker.url})` || null
        )
        .setImage(image)
        .setColor(this.client.config.color)
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
          name: msg.member!.displayName,
          iconURL: msg.member!.displayAvatarURL(),
        })
        .setDescription(`${msg.content}\n\n[Attachment](${url})`)
        .setImage(image)
        .setColor(this.client.config.color)
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
          message.channel.send({ embeds: [embed], files: [file] });
        } else {
          message.channel.send({ embeds: [embed] });
        }
      } else if (type === null) {
        const file = new AttachmentBuilder(url);
        message.channel.send({ embeds: [embed], files: [file] });
      } else return;
    }
  }
}
