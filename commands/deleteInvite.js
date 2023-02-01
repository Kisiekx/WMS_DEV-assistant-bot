const { SlashCommandBuilder } = require("discord.js");
const { MongoClient } = require("mongodb");

const dbUrl = process.env.MONGO_URI;
const clientDb = new MongoClient(dbUrl);
const database = clientDb.db("WMS_DEV");
const codesCollection = database.collection("codes");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("delete_invite")
    .setDescription("Deletes invite")
    .addStringOption((option) =>
      option.setName("code").setDescription("Code name").setRequired(true)
    ),

  async execute(interaction) {
    if (
      interaction.member.roles.cache.some(
        (role) => role.id === "1060912823187816549"
      )
    ) {
      const currentCode = await codesCollection.findOne({
        value: interaction.options.getString("code"),
        isActive: true,
      });

      if (currentCode) {
        await codesCollection.updateOne(
          { _id: currentCode._id },
          { $set: { isActive: false } }
        );

        interaction.reply({
          embeds: [
            {
              type: "rich",
              title: "Sukces! ✅",
              description: `Pomyślnie usunięto zaproszenie \`${currentCode.value}\``,
              color: 0x008000,
              image: {
                url: ``,
                height: 0,
                width: 0,
              },
            },
          ],
        });
      } else {
        interaction.reply({
          embeds: [
            {
              type: "rich",
              title: "ERROR! ❌",
              description: `Nie znaleziono altywnego zaproszenia z kodem: \`${interaction.options.getString(
                "code"
              )}\``,
              color: 0xff0000,
              image: {
                url: ``,
                height: 0,
                width: 0,
              },
            },
          ],
        });
      }
    } else {
      interaction.reply({
        embeds: [
          {
            type: "rich",
            title: "ERROR! ❌",
            description: `Nie masz uprawnień do tej komendy! \n\n *Jeśli uważasz, że to błąd skontaktuj się z administratorem serwera*`,
            color: 0xff0000,
            image: {
              url: ``,
              height: 0,
              width: 0,
            },
          },
        ],
      });
    }
  },
};
