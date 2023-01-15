const Discord = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()



// Replace with your Discord bot token
const TOKEN = process.env.TOKEN;

// Replace with the ID of the channel where you want to send the reminder messages
const CHANNEL_ID = process.env.CHANNEL_ID;

// Replace with the connection string for your MongoDB database
const MONGO_URI = process.env.MONGO_URI;

// Create a new Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

// Connect to the MongoDB database
MongoClient.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, c) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log('Connected to MongoDB');

    // Get the "events" collection
    const events = c.db().collection('events');

    // When the bot is ready, set the presence and start the event loop
    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}`);

        // Set the bot's presence
        client.user.setPresence({
            activity: {
                name: '!schedule',
                type: 'LISTENING'
            }
        });

        // Start the event loop
        setInterval(() => {

            console.log("Interval triggered")
            // Get the current time
            const now = new Date();

            // Get all events that are scheduled to start in the next 15 minutes
            events.find({
                startTime: {
                    $gte: new Date(now.getTime() + 1 * 60 * 60 * 1000 + 0 * 60 * 1000),
                    $lt: new Date(now.getTime() + 1 * 60 * 60 * 1000 + 15 * 60 * 1000)
                }
            }).toArray((err, docs) => {if (err) {
                console.error(err);
                return;
            }

                // Send a reminder message for each event
                docs.forEach(doc => {
                    const channel = client.channels.cache.get(CHANNEL_ID);
                    if (channel) {
                        console.log(doc)
                        console.log(doc.name)
                        console.log(new Date(now.getTime()+ 1 * 60 * 60 * 1000 ))
                        channel.send("test!");
                    }
                });
            });
        }, 1 * 60 * 1000);
    });

    // When a message is received
    client.on('messageCreate', message => {
        // Ignore messages from other bots
        if (message.author.bot) return;

        // Ignore messages that don't start with the command prefix
        if (!message.content.startsWith('!')) return;

        // Get the command and arguments
        const [command] = message.content.trim().split(/ +/g);
        const [...args] = message.content.slice(command.length).trim().split(",")
        console.log(command, args)

        // Schedule a new event
        if (command === '!schedule') {

            let startTime;

            // Parse the date and time
            if (/(today|dzisiaj|td|sd|same|sameday|-)/i.test(args[1])){
                let today = new Date()
                startTime = new Date(args[1] + ' ' + today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate());
            }else {
                startTime = new Date(args[1] + ' ' + args[0]);
            }

            // Check if the date and time are valid
            if (isNaN(startTime.getTime())){
                return message.channel.send('Invalid date and time');
            }else{
                // Create a new event object
                const event = {
                    startTime: startTime,
                    name: args[2],
                    description: args[3],
                    thumbnailUrl: args[4]
                };

                console.log(event)

                // Insert the event into the database
                events.insertOne(event, (err, result) => {
                    if (err) {
                        console.error(err);
                        return message.channel.send('Error: Failed to add event to the database');
                    }

                    // Confirm that the event was added successfully
                    message.channel.send(`Successfully scheduled event: "${event.name}"`);
                });
            }


        }

        // List all scheduled events
        if (command === '!events') {
            // Get all events from the database
            events.find({}).toArray((err, docs) => {
                if (err) {
                    console.error(err);
                    return message.channel.send('Error: Failed to retrieve events from the database');
                }

                // Send a message with the list of events
                message.channel.send(
                    docs.map(doc => `${doc.name} - ${doc.startTime}`).join('\n'),
                    { code: true }
                );
            });
        }
    })

    // Login to Discord
    client.login(TOKEN)
});
