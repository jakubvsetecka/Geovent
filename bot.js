const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const botToken = process.env.DISCORD_BOT_TOKEN;
const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
const maxRequestsPerMinute = 50; // Adjust according to your expected usage
let requestCount = 0;
let resetTime = Date.now() + 60000; // Reset every minute

const events = [
    {
        name: "Event 1",
        date: "2024-05-20",
        time: "14:00",
        location: "Stephansplatz, Vienna"
    },
    {
        name: "Event 2",
        date: "2024-05-21",
        time: "10:00",
        location: "Schönbrunn Palace, Vienna"
    }
];

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
    console.log(`Received message: ${message.content}`);

    // Ignore messages from bots
    if (message.author.bot) return;

    if (message.content.startsWith('!events')) {
        console.log('!events command received');
        const eventList = events.map(event => `${event.name} - ${event.date} at ${event.time} - ${event.location}`).join('\n');
        message.channel.send(`Here are the events:\n${eventList}`);
    }

    if (message.content.startsWith('!map')) {
        console.log('!map command received');
        const args = message.content.split(' ');
        const eventIndex = parseInt(args[1]);
        if (isNaN(eventIndex) || eventIndex < 0 || eventIndex >= events.length) {
            message.channel.send('Invalid event index.');
            return;
        }

        if (Date.now() > resetTime) {
            requestCount = 0;
            resetTime = Date.now() + 60000;
        }

        if (requestCount < maxRequestsPerMinute) {
            const event = events[eventIndex];
            try {
                const response = await axios.get(`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(event.location)}&zoom=14&size=600x300&maptype=roadmap&markers=color:red%7Clabel:S%7C${encodeURIComponent(event.location)}&key=${googleMapsApiKey}`);
                const mapUrl = response.config.url;
                message.channel.send(`${event.name} - ${event.date} at ${event.time} - ${event.location}\nMap: ${mapUrl}`);
                requestCount++;
            } catch (error) {
                console.error('Error fetching map:', error);
                message.channel.send('Error fetching map. Please try again later.');
            }
        } else {
            message.channel.send('Rate limit exceeded. Please try again later.');
        }
    }
});


client.login(botToken);
