const figlet = require('figlet')

module.exports = {
    name: 'ascii',
    category: 'fun',
    description: 'Lets you turn text into ascii art.',
    permissions: [],
    cooldown: 0,
    aliases: [`cooltext`],
    usage: 'ascii <text>'
}

module.exports.run = async(client, message, args) => {
    if (!args[0]) return message.channel.send({ embeds: [new client.embedBuilder(client, message, "Error", `Please provide some text`)]})
    figlet.text(args.join(' '), (err, data) => {
        if (err) return
        if (data.length > 2000)
            return message.channel.send({ embeds: [new client.embedBuilder(client, message, "Error", `Sorry please provide a text shorter than 2000 charachters!`)]})
        message.channel.send('```\n' + data + '```')
    })
}
