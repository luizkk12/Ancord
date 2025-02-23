const Discord = require('discord.js');
const Database = require('quick.db');
const db = new Database.QuickDB();

module.exports = {
  data: {
    name: 'reverse',
    description: 'Inverta algum texto.',
    usage: 'reverse [texto]',
    category: 'Diversão'
  },
  
  execute: async (message, args) => {
    let prefix = await db.get(`prefix_${message.guild.id}`) || '.';
    let text = args.join(" ");
    
    if (!text) {
      let embed = new Discord.EmbedBuilder()
      .setTitle(`**❓ | ${prefix}reverse**`)
      .setDescription(`**❌ Você não usou o comando da forma correta. Veja os exemplos abaixos.**\n**\`${prefix}reverse [texto]\`**\n**\`${prefix}reverse Olá mundo!\`**`)
      .setFooter({ text: `Comando executado por ${message.author.username}` })
      .setColor(0xff0000)
      .setTimestamp();
      
      return await message.reply({ embeds: [embed] });
    }
    
    let reversed = text.split("").reverse().join("");
    let embedTitle = text === reversed ? `**🤔 | Ué...**` : `**🔄 | Texto invertido!**`;
    let embedDescription = text === reversed ? `**😅 O texto invertido fica a mesma coisa.**\n\n__${reversed}__` : `**😆 O texto invertido fica assim:**\n\n__${reversed}__`;
    
    let embed = new Discord.EmbedBuilder()
    .setTitle(embedTitle)
    .setDescription(embedDescription)
    .setFooter({ text: `Comando executado por ${message.author.username}` })
    .setColor(0xffffff)
    .setTimestamp();
    
    await message.reply({ embeds: [embed] });
  }
}