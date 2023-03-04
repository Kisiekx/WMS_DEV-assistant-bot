const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const channelId = "1081645940223512666";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("isjsosdown")
    .setDescription("Setup home channel"),
  async execute(interaction) {
    // interaction.user is the object representing the User who ran the command
    // interaction.member is the GuildMember object, which represents the user in the specific guild
    interaction.client.channels.cache.get(channelId).send({
      embeds: [
        {
          type: "rich",
          description: "",
          color: 0xa51ceb,
          image: {
            url: `https://i.imgur.com/djdHI3A.png`,
            height: 0,
            width: 0,
          },
        },
      ],
    });

    interaction.client.channels.cache.get(channelId).send({
      embeds: [
        {
          type: "rich",
          title: `Front-end`,
          description: "",
          color: 0xa51ceb,
        },
      ],
      components: [
        new ActionRowBuilder().setComponents(
          new ButtonBuilder()
            .setLabel("CI/CD")
            .setStyle(ButtonStyle.Link)
            .setURL("https://isjsosdown.azurewebsites.net"),
          new ButtonBuilder()
            .setLabel("Board")
            .setStyle(ButtonStyle.Link)
            .setURL(
              "https://wmsdev.jetbrains.space/p/isjsosdown/issue-boards/frontend"
            ),
          new ButtonBuilder()
            .setLabel("Repo")
            .setStyle(ButtonStyle.Link)
            .setURL("https://github.com/WMS-DEV/isjsosdown-frontend")
        ),
      ],
    });

    interaction.client.channels.cache.get(channelId).send({
      embeds: [
        {
          type: "rich",
          title: `Back-end`,
          description: "",
          color: 0xa51ceb,
        },
      ],
      components: [
        new ActionRowBuilder().setComponents(
          new ButtonBuilder()
            .setLabel("Board")
            .setStyle(ButtonStyle.Link)
            .setURL(
              "https://wmsdev.jetbrains.space/p/isjsosdown/issue-boards/backend"
            )
        ),
      ],
    });
  },
};
