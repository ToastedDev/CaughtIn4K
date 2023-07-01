import { EmbedBuilder, Message } from "discord.js";
import { BotClient } from "../../structures/BotClient";
import { Command } from "../../structures/Command";

export default class Prefix extends Command {
  constructor(client: BotClient) {
    super(client, {
      name: "prefix",
      description: "Change the prefix for your server.",
      userPermissions: ["ManageGuild"],
    });
  }

  public run(message: Message<true>, args: string[]) {
    if (!args[0])
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription("You must specify a prefix.")
            .setColor("Red"),
        ],
      });
    if (args[0].length > 5)
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription("The prefix must be less than 5 characters.")
            .setColor("Red"),
        ],
      });

    this.client.settings.set(message.guild.id, args[0], "prefix");
    message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setDescription(`Prefix set to \`${args[0]}\`.`)
          .setColor("Green"),
      ],
    });
  }
}
