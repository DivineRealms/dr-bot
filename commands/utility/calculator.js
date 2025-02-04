const { ApplicationCommandOptionType } = require("discord.js");
const { evaluate } = require("mathjs");

module.exports = {
  name: "calculator",
  category: "utility",
  description: "Does your math homework for you!",
  permissions: [],
  cooldown: 0,
  aliases: ["solve", "math"],
  usage: "calculator <Problem>",
  slash: true,
  options: [
    {
      name: "expression",
      description: "Solve math. expression",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};

module.exports.run = async (client, message, args) => {
  if (!args[0])
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "Please provide a problem."),
      ],
    });

  try {
    message.channel.send({
      embeds: [
        client
          .embedBuilder(client, message, "Calculator", "")
          .addFields([
            { name: "📥︲Problem:", value: "```\n" + args.join(" ") + "```" },
            {
              name: "📤︲Solution:",
              value: "```\n" + evaluate(args.join(" ")) + "```",
            },
          ]),
      ],
    });
  } catch (e) {
    message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "Please provide a problem."),
      ],
    });
  }
};

module.exports.slashRun = async (client, interaction) => {
  try {
    interaction.reply({
      embeds: [
        client
          .embedBuilder(client, interaction, "Calculator", "")
          .addFields([
            {
              name: "📥︲Problem:",
              value:
                "```\n" + interaction.options.getString("expression") + "```",
            },
            {
              name: "📤︲Solution:",
              value:
                "```\n" +
                evaluate(interaction.options.getString("expression")) +
                "```",
            },
          ]),
      ],
    });
  } catch (e) {
    interaction.reply({
      embeds: [
        client.utils.errorEmbed(client, interaction, "Please provide a expression."),
      ],
      ephemeral: true,
    });
  }
};
