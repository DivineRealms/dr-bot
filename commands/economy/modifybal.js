const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "modifybal",
  category: "economy",
  description: "Remove or add money to a user on the server.",
  permissions: ["ADMINISTRATOR"],
  cooldown: 0,
  aliases: ["modifyb"],
  usage: "modifybal [@User] <add | remove> <wallet | bank> <amount>",
};

module.exports.run = async (client, message, args) => {
  const user =
    message.mentions.users.first() || client.users.cache.get(args[0]);

  if (!user)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "You need to mention a user."),
      ],
    });

  if (!["add", "remove"].includes(args[1]))
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You need to specify do you want to add or remove."
        ),
      ],
    });

  if (!["wallet", "bank"].includes(args[2]))
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You need to specify if you want wallet or bank."
        ),
      ],
    });

  if (isNaN(args[3]) || args[3] < 1)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You need to enter an amount."
        ),
      ],
    });

  if (args[1].toLowerCase() == "add") {
    if (args[2].toLowerCase() == "bank") {
      await db.add(`bank_${message.guild.id}_${user.id}`, Number(args[3]));
      message.channel.send({
        embeds: [
          client.embedBuilder(client, message, "", "", "#3db39e").setAuthor({
            name: `$${args[3]} has been added to ${user.username}'s bank`,
            iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
          }),
        ],
      });
    } else if (args[2].toLowerCase() == "wallet") {
      await db.add(`money_${message.guild.id}_${user.id}`, Number(args[3]));
      message.channel.send({
        embeds: [
          client.embedBuilder(client, message, "", "", "#3db39e").setAuthor({
            name: `$${args[3]} has been added to ${user.username}'s wallet`,
            iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
          }),
        ],
      });
    }
  } else if (args[1].toLowerCase() == "remove") {
    if (args[2].toLowerCase() == "bank") {
      await db.sub(`bank_${message.guild.id}_${user.id}`, Number(args[3]));
      message.channel.send({
        embeds: [
          client.embedBuilder(client, message, "", "", "#3db39e").setAuthor({
            name: `$${args[3]} has been removed from ${user.username}'s bank`,
            iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
          }),
        ],
      });
    } else if (args[2].toLowerCase() == "wallet") {
      await db.sub(`money_${message.guild.id}_${user.id}`, Number(args[3]));
      message.channel.send({
        embeds: [
          client.embedBuilder(client, message, "", "", "#3db39e").setAuthor({
            name: `$${args[3]} has been removed from ${user.username}'s wallet`,
            iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
          }),
        ],
      });
    }
  }
};
