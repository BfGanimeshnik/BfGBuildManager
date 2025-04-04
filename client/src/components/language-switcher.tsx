import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { useState } from "react";

export function LanguageSwitcher() {
  const { currentLanguage, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'ru' : 'en';
    setLanguage(newLanguage);
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setIsOpen(!isOpen)}
        className="text-[#B9BBBE] hover:text-white hover:bg-[#40444B]"
      >
        <Languages className="h-5 w-5" />
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[#2F3136] border border-[#202225] z-50">
          <div className="py-1">
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${currentLanguage === 'en' ? 'text-white bg-[#5865F2]' : 'text-[#B9BBBE] hover:bg-[#40444B] hover:text-white'}`}
              onClick={() => {
                setLanguage('en');
                setIsOpen(false);
              }}
            >
              🇬🇧 English
            </button>
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${currentLanguage === 'ru' ? 'text-white bg-[#5865F2]' : 'text-[#B9BBBE] hover:bg-[#40444B] hover:text-white'}`}
              onClick={() => {
                setLanguage('ru');
                setIsOpen(false);
              }}
            >
              🇷🇺 Русский
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Более компактная версия для использования в мобильном меню
export function LanguageSwitcherSimple() {
  const { currentLanguage, setLanguage } = useTranslation();
  
  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'ru' : 'en';
    setLanguage(newLanguage);
  };
  
  return (
    <button 
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-1.5 text-sm rounded hover:bg-[#40444B]"
    >
      <Languages className="h-4 w-4" />
      <span>
        {currentLanguage === 'en' ? '🇬🇧 EN' : '🇷🇺 RU'}
      </span>
    </button>
  );
}