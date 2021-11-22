const { MessageAttachment, Collection } = require("discord.js");
const fs = require("fs").promises;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM();
const document = dom.window.document;
const db = require('quick.db')

module.exports = {
    name: 'delete',
    category: 'tickets',
    usage: 'delete', 
    description: 'Deletes the ticket.',
    permissions: ["MANAGE_CHANNELS"],
    cooldown: 0,
    aliases: [`close`]
}

module.exports.run = async(client, message, args) => {
    const ticket = db.fetch(`tickets_${message.guild.id}_${message.channel.id}`);
    const log = client.channels.cache.get(client.conf.logging.Ticket_Channel_Logs)
    const channelMessages = await message.channel.messages
        .fetch({ limit: 100, before: message.id })
        .catch((err) => console.log(err));

    let messageCollection = new Collection();
    messageCollection = messageCollection.concat(channelMessages);

    let msgs = [...messageCollection.values()].reverse();

    let data = await fs.readFile("./data/template.html", "utf8")

    msgs.forEach(async(msg) => {
        let parentContainer = document.createElement("div");
        parentContainer.className = "parent-container";

        let avatarDiv = document.createElement("div");
        avatarDiv.className = "avatar-container";
        let img = document.createElement("img");
        img.setAttribute("src", msg.author.displayAvatarURL());
        img.className = "avatar";
        avatarDiv.appendChild(img);

        parentContainer.appendChild(avatarDiv);

        let messageContainer = document.createElement("div");
        messageContainer.className = "message-container";

        let nameElement = document.createElement("span");
        let name = document.createTextNode(
            msg.author.tag +
            " " +
            msg.createdAt.toDateString() +
            " " +
            msg.createdAt.toLocaleTimeString() +
            " EST"
        );
        nameElement.appendChild(name);
        messageContainer.append(nameElement);

        if (msg.content.startsWith("```")) {
            let m; // code block ovde
            let codeNode = document.createElement("code");
            let textNode = document.createTextNode(m);
            codeNode.appendChild(textNode);
            messageContainer.appendChild(codeNode);
        } else {
            let msgNode = document.createElement("span");
            let textNode = document.createTextNode(msg.content);
            msgNode.append(textNode);
            messageContainer.appendChild(msgNode);
        }
        parentContainer.appendChild(messageContainer);
        data += parentContainer.outerHTML
    });

    const attachment = new MessageAttachment(Buffer.from(data), 'ticket.html');
    message.channel.send({ files: [attachment] })
    const loggingembed = new client.embed()
        .setAuthor(`Ticket Logging System`)
        .setColor(`BLUE`)
        .addField(`Ticket Name`, message.channel.name)
        .addField(`Channel`, message.channel)
        .attachFiles(attachment)
        .setThumbnail(client.user.displayAvatarURL());
    if (log) log.send({ embeds: [loggingembed] })

    if (!ticket) return message.channel.send({ embeds: [new client.embed().setDescription('This command can only be used inside of tickets.').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    message.channel.send({ embeds: [new client.embed().setDescription('This channel will be deleted in 10 seconds.').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})

    await new Promise(r => setTimeout(r, 10000))
    message.channel.delete()
    db.delete(`tickets_${message.guild.id}_${message.channel.id}`);
}