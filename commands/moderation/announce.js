const { ApplicationCommandOptionType, ActionRowBuilder, 
  ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

module.exports = {
  name: "announce",
  category: "moderation",
  description: "Allows you to send an announcement on your behalf.",
  permissions: [],
  cooldown: 0,
  aliases: ["an", "announcement"],
  usage:
    "announce <Type> | <Mention> | <Title> | <Description> | <Field Title> | <Field Description> | ...",
  slash: true,
  options: [{
    name: "title",
    description: "Title for Announcement",
    type: ApplicationCommandOptionType.String,
    required: true,
  }, {
    name: "description",
    description: "Description for Announcement",
    type: ApplicationCommandOptionType.String,
    required: true
  }, {
    name: "type",
    description: "Type of Announcement",
    type: ApplicationCommandOptionType.String,
    choices: [{
      name: "Default",
      value: "default"
    }, {
      name: "Update",
      value: "update"
    }, {
      name: "Maintenance",
      value: "maintenance"
    }, {
      name: "Survey",
      value: "survey"
    }],
    required: true,
  }, {
    name: "fields",
    description: "Whether you want fields or not",
    type: ApplicationCommandOptionType.Boolean,
    required: true
  }, {
    name: "image",
    description: "Image displayed on embed",
    type: ApplicationCommandOptionType.String,
    required: false
  }, {
    name: "thumbnail",
    description: "Thumbnail displayed on embed",
    type: ApplicationCommandOptionType.String,
    required: false
  }, {
    name: "mention",
    description: "Role which to mention",
    type: ApplicationCommandOptionType.Role,
    required: false
  }],
};

module.exports.run = async (client, message, args) => {
  args = args.join(" ").split(/\s*\|\s*/);
  const [type, mention, title, description] = args,
   announcementChannel = message.guild.channels.cache.get(client.conf.Settings.Announcement_Channel);

  if (args.length < 3)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          `Invalid usage; see ${message.px}help announce for correct usage.`
        ),
      ],
    });

  let embed = client
    .embedBuilder(client, message, "", description)
    .setFooter({
      text: `Announcement by ${message.author.tag}`,
      iconURL: message.author.displayAvatarURL({ size: 1024, dynamic: true }),
    })
    .setTimestamp();

  args.splice(0, 4);
  if (args.length % 2 !== 0)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You are missing a title or a description."
        ),
      ],
    });

  const fields = [];
  for (let i = 0; i < args.length; i += 2)
    fields.push({ title: args[i], description: args[i + 1] });

  for (let i = 0; i < fields.length && fields.length <= 25; i++) {
    embed.addFields({ name: fields[i].title, value: fields[i].description });
    if (!fields[i].title || !fields[i].description)
      return message.channel.send({
        embeds: [
          client.utils.errorEmbed(
            client,
            message,
            "You need to provide both a title and a description."
          ),
        ],
      });
  }

  let upAliases = ["update", "up", "1"],
    mnAliases = ["maintenance", "main", "2"],
    suAliases = ["survey", "3"],
    mentionAnswer = ["yes", "1"];

  if (upAliases.includes(type))
    embed
      .setColor("#7edd8a")
      .setAuthor({
        name: title,
        iconURL: `https://cdn.upload.systems/uploads/aKT2mjr0.png`,
      });
  else if (mnAliases.includes(type))
    embed
      .setColor("#ffae63")
      .setAuthor({
        name: title,
        iconURL: `https://cdn.upload.systems/uploads/vRfWnVT5.png`,
      });
  else if (suAliases.includes(type))
    embed.setAuthor({
      name: title,
      iconURL: `https://cdn.upload.systems/uploads/KSTCcy4V.png`,
    });
  else
    embed.setAuthor({
      name: title,
      iconURL: `https://cdn.upload.systems/uploads/sYDS6yZI.png`,
    });

  announcementChannel.send({ embeds: [embed] });
  setTimeout(() => message.delete(), 3000);

  if (mentionAnswer.includes(mention))
    announcementChannel
      .send(`@everyone`)
      .then((msg) => setTimeout(() => msg.delete(), 3000));
  else return;
};

