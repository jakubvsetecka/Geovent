require('dotenv').config();
const { REST, Routes } = require('discord.js');

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
    try {
        console.log('Started deleting application (/) commands for guild.');

        // Fetch all commands for the guild
        const commands = await rest.get(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID)
        );

        // Delete each guild command
        for (const command of commands) {
            await rest.delete(
                `${Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID)}/${command.id}`
            );
        }

        console.log('Successfully deleted all application (/) commands for guild.');
    } catch (error) {
        console.error(error);
    }
})();
