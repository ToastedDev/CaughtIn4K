import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Message,
} from "discord.js";
import { BotClient } from "../../structures/BotClient";
import { Command } from "../../structures/Command";

export default class EditSnipe extends Command {
  constructor(client: BotClient) {
    super(client, {
      name: "editsnipe",
      aliases: ["es", "esnipe"],
      description: "Snipes an edited message in this channel.",
    });
  }

  public run(message: Message<true>, args: string[]) {
    const esnipes = this.client.esnipes.get(message.channel.id);
    if (!esnipes)
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription("There is nothing to snipe in this channel.")
            .setColor("Red"),
        ],
      });

    const esnipe = parseInt(args[0]) - 1 || 0;
    if (esnipes.length < esnipe + 1)
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `There ${esnipes.length !== 1 ? "are" : "is"} only ${
                esnipes.length
              } snipeable message${
                esnipes.length !== 1 ? "s" : ""
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

    const { oldMessage, newMessage, time, image } = target;

    message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: newMessage.member!.displayName,
            iconURL: newMessage.member!.displayAvatarURL(),
          })
          .addFields(
            {
              name: "Before",
              value: `${oldMessage.content}` || "(no text)",
            },
            {
              name: "After",
              value: `${oldMessage.content}` || "(no text)",
            }
          )
          .setImage(image)
          .setColor(this.client.config.color)
          .setFooter({
            text: `${esnipe + 1}/${esnipes.length}`,
          })
          .setTimestamp(time),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel("Context")
            .setURL(newMessage.url)
        ),
      ],
    });
  }
}
