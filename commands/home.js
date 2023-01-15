const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const channelId = '1063848964543221770'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('home')
        .setDescription('Setup home channel'),
    async execute(interaction) {
        // interaction.user is the object representing the User who ran the command
        // interaction.member is the GuildMember object, which represents the user in the specific guild
        interaction.client.channels.cache.get(channelId).send(({
            embeds: [
                {
                    "type": "rich",
                    "title": "",
                    "description": "",
                    "color": 0xff0000,
                    "image": {
                        "url": `https://i.imgur.com/wxDN6d8.png`,
                        "height": 0,
                        "width": 0
                    }
                }
            ], components: [
            new ActionRowBuilder().setComponents(
                new ButtonBuilder()
                    .setLabel('WWW')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://wmsdev.pl'),
                new ButtonBuilder()
                    .setLabel('Slack')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://wmsdevworkspace.slack.com'),
                new ButtonBuilder()
                    .setLabel('Jira')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://komp15.atlassian.net/jira/your-work'),
                new ButtonBuilder()
                    .setLabel('Github')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://github.com/WMS-DEV')
        )
         ],
        }));
    },
};
