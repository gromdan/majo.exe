import { formatDuration } from "@majoexe/util/functions";
import { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder, codeBlock } from "discord.js";

export default {
 name: "help",
 description: "❔ Display a list of all available commands",
 type: ApplicationCommandType.ChatInput,
 cooldown: 5000,
 dm_permission: true,
 usage: "/help [command]",
 options: [
  {
   name: "query",
   description: "The full name of command or category",
   type: ApplicationCommandOptionType.String,
   required: false,
  },
 ],

 run: async (client, interaction, guildSettings) => {
  try {
   const query = interaction.options.getString("query");
   const isCategory = client.slashCommands.map((cmd) => cmd.category?.toLowerCase()).includes(query?.toLowerCase());
   if (query && !isCategory) {
    const command = client.slashCommands.get(query.toLowerCase()) || client.slashCommands.find((cmd) => cmd.aliases && cmd.aliases.includes(query.toLowerCase()));
    if (!command) {
     const embed = new EmbedBuilder()
      .setColor(guildSettings?.embedColor || client.config.bot.defaultEmbedColor)
      .setTimestamp()
      .setTitle("❌ Command not found")
      .setDescription(`> The command \`${query}\` does not exist. Please check your spelling and try again.`)
      .setFooter({
       text: `Requested by ${interaction.member?.user?.username}`,
       iconURL: interaction.member?.user?.displayAvatarURL({
        dynamic: true,
        format: "png",
        size: 2048,
       }),
      });
     return interaction.followUp({ ephemeral: true, embeds: [embed] });
    }

    const embed = new EmbedBuilder()
     .setTitle(`❔ Help for ${command.name}`)
     .addFields([
      {
       name: "Name",
       value: codeBlock(command.name),
       inline: true,
      },
      {
       name: "Usage",
       value: codeBlock(command.usage),
       inline: true,
      },
      {
       name: "Description",
       value: codeBlock(command.description),
      },
      {
       name: "Cooldown",
       value: codeBlock(formatDuration(command.cooldown || 0)),
       inline: true,
      },
      {
       name: "Category",
       value: codeBlock(command.category),
       inline: true,
      },
      {
       name: "DM Permission",
       value: codeBlock(command.dm_permission ? "Yes" : "No"),
       inline: true,
      },
     ])
     .setColor(guildSettings?.embedColor || client.config.bot.defaultEmbedColor)
     .setTimestamp()
     .setFooter({
      text: `Requested by ${interaction.member?.user?.username}`,
      iconURL: interaction.member.user.displayAvatarURL({
       dynamic: true,
       format: "png",
       size: 2048,
      }),
     });
    return interaction.followUp({ ephemeral: false, embeds: [embed] });
   } else if (query && isCategory) {
    const commands = client.slashCommands.filter((cmd) => cmd.category.toLowerCase() === query.toLowerCase());
    const embed = new EmbedBuilder()
     .setTitle(`${client.botEmojis.categories.find((cat) => cat.name === query.toLowerCase()).emoji} Available \`${query}\` commands \`(${commands.size})\``)
     .setDescription(`> ${commands.map((cmd) => `\`/${cmd.name}\``).join(", ")}`)
     .setColor(guildSettings?.embedColor || client.config.bot.defaultEmbedColor)
     .setTimestamp()
     .setFooter({
      text: `Requested by ${interaction.member?.user?.username}`,
      iconURL: interaction.member.user.displayAvatarURL({
       dynamic: true,
       format: "png",
       size: 2048,
      }),
     });
    return interaction.followUp({ ephemeral: false, embeds: [embed] });
   } else {
    const categories = [...new Set(client.slashCommands.map((cmd) => cmd.category))];

    // Why? Because I can. 🥫
    const inviteLink = `https://discord.com/oauth2/authorize/?permissions=${client.config.bot.permissions}&scope=${client.config.bot.scopes}&client_id=${client.user?.id}`;

    const embed = new EmbedBuilder()
     .setTitle("❔ Help")
     .setDescription(`> Use the menu, or use [\`/help [category]\`](${inviteLink}) to view commands based on their category!`)
     .addFields(
      categories.map((category) => ({
       name: `${client.botEmojis.categories.find((cat) => cat.name === category.toLowerCase()).emoji} ${category}`,
       value: codeBlock(`/help ${category.toLowerCase()}`),
       inline: true,
      }))
     )
     .setColor(guildSettings?.embedColor || client.config.bot.defaultEmbedColor)
     .setTimestamp()
     .setThumbnail(client.user?.displayAvatarURL({ dynamic: true, format: "png", size: 2048 }))
     .setAuthor({
      name: `${client.user?.username} Help`,
      iconURL: client.user?.displayAvatarURL({ dynamic: true, format: "png", size: 2048 }),
     })
     .setFooter({
      text: `Requested by ${interaction.member?.user?.username}`,
      iconURL: interaction.member.user.displayAvatarURL({
       dynamic: true,
       format: "png",
       size: 2048,
      }),
     });
    return interaction.followUp({ ephemeral: false, embeds: [embed] });
   }
  } catch (err) {
   client.errorMessages.generateErrorMessage(interaction, err);
  }
 },
};