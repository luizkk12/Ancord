const Discord = require('discord.js');
const Database = require('quick.db');
const db = new Database.QuickDB();

module.exports = {
  data: {
    name: 'eval',
    description: 'Execute algum código em JavaScript.',
    usage: 'eval [código]',
    category: 'Limitado'
  },
  
  execute: async (message, args) => {
    let code = args.join(" ");
    let prefix = await db.get(`prefix_${message.guild.id}`) || '.';
    let id = '983856696399134751';
    
    if (message.author.id !== id) return;
    
    if (!code) {
      let embed = new Discord.EmbedBuilder()
      .setTitle(`**❓ | ${prefix}eval**`)
      .setDescription(`**❌ Você não usou o comando da forma correta. Veja os exemplos abaixo.**\n**\`${prefix}eval [código]\`**\n**\`${prefix}eval console.log('Olá mundo!')\`**`)
      .setFooter({ text: `Comando executado por ${message.author.username}` })
      .setColor(0xff0000)
      .setTimestamp();
      
      return await message.reply({ embeds: [embed] });
    }
    
    let regex = /```js\n([\s\S]+?)\n```/;
    let newCode = String(code).match(regex);
    
    if (newCode && newCode[1]) {
      try {
        let result = await eval(newCode[1]);
        
        if (result && result instanceof Promise) result = await result;
        
        let successEmbed = new Discord.EmbedBuilder()
        .setTitle(`**💻 | Código executado!**`)
        .setDescription(`**↪️ Entrada:**\n\`\`\`js\n${newCode[1]}\n\`\`\`\n**↩️ Saída:**\n\`\`\`js\n${result}\n\`\`\``)
        .setFooter({ text: `Comando executado por ${message.author.username}` })
        .setColor(0x00ff00)
        .setTimestamp();
        
        await message.reply({ embeds: [successEmbed] });
      } catch (err) {
        let errorEmbed = new Discord.EmbedBuilder()
        .setTitle(`**❌ | Erro no código!**`)
        .setDescription(`\`\`\`js\n${err}\n\`\`\``)
        .setFooter({ text: `Comando executado por ${message.author.username}` })
        .setColor(0xff0000)
        .setTimestamp();
        
        await message.reply({ embeds: [errorEmbed] });
      }
    } else {
      return await message.reply({ content: `**❌ | Use um bloco de código "js" para eu reconhecê-lo.**` });
    }
  }
}