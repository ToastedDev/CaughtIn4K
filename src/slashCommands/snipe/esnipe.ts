import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { BotClient } from "../../structures/BotClient";
import { SlashCommand } from "../../structures/Command";

export default class EditSnipe extends SlashCommand {
  constructor(client: BotClient) {
    super(
      client,
      new SlashCommandBuilder()
        .setName("editsnipe")
        .setDescription("Snipes an edited message in this channel.")
        .addNumberOption((option) =>
          option
            .setName("position")
            .setDescription("The position of the message.")
            .setRequired(false)
        )
    );
  }

  public run(interaction: ChatInputCommandInteraction<"cached" | "raw">) {
    const esnipes = this.client.esnipes.get(interaction.channel!.id);
    if (!esnipes)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("There is nothing to snipe in this channel.")
            .setColor("Red"),
        ],
      });

    let num = interaction.options.getNumber("position") || 1;

    const esnipe = num - 1 || 0;
    if (esnipes.length < esnipe + 1)
      return interaction.reply({
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
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("This snipe has been removed.")
            .setColor("Red"),
        ],
      });

    const { oldMessage, newMessage, time, image } = target;

    interaction.reply({
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
              value: `${newMessage.content}` || "(no text)",
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
