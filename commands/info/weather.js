const weather = require('weather-js');

module.exports = {
    description: 'Want to check the weather?',
    permissions: [],
    aliases: ['weath', 'temp'],
    usage: 'Weather <PLACE>'
}

module.exports.run = async(client, message, args) => {

    weather.find({ search: args.join(" "), degreeType: 'F' }, function(error, result) {
        if (error) return message.channel.send({ embeds: [error]});
        if (!args[0]) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to enter location.", "RED")] });

        if (result === undefined || result.length === 0) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You have entered Invalid Location.", "RED")] });

        var current = result[0].current;

        const embedinfo = new client.embed()
            .setDescription(`**Sky**\n${current.skytext}`)
            .setFooter(`Requested By ${message.author.tag}  |  Made By Fuel#2649`, message.author.displayAvatarURL({ dynamic: true }))
            .setAuthor(`Weather for ${current.observationpoint}!`)
            .setFooter(`Requested By ${message.author.tag}  |  Made By Fuel#2649`, message.author.displayAvatarURL({ dynamic: true }))
            .addField('Temperature', `${current.temperature}°`, false)
            .addField('Wind', current.winddisplay, false)
            .addField('Humidity', `${current.humidity}%`, false)


        message.channel.send({ embeds: [embedinfo]})
    })
}