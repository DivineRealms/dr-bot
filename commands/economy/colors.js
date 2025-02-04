const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "colors",
  category: "economy",
  description: "Choose your name color.",
  permissions: [],
  cooldown: 0,
  aliases: ["color"],
  usage: "color [list/use/reset] [color]",
  slash: true,
  options: [
    {
      name: "action",
      description: "Action you want to do",
      type: ApplicationCommandOptionType.String,
      choices: [
        {
          name: "Use",
          value: "use",
        },
        {
          name: "List",
          value: "list",
        },
        {
          name: "Reset",
          value: "reset",
        },
      ],
      required: true,
    },
    {
      name: "color",
      description: "Color you want to use",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
};

module.exports.run = async (client, message, args) => {
  let option = args[0],
    colors =
      (await db.get(`colors_${message.guild.id}_${message.author.id}`)) || [];

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
          .embedBuilder(client, message, `You have ${colors.length} colors available`,
            `<:ArrowRightGray:813815804768026705> **\`${colors.join(
              "`, `"
            )}\`**.`,
            "#60b8ff"
          ),
      ],
    });
  } else if (option.toLowerCase() == "use") {
    let select = args[1];

    if (!select)
      return message.channel.send({
        embeds: [
          client.utils.errorEmbed(client,  message, "You must provide color to use."),
        ],
      });

    if (!colors.includes(select.toLowerCase()))
      return message.channel.send({
        embeds: [
          client.utils.errorEmbed(client, message, "You don't have that color in your inventory."),
        ],
      });

    let apply = client.conf.Colors.find(
      (c) => c.Name.toLowerCase() == select.toLowerCase()
    );

    if (!apply)
      return message.channel.send({
        embeds: [
          client.utils.errorEmbed(client, message, "You have provided an invalid color."),
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
          client.utils.errorEmbed(client, message, "You already have that color selected."),
        ],
      });

    message.member.roles.add(color.Role);
    message.channel.send({
      embeds: [
        client.embedBuilder(client, message, `Color Role ${color.Name} has been equiped.`, "", "#3db39e"),
      ],
    });
  } else if (option.toLowerCase() == "reset") {
    client.conf.Colors.forEach((m) => {
      if (message.member.roles.cache.has(m.Role))
        message.member.roles.remove(m.Role);
    });

    message.channel.send({
      embeds: [
        client.embedBuilder(client, message, "Your Name Color has been reset.", "", "#3db39e"),
      ],
    });
  }
};

module.exports.slashRun = async (client, interaction) => {
  let option = interaction.options.getString("action"),
    colors =
      (await db.get(`colors_${interaction.guild.id}_${interaction.user.id}`)) ||
      [];

  if (!option)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(client, interaction, "Invalid argument, options: use, list, reset."),
      ],
      ephemeral: true,
    });

  if (option == "list") {
    if (colors.length == 0)
      return interaction.reply({
        embeds: [
          client.utils.errorEmbed(client, interaction, "You don't have any colors."),
        ],
        ephemeral: true,
      });

    interaction.reply({
      embeds: [
        client
          .embedBuilder(client, interaction, `You have ${colors.length} colors available`,
            `<:ArrowRightGray:813815804768026705> **\`${colors.join(
              "`, `"
            )}\`**.`,
            "#60b8ff"
          ),
      ],
    });
  } else if (option == "use") {
    let select = interaction.options.getString("color");

    if (!select)
      return interaction.reply({
        embeds: [
          client.utils.errorEmbed(client, interaction, "You must provide color to use."),
        ],
        ephemeral: true,
      });

    if (!colors.includes(select.toLowerCase()))
      return interaction.reply({
        embeds: [
          client.utils.errorEmbed(client, interaction, "You don't have that color in your inventory."),
        ],
        ephemeral: true,
      });

    let apply = client.conf.Colors.find(
      (c) => c.Name.toLowerCase() == select.toLowerCase()
    );

    if (!apply)
      return interaction.reply({
        embeds: [
          client.utils.errorEmbed(client, interaction, "You have provided an invalid color."),
        ],
        ephemeral: true,
      });

    client.conf.Colors.forEach((m) => {
      if (interaction.member.roles.cache.has(m.Role))
        interaction.member.roles.remove(m.Role);
    });

    let color = client.conf.Colors.find(
      (n) => n.Name.toLowerCase() == select.toLowerCase()
    );

    if (interaction.member.roles.cache.has(color.Role))
      return interaction.reply({
        embeds: [
          client.utils.errorEmbed(client, interaction, "You already have that color selected."),
        ],
        ephemeral: true,
      });

    interaction.member.roles.add(color.Role);
    interaction.reply({
      embeds: [
        client.embedBuilder(client, interaction, `Color Role ${color.Name} has been equiped.`, "", "#3db39e"),
      ],
    });
  } else if (option == "reset") {
    client.conf.Colors.forEach((m) => {
      if (interaction.member.roles.cache.has(m.Role))
        interaction.member.roles.remove(m.Role);
    });

    interaction.reply({
      embeds: [
        client.embedBuilder(client, interaction, "Your Name Color has been reset.", "", "#3db39e"),
      ],
    });
  }
};
