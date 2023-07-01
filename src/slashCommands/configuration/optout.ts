import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { BotClient } from "../../structures/BotClient";
import { SlashCommand } from "../../structures/Command";

export class OptOut extends SlashCommand {
  constructor(client: BotClient) {
    super(
      client,
      new SlashCommandBuilder()
        .setName("optout")
        .setDescription("Opt out of sniping.")
    );
  }

  public run(interaction: ChatInputCommandInteraction) {
    this.client.settings.ensure(interaction.user.id, {
      optedout: false,
    });

    const optedout = this.client.settings.get(interaction.user.id, "optedout");
    if (optedout) {
      this.client.settings.set(interaction.user.id, false, "optedout");
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("You are no longer opted out from sniping!")
            .setColor("Green"),
        ],
        ephemeral: true,
      });
    } else {
      this.client.settings.set(interaction.user.id, true, "optedout");
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("You are now opted out from sniping!")
            .setColor("Green"),
        ],
        ephemeral: true,
      });
    }
  }
}
