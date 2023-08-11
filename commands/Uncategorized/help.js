const { EmbedBuilder } = require("discord.js");

exports.run = (client, message, args) => {
  const embed = new EmbedBuilder()
    .setTitle(`Commands for ${client.user.username}`)
    .setDescription("Given below is a list of all my commands:")
    .setColor(429874)
    .addFields(
      {
        name: "**__Image Manipulation__**",
        value: "**_fakesay_**, **_igfake_**, **_kick_**, **_spankfake_**, **_crysay_**, **_groupphoto_**",
      },
      {
        name: "**__Fun__**",
        value:
          "**_buba_**, **_gay_**, **_insult_**, **_iq_**, **_luck_**, **_pp_**",
      },
      {
        name: "**__Others__**",
        value:
          "**_checklegacy_**, **_choose_**, **_flip_**, **_gif_**, **_invite_**, **_membercount_**, **_roll_**, **_typerace_**",
      })
    .setThumbnail(client.user.displayAvatarURL())
    .setColor(Math.floor(Math.random() * 16777216))
    .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
  message.reply({ embeds: [embed] }).catch(err => console.log(err));
};

exports.name = "help";
