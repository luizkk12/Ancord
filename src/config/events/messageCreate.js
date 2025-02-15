const Discord = require('discord.js');
const Database = require('quick.db');
const db = new Database.QuickDB();

module.exports = {
  name: Discord.Events.MessageCreate,
  execute: async message => {
    let prefix = await db.get(`prefix_${message.guild.id}`) || '.';
    
    if (message.author.bot) return;
    if (message.content === `<@${message.client.user.id}>` || message.content === `<@!${message.client.user.id}>`) {
      let embed = new Discord.EmbedBuilder()
      .setTitle(`**👋 | Opa!**`)
      .setDescription(`**😄 Olá, ${message.author.username}. Me chamo ${message.client.user.username}. Use \`${prefix}help\` para ver todos os meus comandos.**`)
      .setFooter({ text: `Fui mencionado por ${message.author.username}` })
      .setColor(0xffffff)
      .setTimestamp();
      
      return await message.reply({ embeds: [embed] });
    }
    if (!message.content.startsWith(prefix)) return;
    
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();
    const clientCommand = message.client.commands.get(commandName);
    if (!clientCommand) return;
    
    try {
      clientCommand.execute(message, args);
    } catch (err) {
      console.error(err);
    }
  }
}