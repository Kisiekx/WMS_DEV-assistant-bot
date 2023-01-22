const {SlashCommandBuilder} = require('discord.js');
const {MongoClient} = require('mongodb');

const dbUrl = process.env.MONGO_URI
const clientDb = new MongoClient(dbUrl);
const database = clientDb.db('WMS_DEV');
const codesCollection = database.collection('codes');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('list_invites')
        .setDescription('Shows all existing invites'),

    async execute(interaction) {

        if(interaction.member.roles.cache.some(role => role.id === '1060912823187816549')){

                let codes = await codesCollection.find({isActive: true})

            if(!(await codes.count()) === 0) {

                let description = ""

                await codes.forEach((doc) =>{

                    let rolesString = ""

                    for(let i = 0; i < doc.roleIds.length; i++){
                        if(doc.roleIds[i])
                            rolesString += "<@&" + doc.roleIds[i] + "> "
                    }

                        console.log(doc)
                        description += `\nKod: \`${doc.value}\`, Pozostała liczba użyć: \`${doc.maxNumberOfUse-doc.numberOfUse}\`, Stworzono przez: <@${doc.createdBy.id}>, Przypisane role: ${rolesString}`
                    }
                )

                interaction.reply(({
                    embeds: [
                        {
                            "type": "rich",
                            "title": "Aktywne kody:",
                            "description": description,
                            "color": 0x008000,
                            "image": {
                                "url": ``,
                                "height": 0,
                                "width": 0
                            }
                        }
                    ],

                }));
            }else{
                    interaction.reply(({
                        embeds: [
                            {
                                "type": "rich",
                                "title": "ERROR! ❌",
                                "description": `Nie znaleziono żadnego kodu w bazie!`,
                                "color": 0xff0000,
                                "image": {
                                    "url": ``,
                                    "height": 0,
                                    "width": 0
                                }
                            }
                        ]
                    }))}

            }else{

            interaction.reply(({
                embeds: [
                    {
                        "type": "rich",
                        "title": "ERROR! ❌",
                        "description": `Nie masz uprawnień do tej komendy! \n\n *Jeśli uważasz, że to błąd skontaktuj się z administratorem serwera*`,
                        "color": 0xff0000,
                        "image": {
                            "url": ``,
                            "height": 0,
                            "width": 0
                        }
                    }
                ]
            }))}
    },
};
