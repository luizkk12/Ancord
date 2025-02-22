const Discord = require('discord.js');
const Database = require('quick.db');
const db = new Database.QuickDB();

module.exports = {
  data: {
    name: 'ping',
    description: 'Veja a latência do WebSocket.',
    usage: 'ping',
    category: 'Utilidades'
  },
  
  execute: async (message, args) => {
    let ping = message.client.ws.ping;
    let prefix = await db.get(`prefix_${message.guild.id}`) || '.';
    
    let embed = new Discord.EmbedBuilder()
    .setTitle(`**🏓 | Pong!**`)
    .setDescription(`**🛜 Atualmente, a latência do WebSocket está em \`${ping}ms (milisegundos)\`.**`)
    .setFooter({ text: `Comando executado por ${message.author.username}` })
    .setColor(0xff0000)
    .setTimestamp();
    
    let button = new Discord.ButtonBuilder()
    .setLabel('Atualizar')
    .setStyle(Discord.ButtonStyle.Secondary)
    .setEmoji('🔄')
    .setCustomId('at');
    
    let row = new Discord.ActionRowBuilder()
    .addComponents(button);
    
    let index = 0;
    
    const msg = await message.reply({ embeds: [embed], components: [row] });
    
    const collector = msg.createMessageComponentCollector();
    
    collector.on('collect', async (i) => {
      if (i.customId === 'at') {
        if (i.user.id !== message.author.id) {   
          await i.reply({ content: `É chato, mas para evitar erros, você mesmo execute um comando \`${prefix}ping\`.`, flags: Discord.MessageFlags.Ephemeral });
        } else {
          await i.deferUpdate();
          index = index + 1;
          
          let embed = new Discord.EmbedBuilder()
          .setTitle(`**🏓 | Pong!**`)
          .setDescription(`**🛜 Atualmente, a latência do WebSocket (atualizada ${index} ${index > 1 ? "vezes" : "vez"}) está em \`${ping}ms (milisegundos)\`.**`)
          .setFooter({ text: `Comando executado por ${message.author.username}` })
          .setColor(0xff0000)
          .setTimestamp();
          
          return await msg.edit({ embeds: [embed], components: [row] });
        }
      }
    });
  }
}