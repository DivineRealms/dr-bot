const db = require('quick.db')

module.exports = {
    name: 'modifybal',
    category: 'economy',
    description: 'Remove or add money to a user on the server.',
    permissions: ["ADMINISTRATOR"],
    cooldown: 0,
    aliases: ['modifyb'],
    usage: 'modifybal [@User] <add | remove> <wallet | bank> <amount>'
}

module.exports.run = async(client, message, args) => {
    const user = message.mentions.users.first() || client.users.cache.get(args[0])

    if (!user) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to mention user.", "RED")] });
    if (!['add', 'remove'].includes(args[1])) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to specify do you want to `add` or `remove`.", "RED")] });
    if (!['wallet', 'bank'].includes(args[2])) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to specify do you want `wallet` or `bank`.", "RED")] });
    if (isNaN(args[3]) || args[3] < 1) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to enter amount.", "RED")] });

    if(args[1].toLowerCase() == "add") {
        if(args[2].toLowerCase() == "bank") {
            db.add(`bank_${message.guild.id}_${user.id}`, Number(args[3]));
            message.channel.send({ embeds: [client.embedBuilder(client, message, "Modify Balance", `$${args[3]} have been added to ${user}'s bank`, "YELLOW")] });
        } else if(args[2].toLowerCase() == "wallet") {
            db.add(`money_${message.guild.id}_${user.id}`, Number(args[3]));
            message.channel.send({ embeds: [client.embedBuilder(client, message, "Modify Balance", `$${args[3]} have been added to ${user}'s wallet`, "YELLOW")] });
        }
    } else if(args[1].toLowerCase() == "remove") {
        if(args[2].toLowerCase() == "bank") {
            db.subtract(`bank_${message.guild.id}_${user.id}`, Number(args[3]));
            message.channel.send({ embeds: [client.embedBuilder(client, message, "Modify Balance", `$${args[3]} have been removed from ${user}'s bank`, "YELLOW")] });
        } else if(args[2].toLowerCase() == "wallet") {
            db.subtract(`money_${message.guild.id}_${user.id}`, Number(args[3]));
            message.channel.send({ embeds: [client.embedBuilder(client, message, "Modify Balance", `$${args[3]} have been removed from ${user}'s wallet`, "YELLOW")] });
        }
    }
}