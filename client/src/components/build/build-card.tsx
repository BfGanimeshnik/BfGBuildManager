import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { equipmentSchema } from "@shared/schema";
import { z } from "zod";
import { EquipmentSlot } from "./equipment-slot";

interface BuildCardProps {
  id: number;
  name: string;
  description?: string;
  activityType: string;
  tier: string;
  imgUrl?: string;
  equipment: z.infer<typeof equipmentSchema>;
  updatedAt: Date;
  isMeta?: boolean;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function BuildCard({
  id,
  name,
  description,
  activityType,
  tier,
  imgUrl,
  equipment,
  updatedAt,
  isMeta = false,
  onView,
  onEdit,
  onDelete,
}: BuildCardProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      
      const confirmed = window.confirm(
        `Are you sure you want to delete "${name}"? This action cannot be undone.`
      );
      
      if (!confirmed) {
        setIsDeleting(false);
        return;
      }
      
      onDelete(id);
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

  // Get total equipment pieces count
  const getTotalPieces = () => {
    let count = 0;
    Object.values(equipment).forEach(piece => {
      if (piece && piece.name) count++;
    });
    return count;
  };

  // Format the updated date
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <Card className="bg-[#2F3136] border-[#202225] overflow-hidden h-full flex flex-col">
      <CardContent className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-[#B9BBBE] text-sm">{activityType}</p>
          </div>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-[#B9BBBE] hover:text-white rounded"
              onClick={() => onEdit(id)}
            >
              <Edit className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-[#B9BBBE] hover:text-[#ED4245] rounded"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="relative">
          {imgUrl ? (
            <img 
              src={imgUrl} 
              alt={`${name} Build`} 
              className="w-full h-32 object-cover rounded-md" 
            />
          ) : (
            <div className="w-full h-32 bg-[#40444B] rounded-md flex items-center justify-center text-[#B9BBBE]">
              No Image
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 rounded-b-md">
            <div className="text-xs text-white font-medium">
              Updated {formatDate(new Date(updatedAt))}
            </div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-2">
          <EquipmentSlot 
            name={equipment.weapon?.name || ""}
            tier={equipment.weapon?.tier || ""}
            type="Weapon"
          />
          {equipment.offHand && (
            <EquipmentSlot 
              name={equipment.offHand.name || ""}
              tier={equipment.offHand.tier || ""}
              type="Off-hand"
            />
          )}
          <EquipmentSlot 
            name={equipment.head?.name || ""}
            tier={equipment.head?.tier || ""}
            type="Head"
          />
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-[#B9BBBE]">{getTotalPieces()} pieces total</span>
          <Button 
            variant="link" 
            className="text-[#5865F2] hover:underline text-sm font-medium p-0"
            onClick={() => onView(id)}
          >
            View Details
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="px-5 py-3 bg-[#202225]/30 flex justify-between items-center border-t border-[#202225]">
        <div className="flex items-center">
          {isMeta ? (
            <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
              Meta Build
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/20">
              {tier} Gear
            </Badge>
          )}
        </div>
        <div className="text-[#B9BBBE] text-sm">ID: #{id}</div>
      </CardFooter>
    </Card>
  );
}
