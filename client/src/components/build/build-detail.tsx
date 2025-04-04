import { useState } from "react";
import { Link, useRoute, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, ChevronRight } from "lucide-react";
import { type Build, equipmentSchema, alternativesSchema } from "@shared/schema";
import { EquipmentSlot } from "./equipment-slot";
import { DiscordPreview } from "./discord-preview";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

interface BuildDetailProps {
  build: Build;
}

export function BuildDetail({ build }: BuildDetailProps) {
  // Type validation to ensure proper structure
  const equip = equipmentSchema.parse(build.equipment);
  const alts = build.alternatives ? alternativesSchema.parse(build.alternatives) : null;
  
  // Define explicit types for optional equipment pieces to avoid TypeScript errors
  type AlternativeItem = { name: string; description?: string };
  type TypedAlternatives = {
    weapons?: AlternativeItem[];
    armor?: AlternativeItem[];
    consumables?: AlternativeItem[];
  };
  const [, setLocation] = useLocation();
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Function to format date
  const formatDate = (dateString: Date | string | null) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  
  // Function to create an absolute URL from a relative path
  const getAbsoluteImageUrl = (relativeUrl: string) => {
    if (!relativeUrl) return '';
    return `${window.location.origin}${relativeUrl}`;
  };

  const handleDelete = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      
      const confirmed = window.confirm(
        `Are you sure you want to delete "${build.name}"? This action cannot be undone.`
      );
      
      if (!confirmed) {
        setIsDeleting(false);
        return;
      }
      
      await apiRequest("DELETE", `/api/builds/${build.id}`);
      
      toast({
        title: "Build Deleted",
        description: "The build has been deleted successfully.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/builds"] });
      setLocation("/builds");
    } catch (error) {
      console.error("Failed to delete build:", error);
      toast({
        title: "Error",
        description: "Failed to delete the build. Please try again.",
        variant: "destructive",
      });
      setIsDeleting(false);
    }
  };



  return (
    <Card className="bg-[#2F3136] border-[#202225] overflow-hidden mb-8">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center">
              <Link href="/builds" className="mr-3 p-1 rounded-full bg-[#36393F] inline-flex items-center justify-center">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h2 className="text-2xl font-bold">{build.name}</h2>
            </div>
            <div className="flex items-center mt-2 space-x-2">
              <Badge variant="outline" className="bg-[#D4AF37]/20 text-[#D4AF37]">
                {build.activityType}
              </Badge>
              <Badge variant="outline" className="bg-[#D4AF37]/20 text-[#D4AF37]">
                {build.tier} Gear
              </Badge>
              {build.isMeta && (
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  Meta Build
                </Badge>
              )}
              <span className="text-[#B9BBBE] text-sm">ID: #{build.id}</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="default"
              onClick={() => setLocation(`/builds/${build.id}/edit`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Build
            </Button>
            <Button 
              variant="destructive" 
              size="icon"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-[#36393F] rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Build Information</h3>
              {build.imgUrl && (
                <div className="mt-2 mb-4">
                  <div className="text-[#B9BBBE] text-sm mb-1">Build Image</div>
                  <img 
                    src={getAbsoluteImageUrl(build.imgUrl)} 
                    alt={build.name}
                    className="w-full h-auto rounded-md mb-2 border border-[#202225]"
                  />
                  <div className="text-[#B9BBBE] text-sm mb-1">Image URL</div>
                  <div className="bg-[#202225]/30 rounded p-2 font-mono text-xs break-all">
                    {build.imgUrl}
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <div className="text-[#B9BBBE] text-sm mb-1">Description</div>
                  <p className="text-sm">{build.description || "No description provided."}</p>
                </div>
                
                <div>
                  <div className="text-[#B9BBBE] text-sm mb-1">Last Updated</div>
                  <p className="text-sm">{formatDate(build.updatedAt)}</p>
                </div>
                
                <div>
                  <div className="text-[#B9BBBE] text-sm mb-1">Activity Type</div>
                  <p className="text-sm">{build.activityType}</p>
                </div>
                
                {build.estimatedCost && (
                  <div>
                    <div className="text-[#B9BBBE] text-sm mb-1">Estimated Cost</div>
                    <p className="text-sm">{build.estimatedCost}</p>
                  </div>
                )}
                
                <div>
                  <div className="text-[#B9BBBE] text-sm mb-1">Command Usage</div>
                  <div className="bg-[#202225]/30 rounded p-2 font-mono text-xs">
                    /build {build.commandAlias}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-[#36393F] rounded-lg p-4 mb-6">
              <h3 className="text-lg font-medium mb-4">Equipment Set</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {equip.weapon && (
                  <EquipmentSlot
                    name={equip.weapon.name}
                    tier={equip.weapon.tier}
                    quality={equip.weapon.quality}
                    type="Weapon"
                    size="large"
                  />
                )}
                
                {equip.offHand && (
                  <EquipmentSlot
                    name={equip.offHand.name || ""}
                    tier={equip.offHand.tier || undefined}
                    quality={equip.offHand.quality}
                    type="Off-hand"
                    size="large"
                  />
                )}
                
                {equip.head && (
                  <EquipmentSlot
                    name={equip.head.name}
                    tier={equip.head.tier}
                    quality={equip.head.quality}
                    type="Head"
                    size="large"
                  />
                )}
                
                {equip.chest && (
                  <EquipmentSlot
                    name={equip.chest.name}
                    tier={equip.chest.tier}
                    quality={equip.chest.quality}
                    type="Chest"
                    size="large"
                  />
                )}
                
                {equip.shoes && (
                  <EquipmentSlot
                    name={equip.shoes.name}
                    tier={equip.shoes.tier}
                    quality={equip.shoes.quality}
                    type="Shoes"
                    size="large"
                  />
                )}
                
                {equip.cape && (
                  <EquipmentSlot
                    name={equip.cape.name || ""}
                    tier={equip.cape.tier || undefined}
                    quality={equip.cape.quality}
                    type="Cape"
                    size="large"
                  />
                )}
                
                {equip.food && (
                  <EquipmentSlot
                    name={equip.food.name || ""}
                    tier={equip.food.tier || undefined}
                    type="Food"
                    size="large"
                  />
                )}
                
                {equip.potion && (
                  <EquipmentSlot
                    name={equip.potion.name || ""}
                    tier={equip.potion.tier || undefined}
                    type="Potion"
                    size="large"
                  />
                )}
              </div>
            </div>
            
            {alts && (
              <div className="bg-[#36393F] rounded-lg p-4 mb-6">
                <h3 className="text-lg font-medium mb-4">Alternative Options</h3>
                
                <div className="space-y-3">
                  {alts.weapons && alts.weapons.length > 0 && (
                    <div className="bg-[#2F3136] rounded-lg p-3">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded bg-[#202225] flex items-center justify-center mr-3">
                          <ChevronRight className="h-5 w-5" />
                        </div>
                        <h4 className="font-medium">Weapon Alternatives</h4>
                      </div>
                      <div className="pl-11">
                        {alts.weapons.map((weapon, index) => (
                          <p key={index} className="text-sm mt-1">
                            <span className="font-medium">{weapon.name}</span>
                            {weapon.description && ` - ${weapon.description}`}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {alts.armor && alts.armor.length > 0 && (
                    <div className="bg-[#2F3136] rounded-lg p-3">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded bg-[#202225] flex items-center justify-center mr-3">
                          <ChevronRight className="h-5 w-5" />
                        </div>
                        <h4 className="font-medium">Armor Alternatives</h4>
                      </div>
                      <div className="pl-11">
                        {alts.armor.map((armor, index) => (
                          <p key={index} className="text-sm mt-1">
                            <span className="font-medium">{armor.name}</span>
                            {armor.description && ` - ${armor.description}`}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {alts.consumables && alts.consumables.length > 0 && (
                    <div className="bg-[#2F3136] rounded-lg p-3">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded bg-[#202225] flex items-center justify-center mr-3">
                          <ChevronRight className="h-5 w-5" />
                        </div>
                        <h4 className="font-medium">Consumable Alternatives</h4>
                      </div>
                      <div className="pl-11">
                        {alts.consumables.map((consumable, index) => (
                          <p key={index} className="text-sm mt-1">
                            <span className="font-medium">{consumable.name}</span>
                            {consumable.description && ` - ${consumable.description}`}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6">
          <DiscordPreview build={build} />
        </div>
      </CardContent>
    </Card>
  );
}
