const Discord = require('discord.js');
const Database = require('quick.db');
const db = new Database.QuickDB();

module.exports = {
  name: Discord.Events.MessageCreate,
  execute: async message => {
    let prefix = await db.get(`prefix_${message.guild.id}`) || '.';
    let botMember = message.channel.permissionsFor(message.client.user.id);

    if (!botMember.has(Discord.PermissionsBitField.Flags.SendMessages) || !botMember.has(Discord.PermissionsBitField.Flags.ViewChannel)) return;

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

    let blacklist = await db.get(`blacklist_${message.author.id}`) || 'não';
    let motivobl = await db.get(`motivobl_${message.author.id}`) || 'Indefinido';

    if (blacklist === 'sim') {
      let embed = new Discord.EmbedBuilder()
      .setTitle(`**🚫 | Você foi banido.**`)
      .setDescription(`**❌ Eu não executarei mais comandos pra você porque você está proibido de executar meus comandos. Meu criador deixou um comentário:**\n\n__${motivobl}__`)
      .setFooter({ text: `Comando executado por ${message.author.username}` })
      .setColor(0xff0000)
      .setTimestamp();

      return await message.reply({ embeds: [embed] });
    }
    
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