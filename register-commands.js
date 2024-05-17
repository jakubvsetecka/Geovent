require('dotenv').config();
const { REST, Routes } = require('discord.js');

const commands = [
    {
        name: 'event',
        description: 'Manage events',
        options: [
            {
                name: 'create',
                description: 'Create a new event',
                type: 1, // SUB_COMMAND
                options: [
                    {
                        name: 'name',
                        type: 3, // STRING type
                        description: 'Name of the event',
                        required: true
                    },
                    {
                        name: 'description',
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
                        name: 'price',
                        type: 3, // STRING type
                        description: 'Google Maps URL of the event location',
                        required: false
                    }
                ]
            },
            {
                name: 'list',
                description: 'List all upcoming events',
                type: 1, // SUB_COMMAND
                options: [
                    {
                        name: 'date',
                        type: 3, // STRING type
                        description: 'Date to filter events by (YYYY-MM-DD)',
                        required: false
                    }
                ]
            },
            {
                name: 'edit',
                description: 'Edit an existing event',
                type: 1, // SUB_COMMAND
                options: [
                    {
                        name: 'id',
                        type: 3, // STRING type
                        description: 'ID of the event to edit',
                        required: true
                    },
                    {
                        name: 'name',
                        type: 3, // STRING type
                        description: 'New name of the event',
                        required: false
                    },
                    {
                        name: 'description',
                        type: 3, // STRING type
                        description: 'New name of the event',
                        required: false
                    },
                    {
                        name: 'date',
                        type: 3, // STRING type
                        description: 'New date of the event (YYYY-MM-DD)',
                        required: false
                    },
                    {
                        name: 'time',
                        type: 3, // STRING type
                        description: 'New time of the event',
                        required: false
                    },
                    {
                        name: 'location',
                        type: 3, // STRING type
                        description: 'New location of the event',
                        required: false
                    },
                    {
                        name: 'price',
                        type: 3, // STRING type
                        description: 'New Google Maps URL of the event location',
                        required: false
                    }
                ]
            },
            {
                name: 'delete',
                description: 'Delete an event',
                type: 1, // SUB_COMMAND
                options: [
                    {
                        name: 'id',
                        type: 3, // STRING type
                        description: 'ID of the event to delete',
                        required: true
                    }
                ]
            },
            {
                name: 'navigate',
                description: 'Navigate to an event',
                type: 1, // SUB_COMMAND
                options: [
                    {
                        name: 'id',
                        type: 3, // STRING type
                        description: 'ID of the event to navigate to',
                        required: true
                    }
                ]
            }
        ]
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
