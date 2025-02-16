const Discord = require('discord.js');
const Database = require('quick.db');
const db = new Database.QuickDB();

module.exports = {
  data: {
    name: 'bal',
    description: 'Veja o saldo de algum usuário.',
    usage: 'bal [usuário?]',
    category: 'Economia'
  },
  
  execute: async (message, args) => {
    let user;
    let regex = /<@[!]?(\d+)>/;
    let getUser = String(args[0]).match(regex);
    
    if (getUser) {
      user = await message.client.users.fetch(getUser[1]).catch(() => null);
    } else {
      user = await message.client.users.fetch(args[0]).catch(() => null);
    }
    
    if (!user) user = message.author;
    let saldo = await db.get(`diamonds_${user.id}`) || 0;
    
    let embedDescription = user.id === message.author.id ? `**💎 Atualmente, você possui ${saldo} diamantes.**` : `**💎 Atualmente, ${user.username} possui ${saldo} diamantes.**`;
    
    let embed = new Discord.EmbedBuilder()
    .setTitle(`**💰 | Saldo de ${user.username}**`)
    .setDescription(embedDescription)
    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
    .setFooter({ text: `Comando executado por ${message.author.username}` })
    .setColor(0x00ff00)
    .setTimestamp();
    
    await message.reply({ embeds: [embed] });
  }
}