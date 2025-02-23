const Discord = require('discord.js');

module.exports = {
  data: {
    name: 'avatar',
    description: 'Veja o avatar de algum usuário.',
    usage: 'avatar [@usuário?]',
    category: 'Utilidades'
  },
  
  execute: async (message, args) => {
    let user;
    let regex = /^<@[!]?(\d+)>$/;
    let getUser = String(args[0]).match(regex);
    
    if (getUser && getUser[1]) {
      user = await message.client.users.fetch(getUser[1]).catch(() => null);
    } else {
      user = await message.client.users.fetch(args[0]).catch(() => null);
    }
    
    if (!user) user = message.author;
    
    let avatar = user.displayAvatarURL({ size: 4096, dynamic: true });
    
    let embed = new Discord.EmbedBuilder()
    .setTitle(`**🖼️ | ${user.username}**`)
    .setDescription(`**⬇️ Baixe esse avatar clicando [aqui](${avatar})**`)
    .setImage(avatar)
    .setFooter({ text: `Comando executado por ${message.author.username}` })
    .setColor(0xffffff)
    .setTimestamp();
    
    await message.reply({ embeds: [embed] });
  }
}