module.exports = {
    description: 'Deletes all the settings for the bot (PERMANENT)',
    permissions: [],
    aliases: ['deleteset'],
    usage: 'deletesettings'
}

module.exports.run = (client, message, args) => {
    if (message.author.id !== client.conf.settings.BotOwnerDiscordID) return message.channel.send({ embeds: [new client.embed().setDescription(`You my friend are not the bot owner!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    client.settings.deleteAll()
}