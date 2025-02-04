const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActivityType,
  EmbedBuilder,
} = require("discord.js");
const cron = require("cron");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const bumpReminder = require("../utils/bumpRemind.js");
const { default: fetch } = require("node-fetch");

module.exports = async (client) => {
  const guild = client.guilds.cache.get(client.conf.Settings.Guild_ID);
  const settings = client.conf.Settings.Bot_Activity;

  let date = new Date();

  console.log(
    `\x1b[0;37m[${date.toLocaleDateString()} ${date.toLocaleTimeString()}] \x1b[1;36m[INFO] \x1b[0;0mBot has started and is online now.`
  );

  await client.application.commands.set(client.slashArray);

  let rand = Math.floor(Math.random() * settings.Activities.length);
  client.user.setActivity(
    settings.Activities[rand].replace("{count}", client.users.cache.size),
    {
      type: ActivityType[settings.Types[rand]],
    }
  );

  setInterval(() => {
    let index = Math.floor(Math.random() * settings.Activities.length);
    client.user.setActivity(
      settings.Activities[index].replace("{count}", client.users.cache.size),
      { type: ActivityType[settings.Types[rand]] }
    );
  }, 180000);
  
  async function counter() {
    const settings = client.conf.Automation;

    const memberCount = client.channels.cache.get(
      settings.Member_Count.Channel
    );

    const channelCount = client.channels.cache.get(
      settings.Channel_Count.Channel
    );

    const topicStats = client.channels.cache.get(
      client.conf.Settings.Server_Status_Topic_Channel
    );

    const mcCount = client.channels.cache.get(settings.Minecraft_Count.Channel);

    if (settings.Member_Count.Enabled)
      memberCount.setName(
        settings.Member_Count.Message.replace("{count}", guild.memberCount)
      );

    let serverStatus = await fetch(
      `https://api.mcsrvstat.us/3/${client.conf.Settings.Server_IP}`
    ).then(async (res) => await res.json());

    if(topicStats)
      topicStats.setTopic(serverStatus.online ? `${serverStatus.players.online}/${serverStatus.players.max} igrača online | Server online` : "Server je offline");

    if (settings.Minecraft_Count.Enabled) {
      if (serverStatus.online)
        mcCount.setName(
          settings.Minecraft_Count.Message.replace(
            "{count}",
            serverStatus.players.online
          ).replace("{countMax}", serverStatus.players.max)
        );
      else
        mcCount.setName(
          settings.Minecraft_Count.Message.replace("{count}", "Offline")
        );
    }


    if (settings.Channel_Count.Enabled)
      channelCount.setName(
        settings.Channel_Count.Message.replace(
          "{count}",
          guild.channels.cache.size
        )
      );
  }

  const crashGame = (await db.all()).filter((x) => x.id.startsWith("crashRunning_"));
  if(crashGame.length > 0) {
    for(const game of crashGame) {
      await db.delete(game.id);
    }
  }

  async function birthday() {
    const isToday = (d) =>
      d
        ? new Date().getDate() === new Date(d).getDate() &&
          new Date().getMonth() === new Date(d).getMonth()
        : false;
    const settings = client.conf.Birthday_System;
    const channel = client.channels.cache.get(settings.Channel);
    if (!settings.Enabled) return;

    let birthdays = (await db.all())
      .filter((i) => i.id.startsWith(`birthday_${guild.id}_`))
      .sort((a, b) => b.value - a.value);

    let birthEmbed = birthdays
      .filter((b) => isToday(b.value))
      .map((s) => {
        let bUser = client.users.cache.get(s.id.split("_")[2]) || "N/A";
        return `${bUser}\n`;
      });

    const embed = client
      .embedBuilder(
        client,
        null,
        "",
        `<:ArrowRightGray:813815804768026705>**Happy Birthday** to the following member(s)!\n\n${birthEmbed}`
      )
      .setAuthor({
        name: "It's someone's birthday!",
        iconURL: `https://i.imgur.com/aFVnmaL.png`,
      })
      .setThumbnail(`https://i.imgur.com/dmu7XSb.png`);

    const reminder = client
      .embedBuilder(client, null, "", "", "#2f3136")
      .setAuthor({
        name: 'Psst, use ".addbirthday Month Day Year" to set your birthday.',
      });

    if (channel && birthEmbed.length > 0)
      channel.send({ embeds: [embed, reminder] });
  }

  let bdayCron = new cron.CronJob("59 59 11 * * *", () => birthday(), {
    timezone: "Europe/Belgrade",
  });

  bdayCron.start();

  bumpReminder.bump(client);

  let voteCron = new cron.CronJob(
    "0 0 13,21 * * *",
    () => {
      let generalCh = client.channels.cache.get("512274978754920463");
      const voteRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setEmoji("<:DR:765260828714467418>")
          .setURL(`https://minecraft-mp.com/server/295045/vote/`)
          .setLabel("Divine Realms")
          .setStyle(ButtonStyle.Link),
        new ButtonBuilder()
          .setEmoji("<:hog:916427016071442442>")
          .setURL(`https://minecraft-mp.com/server/296478/vote/`)
          .setLabel("HogRealms")
          .setStyle(ButtonStyle.Link)
      );
      if (generalCh)
        generalCh.send({
          content: "<@&1038908503865168037> Dnevni podsetnik da glasate!",
          components: [voteRow],
        });
    },
    { timezone: "Europe/Belgrade" }
  );

  voteCron.start();

  let newDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  let voteMonthEnd = new cron.CronJob(
    `55 59 23 ${newDate} * *`,
    async () => {
      await client.utils.updateVotesLb(client, guild);

      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      let leaderboard = (await db.get(`votes_${guild.id}`)).sort(
        (a, b) => b.votes - a.votes
      );
      let content = "";

      for (let i = 0; i < leaderboard.length; i++) {
        if (i == 10) break;

        content += `\`${i + 1}.\` **${leaderboard[i].nickname}**︲${
          leaderboard[i].votes
        }\n`
          .replace("1.", "🥇")
          .replace("2.", "🥈")
          .replace("3.", "🥉");
      }

      const votesEmbed = new EmbedBuilder()
        .addFields({
          name: `Statistika glasanja na kraju meseca`,
          value: `Hvala svima koji su glasali za naš server.\n\n${content}`,
        })
        .setColor("#7ec0ff");

      const lbChannel = client.channels.cache.get(
        client.conf.Settings.Votes_LB
      );
      if (lbChannel) lbChannel.send({ embeds: [votesEmbed] });

      if(newDate == 1 || [31, 30, 29, 28].includes(newDate)) {
        let currentDate = new Date();
        newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

        voteMonthEnd.setTime(newDate);
        voteMonthEnd.start();
      }
    },
    { timezone: "Europe/Belgrade" }
  );

  voteMonthEnd.start();

  let voteLeaderboardCron = new cron.CronJob(
    "0 0 */2 * * *",
    async () => {
      await client.utils.updateVotesLb(client, guild);
    },
    { timezone: "Europe/Belgrade" }
  );

  voteLeaderboardCron.start();

  while (guild) {
    await counter();
    await new Promise((r) => setTimeout(r, 360000));
  }
};
