require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const botToken = process.env.DISCORD_BOT_TOKEN;

let events = require('./events.json');
const eventList = events.map(event => `${event.name} - ${event.date} at ${event.time} - ${event.location}\nMap: ${event.mapUrl}`).join('\n');

const updateEvents = () => {
    eventList = events.map(event => `${event.name} - ${event.date} at ${event.time} - ${event.location}\nMap: ${event.mapUrl}`).join('\n');
}

const saveEvents = () => {
    fs.writeFileSync('./events.json', JSON.stringify(events, null, 2));
    updateEvents();
};

const generateUniqueId = () => {
    const maxId = events.reduce((max, event) => Math.max(max, parseInt(event.id, 10)), 0);
    return (maxId + 1).toString();
};


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'events') {
        await interaction.reply(`Here are the events:\n${eventList}`);
    } else if (commandName === 'map') {
        const eventIndex = options.getInteger('event_index');
        if (eventIndex < 0 || eventIndex >= events.length) {
            await interaction.reply('Invalid event index.');
            return;
        }

        const event = events[eventIndex];
        await interaction.reply(`${event.name} - ${event.date} at ${event.time} - ${event.location}\nMap: ${event.mapUrl}`);
    } else if (commandName === 'mapdate') {
        const date = options.getString('date');
        const filteredEvents = events.filter(event => event.date === date);
        if (filteredEvents.length === 0) {
            await interaction.reply('No events found for the specified date.');
            return;
        }

        const eventDetails = filteredEvents.map(event => `${event.name} - ${event.date} at ${event.time} - ${event.location}\nMap: ${event.mapUrl}`).join('\n');
        await interaction.reply(`Events on ${date}:\n${eventDetails}`);
    } else if (commandName === 'addevent') {
        const name = options.getString('name');
        const date = options.getString('date');
        const time = options.getString('time');
        const location = options.getString('location');
        const mapUrl = options.getString('mapurl');

        const id = generateUniqueId();
        const newEvent = { id, name, date, time, location, mapUrl };
        events.push(newEvent);
        saveEvents();
        await interaction.reply(`Event added: ${name} on ${date} at ${time}, location: ${location}`);
    } else if (commandName === 'removeevent') {
        const id = options.getString('id');
        const eventIndex = events.findIndex(event => event.id === id);

        if (eventIndex === -1) {
            await interaction.reply(`Event with ID ${id} not found.`);
            return;
        }

        events.splice(eventIndex, 1);
        saveEvents();
        await interaction.reply(`Event with ID ${id} removed.`);
    }
});

client.login(botToken);
