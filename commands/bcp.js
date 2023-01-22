const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const channelId = '1063850324646953040'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bcp')
        .setDescription('Setup home channel'),
    async execute(interaction) {
        // interaction.user is the object representing the User who ran the command
        // interaction.member is the GuildMember object, which represents the user in the specific guild
        interaction.client.channels.cache.get(channelId).send(({embeds: [
                {
                    "type": "rich",
                    "title": `btone.tech CrewPortal`,
                    "description": "",
                    "color": 0x7c7c7c,
                    "image": {
                        "url": `https://i.imgur.com/qrCUyhM.png`,
                        "height": 0,
                        "width": 0
                    },
                    "url": "https://btonetech.netlify.app/"
                }
            ], components: [
            new ActionRowBuilder().setComponents(
                new ButtonBuilder()
                    .setLabel('Swagger')
                    .setStyle(ButtonStyle.Link)
                    .setURL('http://crewportal-backend-dev.btone.tech/swagger-ui/index.html#/'),
                new ButtonBuilder()
                    .setLabel('Jira Front-End')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://komp15.atlassian.net/jira/software/c/projects/BCPF/boards/16'),
                new ButtonBuilder()
                    .setLabel('Jira Back-End')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://komp15.atlassian.net/jira/software/projects/BCP/boards/12'),
                new ButtonBuilder()
                    .setLabel('Repo Front-End')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://github.com/MateuszKitzol/btone.tech'),
                new ButtonBuilder()
                    .setLabel('Repo Back-end')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://komp15.atlassian.net/jira/software/c/projects/BCPF/boards/16')
            )
            ], }));
    },
};