const { SlashCommandBuilder } = require("discord.js");
const { MongoClient } = require("mongodb");

const dbUrl = process.env.MONGO_URI;
const clientDb = new MongoClient(dbUrl);
const database = clientDb.db("WMS_DEV");
const codesCollection = database.collection("codes");

function genRandomString() {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function getIdFromChoice(name) {
  switch (name) {
    case "frontend":
      return "1060912177927688232";

    case "backend":
      return "1060912186739929108";

    case "security":
      return "1066519842171129917";

    case "devops":
      return "1066519871904551014";

    default:
      return false;
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("generate_invite")
    .setDescription("Generate new invite code")
    .addStringOption((option) =>
      option
        .setName("kod")
        .setDescription(
          "Code name (if auto bot will automatically generate new code name"
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("rola")
        .setDescription("Wybierz pełnioną funkcję")
        .setRequired(true)
        .addChoices(
          { name: "FrontEnd", value: "frontend" },
          { name: "BackEnd", value: "backend" },
          { name: "Security Engineer", value: "security" },
          { name: "DevOps", value: "devops" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("rola2")
        .setDescription("Wybierz pełnioną funkcję")
        .setRequired(false)
        .addChoices(
          { name: "FrontEnd", value: "frontend" },
          { name: "BackEnd", value: "backend" },
          { name: "Security Engineer", value: "security" },
          { name: "DevOps", value: "devops" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("rola3")
        .setDescription("Wybierz pełnioną funkcję")
        .setRequired(false)
        .addChoices(
          { name: "FrontEnd", value: "frontend" },
          { name: "BackEnd", value: "backend" },
          { name: "Security Engineer", value: "security" },
          { name: "DevOps", value: "devops" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("rola4")
        .setDescription("Wybierz pełnioną funkcję")
        .setRequired(false)
        .addChoices(
          { name: "FrontEnd", value: "frontend" },
          { name: "BackEnd", value: "backend" },
          { name: "Security Engineer", value: "security" },
          { name: "DevOps", value: "devops" }
        )
    )
    .addIntegerOption((option) =>
      option
        .setName("max_use")
        .setDescription("How many times this invite can be used? (default: 1)")
        .setRequired(false)
    ),

  async execute(interaction) {
    if (
      interaction.member.roles.cache.some(
        (role) => role.id === "1060912823187816549"
      )
    ) {
      const codeValue =
        interaction.options.getString("kod") ?? genRandomString();
      const roles = [
        getIdFromChoice(interaction.options.getString("rola")),
        getIdFromChoice(interaction.options.getString("rola2")),
        getIdFromChoice(interaction.options.getString("rola3")),
        getIdFromChoice(interaction.options.getString("rola4")),
      ];
      const maxUse = interaction.options.getInteger("max_use") ?? 1;

      if (maxUse <= 0) {
        interaction.reply({
          embeds: [
            {
              type: "rich",
              title: "ERROR! ❌",
              description: `Maksymalna liczba użyć musi być większa od 0!`,
              color: 0xff0000,
              image: {
                url: ``,
                height: 0,
                width: 0,
              },
            },
          ],
        });
      } else {
        if (
          await codesCollection.findOne({ value: codeValue, isActive: true })
        ) {
          interaction.reply({
            embeds: [
              {
                type: "rich",
                title: "ERROR! ❌",
                description: `Kod \`${codeValue}\` już istnieje w bazie danych`,
                color: 0xff0000,
                image: {
                  url: ``,
                  height: 0,
                  width: 0,
                },
              },
            ],
          });
        } else {
          await codesCollection.insertOne({
            value: codeValue,
            numberOfUse: 0,
            maxNumberOfUse: maxUse,
            roleIds: roles,
            createdBy: interaction.user,
            isActive: true,
            usedBy: [],
            timeCreated: new Date(),
          });

          let descriptionRoles = "";

          for (let i = 0; i < roles.length; i++) {
            if (roles[i]) descriptionRoles += "<@&" + roles[i] + "> ";
          }

          interaction.reply({
            embeds: [
              {
                type: "rich",
                title: "Sukces! ✅",
                description:
                  `Pomyślnie utworzono nowy kod \`${codeValue}\` \nRole które zostaną nadane użytkownikowi po dołączeniu:` +
                  descriptionRoles,
                color: 0x008000,
                image: {
                  url: ``,
                  height: 0,
                  width: 0,
                },
              },
            ],
          });
        }
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
