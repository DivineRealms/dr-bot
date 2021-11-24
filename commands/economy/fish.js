const db = require('quick.db')

module.exports = {
  name: 'fish',
  category: 'economy',
  description: 'Go fishing and get some tasty fish.',
  permissions: [],
  cooldown: 60,
  aliases: [],
  usage: 'fish'
}

module.exports.run = async(client, message, args) => {
  let fish = ['dory', 'coho salmon', 'lanternfish', 'catfish', 'shrimp', 'stargazer', 'clown fish', 'cod', 'tropical fish'];
  let amount = Math.floor(Math.random() * 340) + 1;

  message.channel.send({ embeds: [client.embedBuilder(client, message, "Fish", `You have caught ${fish[Math.floor(Math.random() * fish.length)]} and earned $${amount}.`)] });
  db.add(`money_${message.guild.id}_${message.author.id}`, amount);
}
