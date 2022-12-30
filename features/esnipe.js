/**
 * @param {import("discord.js").Client} client
 */
module.exports = (client) => {
  client.on("messageUpdate", (oldMessage, newMessage) => {
    if (oldMessage.author.bot) return;

    client.settings.ensure(oldMessage.author.id, {
      optedout: false,
    });
    const optedout = client.settings.get(oldMessage.author.id, "optedout");
    if (optedout) return;

    let esnipes = client.esnipes.get(oldMessage.channel.id) || [];
    if (esnipes.length > 19) esnipes = esnipes.slice(0, 19);

    esnipes.unshift({
      oldmsg: oldMessage,
      newmsg: newMessage,
      img: oldMessage.attachments.first()?.proxyURL || null,
      time: Date.now(),
    });

    client.esnipes.set(oldMessage.channel.id, esnipes);
  });
};
