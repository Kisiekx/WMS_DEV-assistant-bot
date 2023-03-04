const fs = require("node:fs");
const path = require("node:path");
const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
} = require("discord.js");
const { MongoClient } = require("mongodb");

require("dotenv").config();

const token = process.env.TOKEN;
const dbUrl = process.env.MONGO_URI;
const dbName = process.env.DBNAME;
// Create a new client instance

const clientDb = new MongoClient(dbUrl);
const database = clientDb.db("WMS_DEV");
const processesCollection = database.collection("processes");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel, Partials.Message],
});

client.commands = new Collection();

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}
//VERIFICATION
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.isButton()) {
    if (interaction.customId === "verificationButton") {
      let currentProcess = await processesCollection.findOne({
        discordId: interaction.user.id,
      });
      if (currentProcess == null) {
        await processesCollection.insertOne(
          {
            discordId: interaction.user.id,
            inProcess: true,
          },
          (error, result) => {
            if (error) console.log("Error ", error);

            console.log(result);
          }
        );
      } else {
        await processesCollection.updateOne(
          { _id: currentProcess._id },
          { $set: { inProcess: true } }
        );
      }

      interaction.user.send({
        embeds: [
          {
            type: "rich",
            title: `Weryfikacja rozpoczęta`,
            description: `Wyślij swój kod zaproszeniowy tutaj`,
            color: 0xff0000,
            thumbnail: {
              url: `https://i.imgur.com/1acm0rc.png`,
              height: 0,
              width: 0,
            },
          },
        ],
      });
      interaction.reply({ content: "Sprawdź DM!", ephemeral: true });
    } else if (interaction.customId === "repeatVerificationButton") {
      let currentProcess = await processesCollection.findOne({
        discordId: interaction.user.id,
      });

      if (currentProcess == null) {
        interaction.deferReply();
        await processesCollection.insertOne(
          {
            discordId: interaction.user.id,
            inProcess: true,
          },
          (error, result) => {
            if (error) console.log("Error ", error);

            console.log(result);
          }
        );
      } else {
        interaction.deferReply();
        await processesCollection.updateOne(
          { _id: currentProcess._id },
          { $set: { inProcess: true } }
        );
      }

      interaction.user.send({
        embeds: [
          {
            type: "rich",
            title: `Weryfikacja rozpoczęta`,
            description: `Wyślij swój kod zaproszeniowy tutaj`,
            color: 0xff0000,
            thumbnail: {
              url: `https://i.imgur.com/1acm0rc.png`,
              height: 0,
              width: 0,
            },
          },
        ],
      });
    }
  }
});

// Log in to Discord with your client's token
client.login(token);

module.exports = client;
