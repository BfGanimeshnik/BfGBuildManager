import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";
import { type Build } from "@shared/schema";

interface DiscordPreviewProps {
  build: Build;
}

export function DiscordPreview({ build }: DiscordPreviewProps) {
  // Function to get emoji for equipment type
  const getEmoji = (type: string): string => {
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
  };

  return (
    <Card className="bg-[#36393F] rounded-lg overflow-hidden">
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Info className="h-5 w-5 text-[#5865F2] mr-2" />
          Discord Message Preview
        </h3>
        
        <div className="border border-[#202225] rounded-lg overflow-hidden">
          <div className="bg-[#202225]/30 py-2 px-4 flex items-center border-b border-[#202225]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#5865F2] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">Message will appear as follows in Discord</span>
          </div>
          
          <div className="p-4 bg-[#36393F]">
            <div className="mb-2 flex items-center">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-black font-bold text-sm mr-2">
                A
              </div>
              <div>
                <span className="font-medium text-sm">Albion Bot</span>
                <span className="text-[#B9BBBE] text-xs ml-2">BOT</span>
              </div>
            </div>
            
            <div className="mb-3">
              <div className="ml-10 border-l-4 border-[#D4AF37] pl-3 py-1">
                <span className="font-medium">{build.name}</span>
                <span className="text-xs text-[#B9BBBE] ml-2">#{build.id}</span>
              </div>
            </div>
            
            <div className="ml-10 border border-[#202225] rounded-md overflow-hidden">
              <div className="bg-[#2F3136] px-4 py-2 border-b border-[#202225] flex justify-between items-center">
                <span className="text-sm font-medium">Equipment Set</span>
                <span className="text-xs text-[#B9BBBE]">{build.tier} Gear</span>
              </div>
              
              <div className="px-4 py-3 flex flex-wrap gap-3">
                {build.equipment.weapon && (
                  <div className="flex items-center bg-[#202225]/30 rounded p-1.5">
                    <div className="w-6 h-6 bg-[#36393F] rounded-full flex items-center justify-center mr-2">
                      <span className="text-xs">{getEmoji('weapon')}</span>
                    </div>
                    <span className="text-xs font-medium">{build.equipment.weapon.name}</span>
                  </div>
                )}
                
                {build.equipment.offHand && (
                  <div className="flex items-center bg-[#202225]/30 rounded p-1.5">
                    <div className="w-6 h-6 bg-[#36393F] rounded-full flex items-center justify-center mr-2">
                      <span className="text-xs">{getEmoji('offHand')}</span>
                    </div>
                    <span className="text-xs font-medium">{build.equipment.offHand.name}</span>
                  </div>
                )}
                
                {build.equipment.head && (
                  <div className="flex items-center bg-[#202225]/30 rounded p-1.5">
                    <div className="w-6 h-6 bg-[#36393F] rounded-full flex items-center justify-center mr-2">
                      <span className="text-xs">{getEmoji('head')}</span>
                    </div>
                    <span className="text-xs font-medium">{build.equipment.head.name}</span>
                  </div>
                )}
                
                {build.equipment.chest && (
                  <div className="flex items-center bg-[#202225]/30 rounded p-1.5">
                    <div className="w-6 h-6 bg-[#36393F] rounded-full flex items-center justify-center mr-2">
                      <span className="text-xs">{getEmoji('chest')}</span>
                    </div>
                    <span className="text-xs font-medium">{build.equipment.chest.name}</span>
                  </div>
                )}
                
                {build.equipment.shoes && (
                  <div className="flex items-center bg-[#202225]/30 rounded p-1.5">
                    <div className="w-6 h-6 bg-[#36393F] rounded-full flex items-center justify-center mr-2">
                      <span className="text-xs">{getEmoji('shoes')}</span>
                    </div>
                    <span className="text-xs font-medium">{build.equipment.shoes.name}</span>
                  </div>
                )}
              </div>
              
              <div className="px-4 py-2 border-t border-[#202225] text-xs text-[#B9BBBE]">
                <p>Use <span className="bg-[#36393F] px-1 py-0.5 rounded font-mono">/build {build.commandAlias}</span> to view full details</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
