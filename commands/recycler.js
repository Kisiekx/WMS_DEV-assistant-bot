const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const channelId = '1063850340904087673'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('recycler')
        .setDescription('Setup home channel'),
    async execute(interaction) {
        // interaction.user is the object representing the User who ran the command
        // interaction.member is the GuildMember object, which represents the user in the specific guild
        interaction.client.channels.cache.get(channelId).send(({
            embeds: [
                {
                    "type": "rich",
                    "title": `Recycler (Hackathon 2022)`,
                    "description": "",
                    "color": 0x18B348,
                    "image": {
                        "url": `https://i.imgur.com/uRY6GOT.png`,
                        "height": 0,
                        "width": 0
                    },
                    "url": `https://recycler-dev.herokuapp.com/`
                }
                ], components: [
            new ActionRowBuilder().setComponents(
                new ButtonBuilder()
                    .setLabel('Swagger')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://recycler-dev-backend.azurewebsites.net/swagger-ui/index.html'),
                new ButtonBuilder()
                    .setLabel('Jira Front-End')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://komp15.atlassian.net/jira/software/c/projects/DNFR/boards/17'),
                new ButtonBuilder()
                    .setLabel('Jira Back-End')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://komp15.atlassian.net/jira/software/projects/DNN/boards/18'),
                new ButtonBuilder()
                    .setLabel('Repo Front-End')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://github.com/WMS-DEV/hackyeah2022-frontend'),
                new ButtonBuilder()
                    .setLabel('Repo Back-end')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://github.com/WMS-DEV/hackyeah-2022-backend')
            )
            ], }));
    },
};
