/**
 * @param {import("discord.js").Client} client
 */
module.exports = (client) => {
  client.on("messageDelete", (message) => {
    if (message.author.bot) return;

    client.settings.ensure(message.author.id, {
      optedout: false,
    });
    const optedout = client.settings.get(message.author.id, "optedout");
    if (optedout) return;

    let snipes = client.snipes.get(message.channel.id) || [];
    if (snipes.length > 19) snipes = snipes.slice(0, 19);

    snipes.unshift({
      msg: message,
      img: message.attachments.first()?.proxyURL || null,
      url: message.attachments.first()?.url || null,
      type: message.attachments.first()?.contentType || null,
      stkname: message.stickers.first()?.name || null,
      stk: message.stickers.first()?.url || null,
      time: Date.now(),
    });

    client.snipes.set(message.channel.id, snipes);
  });
};
