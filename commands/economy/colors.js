const { QuickDB } = require("quick.db");
const db = new QuickDB();
const Discord = require("discord.js");

module.exports = {
  name: "colors",
  category: "economy",
  description: "Choose your name color.",
  permissions: [],
  cooldown: 0,
  aliases: ["color"],
  usage: "color [list/use/reset] [color]",
};

module.exports.run = async (client, message, args) => {
  let option = args[0],
    colors = await db.get(`colors_${message.guild.id}_${message.author.id}`) || [];

  if (!option)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "Invalid argument, options: use, list, reset."
        ),
      ],
    });

  if (option.toLowerCase() == "list") {
    if (colors.length == 0)
      return message.channel.send({
        embeds: [
          client.utils.errorEmbed(
            client,
            message,
            "You don't have any colors."
          ),
        ],
      });

    message.channel.send({
      embeds: [
        client
          .embedBuilder(
            client,
            message,
            "",
            `<:ArrowRightGray:813815804768026705> **\`${colors.join(
              "`, `"
            )}\`**.`,
            "#60b8ff"
          )
          .setAuthor({
            name: `You have ${colors.length} colors available`,
            iconURL: `https://cdn.upload.systems/uploads/6uDK0XAN.png`
          }),
      ],
    });
  } else if (option.toLowerCase() == "use") {
    let select = args[1];

    if(!select) return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You must provide color to use."
        ),
      ],
    }); 

    if (!colors.includes(select.toLowerCase()))
      return message.channel.send({
        embeds: [
          client.utils.errorEmbed(
            client,
            message,
            "You don't have that color in your inventory."
          ),
        ],
      });

    let apply = client.conf.Colors.find(
      (c) => c.Name.toLowerCase() == select.toLowerCase()
    );

    if (!apply)
      return message.channel.send({
        embeds: [
          client.utils.errorEmbed(
            client,
            message,
            "You have provided an invalid color."
          ),
        ],
      });

    client.conf.Colors.forEach((m) => {
      if (message.member.roles.cache.has(m.Role))
        message.member.roles.remove(m.Role);
    });

    let color = client.conf.Colors.find(
      (n) => n.Name.toLowerCase() == select.toLowerCase()
    );

    if (message.member.roles.cache.has(color.Role))
      return message.channel.send({
        embeds: [
          client.utils.errorEmbed(
            client,
            message,
            "You already have that color selected."
          ),
        ],
      });

    message.member.roles.add(color.Role);
    message.channel.send({
      embeds: [
        client
          .embedBuilder(client, message, "", "", "#3db39e")
          .setAuthor({
            name: `Color Role ${color.Name} has been equiped.`,
            iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`
          }),
      ],
    });
  } else if (option.toLowerCase() == "reset") {
    client.conf.Colors.forEach((m) => {
      if (message.member.roles.cache.has(m.Role))
        message.member.roles.remove(m.Role);
    });

    message.channel.send({
      embeds: [
        client
          .embedBuilder(client, message, "", "", "#3db39e")
          .setAuthor({
            name: "Your Name Color has been reset.",
            iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`
          }),
      ],
    });
  }
};
