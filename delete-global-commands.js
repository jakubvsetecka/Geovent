require('dotenv').config();
const { REST, Routes } = require('discord.js');

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
    try {
        console.log('Started deleting global application (/) commands.');

        // Fetch all global commands
        const commands = await rest.get(
            Routes.applicationCommands(process.env.CLIENT_ID)
        );

        // Delete each global command
        for (const command of commands) {
            await rest.delete(
                `${Routes.applicationCommands(process.env.CLIENT_ID)}/${command.id}`
            );
        }

        console.log('Successfully deleted all global application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
