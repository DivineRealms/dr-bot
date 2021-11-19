const db = require('quick.db')

module.exports = {
    description: 'Check your balance on the server.',
    permissions: [],
    aliases: ['bal'],
    usage: 'balance [@User]'
}

module.exports.run = async(client, message, args) => {
  let jobs = ["farmer", "programmer", "pilot", "bus driver", "mechanic"];
  let amount = Math.floor(Math.random() * 2500) + 1;

  message.channel.send({ embeds: [client.embedBuilder(client, message, "Work", `You have worked as ${jobs[Math.floor(Math.random() * jobs.length)]} and earned $${amount}.`, "YELLOW")] })
  
  db.add(`money_${message.guild.id}_${message.author.id}`, amount);
}