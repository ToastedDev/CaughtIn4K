import { Message } from "discord.js";
import { BotClient } from "../../structures/BotClient";
import { Command } from "../../structures/Command";

export default class Ping extends Command {
  constructor(client: BotClient) {
    super(client, {
      name: "ping",
      description: "Pings the bot.",
    });
  }

  public run(message: Message<true>) {
    message.reply("pong!");
  }
}
