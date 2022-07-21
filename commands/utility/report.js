module.exports = {
  name: "report",
  category: "utility",
  description: "Lets you submit a report.",
  permissions: [],
  cooldown: 0,
  aliases: [`rep`],
  usage: "report <Report>",
};

module.exports.run = async (client, message, args) => {
  let logChannel = client.channels.cache.get(client.conf.Logging.Reports);

  let user =
    message.mentions.members.first() || client.users.cache.get(args[0]);

  if (!logChannel)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "A report channel hasn't been setup for this server!"
        ),
      ],
    });

  if (!args[0])
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "Please provide a report."),
      ],
    });

  setTimeout(() => message.delete(), 1000);

  message.channel
    .send({
      embeds: [
        client
          .embedBuilder(client, message, "", "", "#3db39e")
          .setAuthor({
            name: `Your report was submitted!`,
            iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`
          }),
      ],
    })
    .then((msg) => setTimeout(() => msg.delete(), 3000));

  let embed = client
    .embedBuilder(client, message, "", "")
    .addFields({ name: "Submitter:", value: `${message.author}`, inline: false })
    .addFields({ name: "Timestamp:", value: `<t:${Math.round(Date.now() / 1000)}:R>`, inline: false })
    .setAuthor({ name: "New Report", iconURL: `https://cdn.upload.systems/uploads/iHhkS5zu.png` })
    .setThumbnail(
      message.author.displayAvatarURL({ size: 1024, dynamic: true })
    );

  if (user) {
    embed
      .addFields({ name: "Reported:", value: `${user}`, inline: false })
      .addFields({ name: "Reason:", value: `**\`${args.slice(1).join(" ")}\`**`, inline: false });

    logChannel.send({ embeds: [embed] });
  } else {
    logChannel.send({
      embeds: [
        embed.addFields({ name: "Report reason:", value: `**\`${args.join(" ")}\`**`, inline: false }),
      ],
    });
  }
};
