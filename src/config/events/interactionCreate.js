const Discord = require('discord.js');

module.exports = {
  name: Discord.Events.InteractionCreate,
  execute: async interaction => {
    if (interaction.isChatInputCommand()) {
      const clientCommand = interaction.client.slashCommands.get(interaction.commandName);
      
      if (!clientCommand) return;
      
      try {
        clientCommand.execute(interaction);
      } catch (err) {
        console.error(err);
      }
    }
  }
}