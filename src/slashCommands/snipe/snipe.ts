import {
  AttachmentBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { BotClient } from "../../structures/BotClient";
import { SlashCommand } from "../../structures/Command";

export default class Snipe extends SlashCommand {
  constructor(client: BotClient) {
    super(
      client,
      new SlashCommandBuilder()
        .setName("snipe")
        .setDescription("Snipes a deleted message in this channel.")
        .addNumberOption((option) =>
          option
            .setName("position")
            .setDescription("The position of the message.")
            .setRequired(false)
        )
    );
  }

  public run(interaction: ChatInputCommandInteraction<"cached" | "raw">) {
    const snipes = this.client.snipes.get(interaction.channel!.id);
    if (!snipes)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("There is nothing to snipe in this channel.")
            .setColor("Red"),
        ],
      });

    let num = interaction.options.getNumber("position") || 1;

    const snipe = num - 1 || 0;
    if (snipes.length < snipe + 1)
      return interaction.reply({
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
      return interaction.reply({
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

      interaction.reply({ embeds: [embed] });
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
          interaction.reply({ embeds: [embed], files: [file] });
        } else {
          interaction.reply({ embeds: [embed] });
        }
      } else if (type === null) {
        const file = new AttachmentBuilder(url);
        interaction.reply({ embeds: [embed], files: [file] });
      } else return;
    }
  }
}
