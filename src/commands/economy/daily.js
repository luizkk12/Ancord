const Discord = require('discord.js');
const Database = require('quick.db');
const db = new Database.QuickDB();

module.exports = {
  data: {
    name: 'daily',
    description: 'Colete seu prêmio diário em diamantes!',
    usage: 'daily',
    category: 'Economia'
  },
  
  execute: async (message, args) => {
    let daily = await db.get(`daily_${message.author.id}`) || 0;
    let data = new Date();
    let dataBR = new Date(data.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
    let vinteEQuatroHoras = 24 * 60 * 60 * 1000;
    let proximaVez = daily + vinteEQuatroHoras;
    
    if (dataBR.getTime() < proximaVez) {
      let embed = new Discord.EmbedBuilder()
      .setTitle(`**❌ | Opa, calma aí!**`)
      .setDescription(`**⏰ Que pressa é essa? Você ainda não pode coletar seu prêmio diário! Volte novamente em <t:${Math.trunc(proximaVez / 1000)}:F> (<t:${Math.trunc(proximaVez / 1000)}:R>). Se estiver confuso sobre o horário, é importante lembrar que estou usando como base o horário de Brasília!**`)
      .setFooter({ text: `Comando executado por ${message.author.username}` })
      .setColor(0xff0000)
      .setTimestamp();
      
      return await message.reply({ embeds: [embed] });
    }
    
    let valor = Math.floor(Math.random() * 81) + 20;
    let saldo = await db.get(`diamonds_${message.author.id}`) || 0;
    let novoSaldo = saldo + valor;
    let embed = new Discord.EmbedBuilder()
    .setTitle(`**🤑 | Prêmio diário coletado!**`)
    .setDescription(`**💎 Você coletou seu prêmio diário e ganhou ${valor} diamantes!**`)
    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
    .setFooter({ text: `Comando executado por ${message.author.username}` })
    .setColor(0x00ff00)
    .setTimestamp();
    
    await db.set(`diamonds_${message.author.id}`, novoSaldo);
    await db.set(`daily_${message.author.id}`, dataBR.getTime());
    await message.reply({ embeds: [embed] });
  }
}