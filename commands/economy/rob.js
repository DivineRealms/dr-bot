const { ApplicationCommandOptionType } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "rob",
  category: "economy",
  description: "Try to rob that one dood you want.",
  permissions: [],
  cooldown: 120,
  aliases: ["r0b"],
  usage: "rob <@User>",
  slash: true,
  options: [{
    name: "user",
    description: "User you want to rob",
    type: ApplicationCommandOptionType.User,
    required: true
  }]
};

module.exports.run = async (client, message, args) => {
  const member =
    message.mentions.members.first() ||
    message.guild.members.cache.get(args[0]);

  if (!member)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "You need to provide a user."),
      ],
    });

  if (member.id === message.author.id)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "You cannot rob yourself."),
      ],
    });

  const memberbal = await db.get(`money_${message.guild.id}_${member.id}`);
  let rob = ~~(Math.random() * 3);
  let amount = ~~(memberbal / 10);

  if (!memberbal || memberbal < 200)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "That Member doesn't have money."
        ),
      ],
    });

  if (rob) {
    message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          `You attempted to rob ${member.user.username} but got caught! The fine is $${amount}.`
        ),
      ],
    });

    await db.sub(`money_${message.guild.id}_${message.author.id}`, amount);
    await db.add(`money_${message.guild.id}_${member.id}`, amount);
  } else {
    message.channel.send({
      embeds: [
        client.embedBuilder(client, message, "", "", "#47a047").setAuthor({
          name: `You successfully robbed ${member.user.username} gaining yourself $${amount}.`,
          iconURL: `https://cdn.upload.systems/uploads/LrdB6F1N.png`,
        }),
      ],
    });

    await db.sub(`money_${message.guild.id}_${member.id}`, amount);
    await db.add(`money_${message.guild.id}_${message.author.id}`, amount);
  }
};
