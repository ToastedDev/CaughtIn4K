import { EmbedBuilder } from "discord.js";
import { Event } from "../structures/Event";

export default new Event({
  name: "messageCreate",
  run: async (client, message) => {
    if (!message.inGuild() || message.author.bot) return;

    client.settings.ensure(message.guild.id, {
      prefix: client.config.prefix,
    });

    const prefix = client.settings.get(message.guild.id, "prefix");

    const prefixRegex = new RegExp(
      `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
    );
    if (!prefixRegex.test(message.content)) return;

    const [, mPrefix] = message.content.match(prefixRegex) || [];

    const [cmd, ...args] = message.content
      .slice(mPrefix.length)
      .trim()
      .split(/ +/);
    if (
      (!cmd || !cmd.length || cmd.length === 0) &&
      mPrefix.includes(client.user.id)
    )
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription(`My prefix here is \`${prefix}\`.`)
            .setColor(client.config.color),
        ],
      });

    const command =
      client.commands.get(cmd.toLowerCase()) ||
      client.commands.find((c) => c.data.aliases?.includes(cmd.toLowerCase()));
    if (!command)
      return message.channel.send({
        embeds: [
          new EmbedBuilder().setDescription("Unknown command.").setColor("Red"),
        ],
      });
    if (
      command.data.userPermissions &&
      !message.member!.permissions.has(command.data.userPermissions)
    )
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription("You don't have permission to run that command.")
            .setColor("Red"),
        ],
      });

    try {
      await command.run(message, args);
    } catch (err) {
      console.error(err);
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .addFields({
              name: "An error occured.",
              value: `\`\`\`${err}\`\`\``,
            })
            .setColor("Red"),
        ],
      });
    }
  },
});

function escapeRegex(str: string) {
  try {
    return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
  } catch (e) {
    console.log(e);
  }
}
