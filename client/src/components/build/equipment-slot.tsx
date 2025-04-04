import { Card, CardContent } from "@/components/ui/card";
import { Swords, Shield, ShieldHalf, Shirt, Footprints, GraduationCap, Coffee, FlaskConical, HardHat } from "lucide-react";

interface EquipmentSlotProps {
  name: string;
  tier: string;
  quality?: string;
  type: string;
  size?: 'small' | 'medium' | 'large';
}

export function EquipmentSlot({ name, tier, quality, type, size = 'small' }: EquipmentSlotProps) {
  // Choose icon based on equipment type
  const getIcon = () => {
    switch (type.toLowerCase()) {
      case 'weapon':
        return <Swords />;
      case 'off-hand':
        return <Shield />;
      case 'head':
        return <ShieldHalf />;
      case 'chest':
        return <Shirt />;
      case 'shoes':
        return <Footprints />;
      case 'cape':
        return <GraduationCap />;
      case 'food':
        return <Coffee />;
      case 'potion':
        return <FlaskConical />;
      case 'mount':
        return <HardHat />;
      default:
        return <Swords />;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'large':
        return {
          container: "p-3",
          icon: "w-16 h-16 mb-2",
          name: "text-sm font-medium",
          tier: "text-xs text-[#B9BBBE]"
        };
      case 'medium':
        return {
          container: "p-2",
          icon: "w-12 h-12 mb-1.5",
          name: "text-xs font-medium",
          tier: "text-xs text-[#B9BBBE]"
        };
      default:
        return {
          container: "p-2",
          icon: "w-10 h-10 mb-1",
          name: "text-xs",
          tier: "text-[10px] text-[#B9BBBE]"
        };
    }
  };

  const sizeClasses = getSizeClasses();

  if (!name) {
    return (
      <Card className="equipment-slot bg-[#36393F] flex flex-col items-center justify-center opacity-50">
        <CardContent className={`${sizeClasses.container} flex flex-col items-center`}>
          <div className={`${sizeClasses.icon} text-[#B9BBBE]`}>
            {getIcon()}
          </div>
          <span className={sizeClasses.name}>Empty {type}</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="equipment-slot bg-[#36393F] flex flex-col items-center">
      <CardContent className={`${sizeClasses.container} flex flex-col items-center`}>
        {size === 'large' && <div className="text-[#B9BBBE] text-xs mb-2">{type}</div>}
        <div className={`${sizeClasses.icon} bg-[#2F3136] rounded-md flex items-center justify-center`}>
          {getIcon()}
        </div>
        <span className={sizeClasses.name}>{name}</span>
        {(tier || quality) && (
          <span className={sizeClasses.tier}>
            {tier}{quality ? ` ${quality}` : ''}
          </span>
        )}
      </CardContent>
    </Card>
  );
}
