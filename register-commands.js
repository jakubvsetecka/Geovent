require('dotenv').config();
const { REST, Routes } = require('discord.js');

const commands = [
    {
        name: 'events',
        description: 'List all events'
    },
    {
        name: 'map',
        description: 'Show map for a specific event',
        options: [
            {
                name: 'event_index',
                type: 4, // INTEGER type
                description: 'The index of the event',
                required: true
            }
        ]
    },
    {
        name: 'mapdate',
        description: 'Show map for events on a specific date',
        options: [
            {
                name: 'date',
                type: 3, // STRING type
                description: 'The date in YYYY-MM-DD format',
                required: true
            }
        ]
    },
    {
        name: 'addevent',
        description: 'Add a new event',
        options: [
            {
                name: 'name',
                type: 3, // STRING type
                description: 'Name of the event',
                required: true
            },
            {
                name: 'date',
                type: 3, // STRING type
                description: 'Date of the event (YYYY-MM-DD)',
                required: true
            },
            {
                name: 'time',
                type: 3, // STRING type
                description: 'Time of the event',
                required: true
            },
            {
                name: 'location',
                type: 3, // STRING type
                description: 'Location of the event',
                required: true
            },
            {
                name: 'mapurl',
                type: 3, // STRING type
                description: 'Google Maps URL of the event location',
                required: true
            }
        ]
    },
    {
        name: 'removeevent',
        description: 'Remove an event by ID',
        options: [
            {
                name: 'id',
                type: 3, // STRING type
                description: 'Unique ID of the event to remove',
                required: true
            }
        ]
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
