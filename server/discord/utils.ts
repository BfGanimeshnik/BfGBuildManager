import { EmbedBuilder } from "discord.js";
import type { Build } from "@shared/schema";

// Helper function to get emoji for equipment type
export function getEquipmentEmoji(type: string): string {
  const emojis: Record<string, string> = {
    weapon: "⚔️",
    offHand: "🛡️",
    head: "🧢",
    chest: "👕",
    shoes: "👟",
    cape: "🧣",
    food: "🍖",
    potion: "🧪",
    mount: "🐎",
    bag: "🎒",
  };
  
  return emojis[type] || "❓";
}

// Format a build into a Discord embed
export function formatBuildEmbed(build: Build): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setTitle(build.name)
    .setColor('#D4AF37')
    .setDescription(build.description || "No description available")
    .setTimestamp()
    .setFooter({ text: `Build ID: #${build.id}` });
  
  // Add build info
  embed.addFields(
    { name: 'Activity Type', value: build.activityType, inline: true },
    { name: 'Meta Build', value: build.isMeta ? "Yes ⭐" : "No", inline: true },
  );
  
  if (build.estimatedCost) {
    embed.addFields({ name: 'Estimated Cost', value: build.estimatedCost, inline: true });
  }
  
  // Add equipment section
  embed.addFields({ name: 'Equipment', value: '---------------------', inline: false });
  
  // Add fields for each equipment piece
  const equipment = build.equipment;
  
  if (equipment.weapon) {
    embed.addFields(formatEquipmentField('Weapon', equipment.weapon));
  }
  
  if (equipment.offHand) {
    embed.addFields(formatEquipmentField('Off-Hand', equipment.offHand));
  }
  
  if (equipment.head) {
    embed.addFields(formatEquipmentField('Head', equipment.head));
  }
  
  if (equipment.chest) {
    embed.addFields(formatEquipmentField('Chest', equipment.chest));
  }
  
  if (equipment.shoes) {
    embed.addFields(formatEquipmentField('Shoes', equipment.shoes));
  }
  
  if (equipment.cape) {
    embed.addFields(formatEquipmentField('Cape', equipment.cape));
  }
  
  // Add consumables
  if (equipment.food || equipment.potion) {
    embed.addFields({ name: 'Consumables', value: '---------------------', inline: false });
    
    if (equipment.food) {
      embed.addFields(formatEquipmentField('Food', equipment.food));
    }
    
    if (equipment.potion) {
      embed.addFields(formatEquipmentField('Potion', equipment.potion));
    }
  }
  
  // Add mount if available
  if (equipment.mount) {
    embed.addFields(
      { name: 'Mount', value: '---------------------', inline: false },
      formatEquipmentField('Mount', equipment.mount)
    );
  }
  
  // Add alternatives if available
  if (build.alternatives) {
    const alternatives = build.alternatives;
    let alternativesText = '';
    
    if (alternatives.weapons && alternatives.weapons.length > 0) {
      alternativesText += '**Weapon Alternatives**\n';
      alternatives.weapons.forEach(weapon => {
        alternativesText += `• ${weapon.name}${weapon.description ? ` - ${weapon.description}` : ''}\n`;
      });
    }
    
    if (alternatives.armor && alternatives.armor.length > 0) {
      alternativesText += '\n**Armor Alternatives**\n';
      alternatives.armor.forEach(armor => {
        alternativesText += `• ${armor.name}${armor.description ? ` - ${armor.description}` : ''}\n`;
      });
    }
    
    if (alternatives.consumables && alternatives.consumables.length > 0) {
      alternativesText += '\n**Consumable Alternatives**\n';
      alternatives.consumables.forEach(consumable => {
        alternativesText += `• ${consumable.name}${consumable.description ? ` - ${consumable.description}` : ''}\n`;
      });
    }
    
    if (alternativesText) {
      embed.addFields({ name: 'Alternative Options', value: alternativesText, inline: false });
    }
  }
  
  // Add image if available
  if (build.imgUrl) {
    const imageUrl = build.imgUrl.startsWith('http') 
      ? build.imgUrl 
      : `${process.env.PUBLIC_URL || 'http://localhost:5000'}${build.imgUrl}`;
    
    embed.setImage(imageUrl);
  }
  
  // Add command usage
  embed.addFields({ 
    name: 'Command Usage', 
    value: `\`/build ${build.commandAlias}\``, 
    inline: false 
  });
  
  return embed;
}

// Format equipment piece for Discord embed
export function formatEquipmentField(name: string, equipment: any) {
  const emoji = getEquipmentEmoji(name.toLowerCase());
  let value = `${equipment.name}`;
  
  if (equipment.tier) {
    value += ` (${equipment.tier}`;
    if (equipment.quality) {
      value += ` ${equipment.quality}`;
    }
    value += ')';
  }
  
  return { 
    name: `${emoji} ${name}`, 
    value: value, 
    inline: true 
  };
}
