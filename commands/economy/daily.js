const db = require("quick.db");

module.exports = {
  name: "daily",
  category: "economy",
  description: "Claim that daily reward of yours.",
  permissions: [],
  cooldown: 0,
  aliases: [],
  usage: "daily",
};

module.exports.run = async (client, message, args) => {
  let cooldown = db.fetch(`daily_${message.guild.id}_${message.author.id}`),
    day = 86400000;

  if (cooldown != null && day - (Date.now() - cooldown) > 0)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You're on cooldown, try again later."
        ),
      ],
    });

  message.channel.send({
    embeds: [
      client
        .embedBuilder(client, message, "", "", "#3db39e")
        .setAuthor(
          "You have claimed your Daily Reward of $2500.",
          `https://cdn.upload.systems/uploads/6KOGFYJM.png`
        ),
    ],
  });

  db.add(`money_${message.guild.id}_${message.author.id}`, 2500);
  db.set(`daily_${message.guild.id}_${message.author.id}`, Date.now());
};
