import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { BotClient } from "../../structures/BotClient";
import { SlashCommand } from "../../structures/Command";

export default class Prefix extends SlashCommand {
  constructor(client: BotClient) {
    super(
      client,
      new SlashCommandBuilder()
        .setName("prefix")
        .setDescription("Change the prefix for your server.")
        .addStringOption((option) =>
          option
            .setName("new_prefix")
            .setDescription("The new prefix.")
            .setMaxLength(5)
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    );
  }

  public run(interaction: ChatInputCommandInteraction<"cached" | "raw">) {
    const prefix = interaction.options.getString("new_prefix");

    this.client.settings.set(interaction.guild!.id, prefix, "prefix");
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`Prefix set to \`${prefix}\`.`)
          .setColor("Green"),
      ],
    });
  }
}
