const { EmbedBuilder } = require("discord.js");

module.exports = async (client, message) => {
  if (!message.guild || message.author.bot) return;

  // TODO: add server specific prefix
  const prefix = client.config.prefix;

  const prefixRegex = new RegExp(
    `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
  );
  if (!prefixRegex.test(message.content)) return;

  const [, mPrefix] = message.content.match(prefixRegex);

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
    client.commands.find((c) => c.aliases?.includes(cmd.toLowerCase()));
  if (!command)
    return message.channel.send({
      embeds: [
        new EmbedBuilder().setDescription("Unknown command.").setColor("Red"),
      ],
    });

  try {
    await command.run({ client, message, args });
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
};

function escapeRegex(str) {
  try {
    return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
  } catch (e) {
    console.log(e);
  }
}
