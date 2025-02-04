const { ApplicationCommandOptionType } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "trumptweet",
  category: "fun",
  description: "Tweet as trump.",
  permissions: [],
  cooldown: 0,
  aliases: ["trumptwt"],
  usage: "trumptweet <Message>",
  slash: true,
  options: [
    {
      name: "message",
      description: "Message you want Trump to tweet",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};

module.exports.run = async (client, message, args) => {
  if (!args[0])
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "You need to provide a message."),
      ],
    });

  let tweet = message.content.slice(
    message.content.indexOf(args[0]),
    message.content.length
  );

  if (tweet.length > 68) tweet = tweet.slice(0, 65) + "...";

  try {
    const res = await fetch(
        Buffer.from(
          "aHR0cHM6Ly9uZWtvYm90Lnh5ei9hcGkvaW1hZ2VnZW4/dHlwZT10cnVtcHR3ZWV0JnRleHQ9",
          "base64"
        ).toString() + tweet
      ),
      img = (await res.json()).message;

    message.channel.send({
      embeds: [
        client
          .embedBuilder(client, message, "Trump Tweet", "", "#ec3d93")
          .setImage(img),
      ],
    });
  } finally {
  }
};

module.exports.slashRun = async (client, interaction) => {
  let tweet = interaction.options.getString("message");

  if (tweet.length > 68) tweet = tweet.slice(0, 65) + "...";

  try {
    const res = await fetch(
        Buffer.from(
          "aHR0cHM6Ly9uZWtvYm90Lnh5ei9hcGkvaW1hZ2VnZW4/dHlwZT10cnVtcHR3ZWV0JnRleHQ9",
          "base64"
        ).toString() + tweet
      ),
      img = (await res.json()).message;

    interaction.reply({
      embeds: [
        client
          .embedBuilder(client, interaction, "Trump Tweet", "", "#ec3d93")
          .setImage(img),
      ],
    });
  } finally {
  }
};
