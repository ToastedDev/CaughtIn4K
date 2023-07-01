import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  Message,
  PermissionResolvable,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  SlashCommandBuilder,
} from "discord.js";
import { BotClient } from "./BotClient";

interface CommandData {
  name: string;
  description: string;
  aliases?: string[];
  userPermissions?: PermissionResolvable[];
}

export class Command {
  public client: BotClient;
  public data: CommandData;

  constructor(client: BotClient, data: CommandData) {
    this.client = client;
    this.data = data;
  }

  public run(message: Message<true>, args: string[]): any {
    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("This command hasn't been worked on yet.")
          .setColor("Red"),
      ],
    });
  }
}

export class SlashCommand {
  public client: BotClient;
  public data: RESTPostAPIChatInputApplicationCommandsJSONBody;

  constructor(
    client: BotClient,
    data:
      | SlashCommandBuilder
      | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
  ) {
    this.client = client;
    this.data = data.toJSON();
  }

  public run(interaction: ChatInputCommandInteraction<"cached" | "raw">): any {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("This command hasn't been worked on yet.")
          .setColor("Red"),
      ],
      ephemeral: true,
    });
  }
}
