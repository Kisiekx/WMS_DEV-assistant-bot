const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const channelId = '1063839989747683368';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verification')
        .setDescription('Setup verification message'),
    async execute(interaction) {
        // interaction.user is the object representing the User who ran the command
        // interaction.member is the GuildMember object, which represents the user in the specific guild
        interaction.client.channels.cache.get(channelId).send(({
            embeds: [
                {
                    "type": "rich",
                    "title": "Witaj na serwerze WMS_DEV!",
                    "description": "Aby uzyskać dostęp do serwera, musisz się zweryfikować. Aby rozpocząć ten proces, kliknij przycisk poniżej.",
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
                        .setCustomId('verificationButton')
                        .setLabel('Zweryfikuj się')
                        .setStyle(ButtonStyle.Success)
                )
            ],
        }));
    },
};
