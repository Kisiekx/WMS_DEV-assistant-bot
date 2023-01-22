const {Events, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const {MongoClient} = require('mongodb');
const Captcha = require("@haileybot/captcha-generator");
const {EmbedBuilder,AttachmentBuilder} = require('discord.js');

const dbUrl = process.env.MONGO_URI
const clientDb = new MongoClient(dbUrl);
const database = clientDb.db('WMS_DEV');
const processesCollection = database.collection('processes');
const codesCollection = database.collection('codes');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.guild) return;
        let process = await processesCollection.findOne({discordId: message.author.id})
        console.log(process)

        const server = message.client.guilds.cache.get('1060903510708858930')

        if (!process == null)

            if (process.inProcess) {

            await processesCollection.updateOne(
                {_id: process._id},
                {$set: {inProcess: false}})

            let captcha = new Captcha()
            let image = new AttachmentBuilder(captcha.PNGStream, "captcha.png")
            let captchaEmbed = new EmbedBuilder()
                .setTitle('Sprawdzamy, czy nie jesteś robotem 🧐')
                .setColor(0xff0000)
                .setImage('attachment://captcha.png')
                .setDescription('Przepisz kod z obrazka poniżej')
                .setFooter({text: 'We take your security seriously ( ͡° ͜ʖ ͡°)'})

            await message.channel.send({embeds: [captchaEmbed]});
            await message.channel.send({files: [image]})

            let collector = message.channel.createMessageCollector();
            collector.on("collect", async (m) => {
                if (m.content.toUpperCase() === captcha.value) {
                    console.log(m.content.toUpperCase())
                    let currentCode = await codesCollection.findOne({value: message.content, isActive: true})
                    console.log(currentCode)
                    if (currentCode == null) {

                        let currentCode = await codesCollection.findOne({value: message.content, isActive: false})

                        if (currentCode == null) {

                            message.channel.send({
                                embeds: [{
                                    color: 0xff0000,
                                    title: '❌ ERROR ❌',
                                    description: 'Niepoprawny kod zaproszenia'
                                }], components: [
                                    new ActionRowBuilder().setComponents(
                                        new ButtonBuilder()
                                            .setCustomId('repeatVerificationButton')
                                            .setLabel('Spróbuj ponownie')
                                            .setStyle(ButtonStyle.Danger)
                                    )
                                ],
                            })}else{
                            message.channel.send({
                                embeds: [{
                                    color: 0xff0000,
                                    title: '❌ ERROR ❌',
                                    description: 'Kod został zużyty'
                                }], components: [
                                    new ActionRowBuilder().setComponents(
                                        new ButtonBuilder()
                                            .setCustomId('repeatVerificationButton')
                                            .setLabel('Spróbuj ponownie')
                                            .setStyle(ButtonStyle.Danger)
                                    )
                                ],
                            });
                        }

                    } else if (currentCode.numberOfUse < currentCode.maxNumberOfUse) {

                        message.channel.send({
                            embeds: [{
                                color: 0x008000,
                                title: '✅ Poprawnie zweryfikowano! ✅',
                                description: 'W ciągu 5 sekund powinienieś otrzymać pełen dostęp do serwera',
                                footer: {text: 'Wszelkie problemy z botem proszę zgłaszać do: Kisiek#2137'}
                            }]
                        });

                        let useNumber = currentCode.numberOfUse + 1
                        let checkActive = (useNumber < currentCode.maxNumberOfUse)
                        let currentUsedBy = currentCode.usedBy.push([message.author, new Date()])

                        await codesCollection.updateOne({_id: currentCode._id},
                            {$set: {numberOfUse: useNumber, isActive: checkActive, usedBy: currentUsedBy}})


                        for (let i = 0; i < currentCode.roleIds.length; i++) {
                            if(currentCode.roleIds[i]){
                            try {
                                console.log(currentCode.roleIds[i])
                                let member = await server.members.cache.get(message.author.id)
                                let role = await server.roles.cache.get(currentCode.roleIds[i])
                                await member.roles.add(role)
                                    .catch(error => {
                                        console.log(error)
                                    })
                            }catch (e) {
                                console.log(e)
                            }}else{
                                return
                            }

                        }


                    } else if (currentCode.numberOfUse <= currentCode.maxNumberOfUse) {
                        message.channel.send({
                            embeds: [{
                                color: 0xff0000,
                                title: '❌ ERROR ❌',
                                description: 'Kod został zużyty'
                            }], components: [
                                new ActionRowBuilder().setComponents(
                                    new ButtonBuilder()
                                        .setCustomId('repeatVerificationButton')
                                        .setLabel('Spróbuj ponownie')
                                        .setStyle(ButtonStyle.Danger)
                                )
                            ],
                        });
                    } else {
                        message.channel.send({
                            embeds: [{
                                color: 0xff0000,
                                title: '❌ ERROR ❌',
                                description: 'Niezidentyfikowany error, proszę o kontakt z administratorem: **Kisiek#2137**'
                            }], components: [
                                new ActionRowBuilder().setComponents(
                                    new ButtonBuilder()
                                        .setCustomId('repeatVerificationButton')
                                        .setLabel('Spróbuj ponownie')
                                        .setStyle(ButtonStyle.Danger)
                                )
                            ],
                        });
                    }
                } else if(m.content.toUpperCase() && !(m.content.toUpperCase() === captcha.value)){

                    console.log("TUTAJ KODY:", m.content.toUpperCase(), captcha.value, m.content.toUpperCase() === captcha.value)
                    message.channel.send({
                        embeds: [{
                            color: 0xff0000,
                            title: '❌ ERROR ❌',
                            description: 'Niepoprawny kod Captcha'
                        }], components: [
                            new ActionRowBuilder().setComponents(
                                new ButtonBuilder()
                                    .setCustomId('repeatVerificationButton')
                                    .setLabel('Spróbuj ponownie')
                                    .setStyle(ButtonStyle.Danger)
                            )
                        ],
                    });
                }
                collector.stop();
            });

        }
    },
};