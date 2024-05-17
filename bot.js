require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const botToken = process.env.DISCORD_BOT_TOKEN;

let events = require('./events.json');

updateEvents = () => {
    events = require('./events.json');
}

const saveEvents = () => {
    fs.writeFileSync('./events.json', JSON.stringify(events, null, 2));
    updateEvents();
};

const generateUniqueId = () => {
    const maxId = events.reduce((max, event) => Math.max(max, parseInt(event.id, 10)), 0);
    return (maxId + 1).toString();
};

const printEvent = (event) => {
    return `### ${event.name} #${event.id}\n📅 ${event.date}, ${event.time}\n💸 ${event.price}\n📖 ${event.description}\n📍 ${event.location}\n`;
};

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'event') {
        const subCommand = interaction.options.getSubcommand();

        if (subCommand === 'create') {
            const name = options.getString('name');
            const desc = options.getString('description');
            const date = options.getString('date');
            const time = options.getString('time');
            const location = options.getString('location');
            const price = options.getString('price');

            const id = generateUniqueId();
            const newEvent = { id, name, desc, date, time, location, price };
            events.push(newEvent);
            saveEvents();
            await interaction.reply(`Event created: ${name} on ${date} at ${time}, location: ${location}`);
        } else if (subCommand === 'list') {
            const date = options.getString('date');
            if (date) {
                const filteredEvents = events.filter(event => event.date === date);
                if (filteredEvents.length === 0) {
                    await interaction.reply(`No events found for date ${date}.`);
                    return;
                }

                const eventList = filteredEvents.map(event => printEvent(event)).join('\n');
                await interaction.reply(`Here are the events on ${date}:\n${eventList}`);
            } else {
                const eventList = events.map(event => printEvent(event)).join('\n');
                await interaction.reply(`Here are the events:\n${eventList}`);
            }
        } else if (subCommand === 'edit') {
            const id = options.getString('id');
            const eventIndex = events.findIndex(event => event.id === id);

            if (eventIndex === -1) {
                await interaction.reply(`Event with ID ${id} not found.`);
                return;
            }

            const event = events[eventIndex];
            event.name = options.getString('name') || event.name;
            event.description = options.getString('description') || event.description;
            event.date = options.getString('date') || event.date;
            event.time = options.getString('time') || event.time;
            event.location = options.getString('location') || event.location;
            event.price = options.getString('price') || event.price;

            saveEvents();
            await interaction.reply(printEvent(event));
        } else if (subCommand === 'delete') {
            const id = options.getString('id');
            const eventIndex = events.findIndex(event => event.id === id);

            if (eventIndex === -1) {
                await interaction.reply(`Event with ID ${id} not found.`);
                return;
            }

            events.splice(eventIndex, 1);
            saveEvents();
            await interaction.reply(`Event with ID ${id} deleted.`);
        } else if (subCommand === 'navigate') {
            const id = options.getString('id');
            const event = events.find(event => event.id === id);

            if (!event) {
                await interaction.reply(`Event with ID ${id} not found.`);
                return;
            }

            const navigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(event.location)}`;
            await interaction.reply(`Navigate to the event: ${navigationUrl}`);
        }
    }
});

client.login(botToken);
