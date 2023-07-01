import { EmbedBuilder, Message } from "discord.js";
import { BotClient } from "../../structures/BotClient";
import { Command } from "../../structures/Command";

export default class OptOut extends Command {
  constructor(client: BotClient) {
    super(client, {
      name: "optout",
      description: "Opt out of sniping.",
    });
  }

  public run(message: Message<boolean>) {
    this.client.settings.ensure(message.author.id, {
      optedout: false,
    });

    const optedout = this.client.settings.get(message.author.id, "optedout");
    if (optedout) {
      this.client.settings.set(message.author.id, false, "optedout");
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription("You are no longer opted out from sniping!")
            .setColor("Green"),
        ],
      });
    } else {
      this.client.settings.set(message.author.id, true, "optedout");
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription("You are now opted out from sniping!")
            .setColor("Green"),
        ],
      });
    }
  }
}
