module.exports = {
    description: 'Creates the ticket panel message!',
    permissions: [],
    aliases: [`cpcreate`, `panelcreate`],
    usage: 'createpanel'
}

module.exports.run = async(client, message, args) => {
    if (!message.member.permissions.has("ADMINISTRATOR"))
        return message.channel.send({ embeds: [new client.embed().setDescription(`You are missing permission \`ADMINISTRATOR\``).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]});
    const settings = client.conf.ticketSystem
    const embed = new client.embed()
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))

    if (!message.member.permissions.has('MANAGE_GUILD')) return message.channel.send({ embeds: [embed.setDescription(`You are missing permissions to execute this command!`)]});

    const ticketEmbed = new client.embed({ footer: 'React down below to open a ticket!' })
    const msg = await message.channel.send(ticketEmbed.setTitle(settings.Panel_Title).setDescription(settings.Panel_Message));
    await msg.react(settings.Panel_Emoji).catch(() => msg.react('✉️'))
    client.settings.push(message.guild.id, msg.id, 'panels')
}