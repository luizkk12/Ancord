const Discord = require('discord.js');
const Database = require('quick.db');
const db = new Database.QuickDB();

module.exports = {
  data: {
    name: 'help',
    description: 'Veja todos os meus comandos ou procure um específico.',
    usage: 'help [comando?]',
    category: 'Utilidades'
  },
  
  execute: async (message, args) => {
    let cmdName = args[0];
    let prefix = await db.get(`prefix_${message.guild.id}`) || '.';
    
    if (!cmdName) {
      let embed = new Discord.EmbedBuilder()
      .setTitle(`**❓ | Ajuda!**`)
      .setDescription(`**Clique nos botões abaixo para ver os comandos da categoria desejada.**`)
      .setFooter({ text: `Comando executado por ${message.author.username}` })
      .setColor(0xffffff)
      .setTimestamp();
      
      let fun = new Discord.ButtonBuilder()
      .setLabel('Diversão')
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('🎪')
      .setCustomId('funbutton');
      
      let economy = new Discord.ButtonBuilder()
      .setLabel('Economia')
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('💰')
      .setCustomId('economybutton');
      
      let utils = new Discord.ButtonBuilder()
      .setLabel('Utilidades')
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('⚙️')
      .setCustomId('utilsbutton');
      
      let buttons = new Discord.ActionRowBuilder()
      .addComponents(fun, economy, utils);
      
      let msg = await message.reply({ embeds: [embed], components: [buttons] });
      
      let collector = msg.createMessageComponentCollector();
      
      collector.on('collect', async (interaction) => {
        switch (interaction.customId) {
          case 'funbutton':
            if (interaction.user.id !== message.author.id) {
              return interaction.reply({ content: `É chato, mas para evitar erros, você mesmo execute um comando \`${prefix}help\`.`, flags: Discord.MessageFlags.Ephemeral });
            } else {
              await interaction.deferUpdate();

              let funEmbed = new Discord.EmbedBuilder()
              .setTitle(`**🎪 | Diversão!**`)
              .setDescription(`**\`reverse\`**`)
              .setFooter({ text: `Comando executado por ${message.author.username}` })
              .setColor(0xff0000)
              .setTimestamp();
              
              fun.setDisabled(true);
              economy.setDisabled(false);
              utils.setDisabled(false);
              
              await msg.edit({ embeds: [funEmbed], components: [buttons] });
            }
            break;
          case 'economybutton':
            if (interaction.user.id !== message.author.id) {
              return interaction.reply({ content: `É chato, mas para evitar erros, você mesmo execute um comando \`${prefix}help\`.`, flags: Discord.MessageFlags.Ephemeral });
            } else {
              await interaction.deferUpdate();

              let economyEmbed = new Discord.EmbedBuilder()
              .setTitle(`**💰 | Economia!**`)
              .setDescription(`**\`daily, bal\`**`)
              .setFooter({ text: `Comando executado por ${message.author.username}` })
              .setColor(0x00ff00)
              .setTimestamp();
              
              economy.setDisabled(true);
              fun.setDisabled(false);
              utils.setDisabled(false);
              
              await msg.edit({ embeds: [economyEmbed], components: [buttons] });
        }
            break;
          case 'utilsbutton':
            if (interaction.user.id !== message.author.id) {
              return interaction.reply({ content: `É chato, mas para evitar erros, você mesmo execute um comando \`${prefix}help\`.`, flags: Discord.MessageFlags.Ephemeral });
            } else {
              await interaction.deferUpdate();

              let utilsEmbed = new Discord.EmbedBuilder()
              .setTitle(`**⚙️ | Utilidades!**`)
              .setDescription(`**\`avatar, ping, help\`**`)
              .setFooter({ text: `Comando executado por ${message.author.username}` })
              .setColor(0x4287f5)
              .setTimestamp();
              
              utils.setDisabled(true);
              fun.setDisabled(false);
              economy.setDisabled(false);
              
              await msg.edit({ embeds: [utilsEmbed], components: [buttons] });
            }
        }
      });
    } else {
      let cmds = Array.from(message.client.commands.keys());
      
      let msgCmds = await message.reply({ content: `**🔄 | Procurando comando...**` });
      
      for (let i = 0; i < cmds.length; i++) {
        let response = `**🔄 | Procurando comando... ${i + 1} de ${cmds.length} comandos (${Math.floor(((i + 1) / cmds.length) * 100)}%/100%)...**`;
        await msgCmds.edit({ content: response });
      }
      
      if (!cmds.includes(cmdName)) {
        return await msgCmds.edit({ content: `**❌ | O comando \`${cmdName}\` não existe.**` });
      } else {
        let clientCommand = message.client.commands.get(cmdName);	
      
        let embed = new Discord.EmbedBuilder()
        .setTitle(`**ℹ️ | Informações do comando.**`)
        .addFields(
        {
          name: `⚙️ __**Comando**__`,
          value: `${prefix}${cmdName}`
        },
        {
          name: `📄 __**Descrição**__`,
          value: `${clientCommand.data.description}`
        },
        {
          name: `✏️ __**Uso**__`,
          value: `${prefix}${clientCommand.data.usage}`
        },
        {
          name: `⭐ __**Categoria**__`,
          value: `${clientCommand.data.category}`
        }
        )
        .setFooter({ text: `Comando executado por ${message.author.username}` })
        .setColor(0x42a7f5)
        .setTimestamp();
        
        await msgCmds.edit({ content: null, embeds: [embed] });
      }
    }
  }
}