module.exports.slashRun = async (client, interaction) => {
  const type = interaction.options.getString("type");
  const title = interaction.options.getString("title");  
  const description = interaction.options.getString("description");  
  const mention = interaction.options.getRole("mention");

  const fieldsStatus = interaction.options.getBoolean("fields");
  const image = interaction.options.getString("image");
  const thumbnail = interaction.options.getString("thumbnail");

  const announcementChannel = interaction.guild.channels.cache.get(client.conf.Settings.Announcement_Channel);

  let fieldsInput = new ActionRowBuilder()
    .addComponents(
      new TextInputBuilder()
        .setCustomId("ann_data")
        .setLabel("Announcement Fields")
        .setPlaceholder("Fields for your Announcements, separate using |\nExample: <Field Title> | <Field Description> | ...")
        .setRequired(false)
        .setStyle(TextInputStyle.Paragraph)
    );

  let annModal = new ModalBuilder()
    .setTitle("Create Announcement")
    .setCustomId("ann_modal")
    .addComponents(fieldsInput);

  if(fieldsStatus == false) {
    interaction.reply({
      embeds: [
        client
          .embedBuilder(client, interaction, "", "", "#3db39e")
          .setAuthor({
            name: `Announcement have been sent!`,
            iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`
          }),
      ], ephemeral: true
    });

    let embed = client
      .embedBuilder(client, interaction, "", description)
      .setFooter({
        text: `Announcement by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ size: 1024, dynamic: true }),
      })
      .setTimestamp();

    if (type == "update")
      embed
        .setColor("#7edd8a")
        .setAuthor({
          name: title,
          iconURL: `https://cdn.upload.systems/uploads/aKT2mjr0.png`,
        });
    else if (type == "maintenance")
      embed
        .setColor("#ffae63")
        .setAuthor({
          name: title,
          iconURL: `https://cdn.upload.systems/uploads/vRfWnVT5.png`,
        });
    else if (type == "survey")
      embed.setAuthor({
        name: title,
        iconURL: `https://cdn.upload.systems/uploads/KSTCcy4V.png`,
      });
    else
      embed.setAuthor({
        name: title,
        iconURL: `https://cdn.upload.systems/uploads/sYDS6yZI.png`,
      });

    if(image) embed.setImage(image);
    if(thumbnail) embed.setThumbnail(thumbnail);

    announcementChannel.send({ embeds: [embed] });
    
    if(mention) {
      announcementChannel
        .send({ content: `${mention}` })
        .then((msg) => setTimeout(() => msg.delete(), 3000));
    }

    return;
  }
    
  interaction.showModal(annModal);

  const filter = (i) => i.customId == 'ann_modal' && i.user.id == interaction.user.id;
  interaction.awaitModalSubmit({ filter, time: 300_300 })
    .then(async(md) => {
    let fieldsValue = md.fields.getTextInputValue("ann_data");
    fieldsValue = fieldsValue.split(/\s*\|\s*/);
    
    let embed = client
      .embedBuilder(client, interaction, "", description)
      .setFooter({
        text: `Announcement by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ size: 1024, dynamic: true }),
      })
      .setTimestamp();

    if (fieldsValue.length % 2 !== 0)
      return md.reply({
        embeds: [
          client.utils.errorEmbed(
            client,
            interaction,
            "You are missing a title or a description."
          ),
        ], ephemeral: true
      });

    md.reply({
      embeds: [
        client
          .embedBuilder(client, interaction, "", "", "#3db39e")
          .setAuthor({
            name: `Announcement have been sent!`,
            iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`
          }),
      ], ephemeral: true
    })

    const fields = [];
    for (let i = 0; i < fieldsValue.length; i += 2)
      fields.push({ title: fieldsValue[i], description: fieldsValue[i + 1] });

    for (let i = 0; i < fields.length && fields.length <= 25; i++) {
      embed.addFields({ name: fields[i].title, value: fields[i].description });
      if (!fields[i].title || !fields[i].description)
        return md.followUp({
          embeds: [
            client.utils.errorEmbed(
              client,
              message,
              "You need to provide both a title and a description."
            ),
          ], ephemeral: true
        });
    }

    if (type == "update")
      embed
        .setColor("#7edd8a")
        .setAuthor({
          name: title,
          iconURL: `https://cdn.upload.systems/uploads/aKT2mjr0.png`,
        });
    else if (type == "maintenance")
      embed
        .setColor("#ffae63")
        .setAuthor({
          name: title,
          iconURL: `https://cdn.upload.systems/uploads/vRfWnVT5.png`,
        });
    else if (type == "survey")
      embed.setAuthor({
        name: title,
        iconURL: `https://cdn.upload.systems/uploads/KSTCcy4V.png`,
      });
    else
      embed.setAuthor({
        name: title,
        iconURL: `https://cdn.upload.systems/uploads/sYDS6yZI.png`,
      });

    if(image) embed.setImage(image);
    if(thumbnail) embed.setThumbnail(thumbnail);

    announcementChannel.send({ embeds: [embed] });
    
    if(mention) {
      announcementChannel
        .send({ content: `${mention}` })
        .then((msg) => setTimeout(() => msg.delete(), 3000));
    }
  }).catch((err) => {
    console.log(err)
    interaction.followUp({
      embeds: [
        client
          .embedBuilder(client, interaction, "", "", "Red")
          .setAuthor({
            name: "Time for entering announcement fields has passed without answer.",
            iconURL: `https://cdn.upload.systems/uploads/iHhkS5zu.png`
          }),
      ], ephemeral: true,
    });
  })
};
