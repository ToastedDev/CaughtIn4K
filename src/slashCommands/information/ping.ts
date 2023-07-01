import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { BotClient } from "../../structures/BotClient";
import { SlashCommand } from "../../structures/Command";

export default class Ping extends SlashCommand {
  constructor(client: BotClient) {
    super(
      client,
      new SlashCommandBuilder().setName("ping").setDescription("Pings the bot.")
    );
  }

  public run(interaction: ChatInputCommandInteraction<"cached" | "raw">) {
    interaction.reply("pong!");
  }
}
