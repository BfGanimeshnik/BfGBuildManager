import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Cog,
  ChartBarStacked,
  ChevronDown,
  LogOut,
  Swords,
  Users,
  Clock,
  Globe,
  Package,
  ShieldCheck,
  LogIn,
  Plus,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

type SidebarItemProps = {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  current: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

const SidebarItem = ({ href, icon, children, current, onClick }: SidebarItemProps) => (
  <div className="sidebar-item-container">
    <Link href={href} onClick={onClick}>
      <div
        className={`sidebar-item flex items-center px-4 py-2 text-sm rounded-md w-full cursor-pointer ${
          current ? "active" : ""
        }`}
      >
        <span className="mr-3">{icon}</span>
        {children}
      </div>
    </Link>
  </div>
);

export function Sidebar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const isAuthenticated = !!user;
  
  // Parse URL to get current filters
  const getParamsFromUrl = () => {
    let activityType: string | null = null;
    let filterMode: string | null = null;
    
    if (location.includes('?')) {
      const params = new URLSearchParams(location.split('?')[1]);
      activityType = params.get('activityType');
      filterMode = params.get('filter');
    }
    return { activityType, filterMode };
  };
  
  const { activityType: currentActivityType, filterMode: currentFilterMode } = getParamsFromUrl();
  
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    management: true,
    special: true,
    categories: true,
  });

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Функции для обновления фильтров
  const [setLocation] = useLocation();
  
  const handleActivityTypeChange = (activityType: string) => {
    // Создание URL с параметром типа активности
    const params = new URLSearchParams();
    params.set("activityType", activityType);
    
    // Программное обновление URL с перезагрузкой страницы для применения фильтров
    window.location.href = `/builds?${params.toString()}`;
  };
  
  const handleFilterModeChange = (filterMode: string) => {
    // Создание URL с параметром фильтра
    const params = new URLSearchParams();
    params.set("filter", filterMode);
    
    // Программное обновление URL с перезагрузкой страницы для применения фильтров
    window.location.href = `/builds?${params.toString()}`;
  };
  
  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="hidden md:flex md:w-64 flex-col bg-[#2F3136] border-r border-[#202225] h-full">
      {/* Logo Area */}
      <div className="p-4 flex items-center border-b border-[#202225]">
        <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-black font-bold text-xl">
          AO
        </div>
        <div className="ml-3">
          <h1 className="font-bold text-lg">Albion Bot</h1>
          <p className="text-[#B9BBBE] text-xs">
            {isAuthenticated ? 'Admin Dashboard' : 'Build Browser'}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 pt-4 pb-4 overflow-y-auto fancy-scrollbar">
        {/* Management Section - Only show admin options when authenticated */}
        <div className="px-4 mb-3 flex items-center justify-between cursor-pointer" 
             onClick={() => toggleCategory("management")}>
          <h2 className="text-[#B9BBBE] uppercase tracking-wider text-xs font-semibold">
            {isAuthenticated ? 'Management' : 'Navigation'}
          </h2>
          <ChevronDown 
            className={`h-4 w-4 text-[#B9BBBE] transform transition-transform ${
              expandedCategories.management ? "rotate-0" : "-rotate-90"
            }`}
          />
        </div>
        
        {expandedCategories.management && (
          <div className="space-y-1 px-2 mb-4">
            <SidebarItem
              href="/builds"
              icon={<Package className="h-5 w-5" />}
              current={(location === "/" || location === "/builds" || 
                (location.startsWith("/builds") && !location.includes("edit") && !location.includes("new") && !location.includes("?")))}
            >
              Builds
            </SidebarItem>
            
            {isAuthenticated && (
              <>
                <SidebarItem
                  href="/builds/new"
                  icon={<Plus className="h-5 w-5" />}
                  current={location === "/builds/new"}
                >
                  Create Build
                </SidebarItem>
                <SidebarItem
                  href="/settings"
                  icon={<Cog className="h-5 w-5" />}
                  current={location === "/settings"}
                >
                  Settings
                </SidebarItem>
                <SidebarItem
                  href="/stats"
                  icon={<ChartBarStacked className="h-5 w-5" />}
                  current={location === "/stats"}
                >
                  Statistics
                </SidebarItem>
              </>
            )}
          </div>
        )}

        {/* Special Filters Section */}
        <div className="px-4 mt-6 mb-3 flex items-center justify-between cursor-pointer"
             onClick={() => toggleCategory("special")}>
          <h2 className="text-[#B9BBBE] uppercase tracking-wider text-xs font-semibold">
            Special Filters
          </h2>
          <ChevronDown 
            className={`h-4 w-4 text-[#B9BBBE] transform transition-transform ${
              expandedCategories.special ? "rotate-0" : "-rotate-90"
            }`}
          />
        </div>
        
        {expandedCategories.special && (
          <div className="space-y-1 px-2 mb-4">
            <SidebarItem
              href="#"
              icon={<ShieldCheck className="h-5 w-5 text-yellow-400" />}
              current={currentFilterMode === "meta"}
              onClick={(e) => {
                e.preventDefault();
                handleFilterModeChange("meta");
              }}
            >
              Meta Builds
            </SidebarItem>
            <SidebarItem
              href="#"
              icon={<Clock className="h-5 w-5 text-blue-400" />}
              current={currentFilterMode === "recent"}
              onClick={(e) => {
                e.preventDefault();
                handleFilterModeChange("recent");
              }}
            >
              Recent Builds
            </SidebarItem>
          </div>
        )}

        {/* Build Categories Section */}
        <div className="px-4 mt-2 mb-3 flex items-center justify-between cursor-pointer"
             onClick={() => toggleCategory("categories")}>
          <h2 className="text-[#B9BBBE] uppercase tracking-wider text-xs font-semibold">
            Activity Types
          </h2>
          <ChevronDown 
            className={`h-4 w-4 text-[#B9BBBE] transform transition-transform ${
              expandedCategories.categories ? "rotate-0" : "-rotate-90"
            }`}
          />
        </div>
        
        {expandedCategories.categories && (
          <div className="space-y-1 px-2">
            <SidebarItem
              href="#"
              icon={<Swords className="h-5 w-5" />}
              current={currentActivityType === "Solo PvP"}
              onClick={(e) => {
                e.preventDefault();
                handleActivityTypeChange("Solo PvP");
              }}
            >
              Solo PvP
            </SidebarItem>
            <SidebarItem
              href="#"
              icon={<Users className="h-5 w-5" />}
              current={currentActivityType === "Group PvP"}
              onClick={(e) => {
                e.preventDefault();
                handleActivityTypeChange("Group PvP");
              }}
            >
              Group PvP
            </SidebarItem>
            <SidebarItem
              href="#"
              icon={<Clock className="h-5 w-5" />}
              current={currentActivityType === "Ganking"}
              onClick={(e) => {
                e.preventDefault();
                handleActivityTypeChange("Ganking");
              }}
            >
              Ganking
            </SidebarItem>
            <SidebarItem
              href="#"
              icon={<Package className="h-5 w-5" />}
              current={currentActivityType === "Gathering"}
              onClick={(e) => {
                e.preventDefault();
                handleActivityTypeChange("Gathering");
              }}
            >
              Gathering
            </SidebarItem>
            <SidebarItem
              href="#"
              icon={<Globe className="h-5 w-5" />}
              current={currentActivityType === "Avalon"}
              onClick={(e) => {
                e.preventDefault();
                handleActivityTypeChange("Avalon");
              }}
            >
              Avalon
            </SidebarItem>
            <SidebarItem
              href="#"
              icon={<ShieldCheck className="h-5 w-5" />}
              current={currentActivityType === "Farming"}
              onClick={(e) => {
                e.preventDefault();
                handleActivityTypeChange("Farming");
              }}
            >
              Farming
            </SidebarItem>
          </div>
        )}
      </nav>

      {/* User Area */}
      <div className="p-4 border-t border-[#202225] flex items-center">
        {isAuthenticated ? (
          <>
            <div className="w-8 h-8 rounded-full bg-[#5865F2] flex items-center justify-center">
              <span className="text-xs font-medium">
                {user?.username?.slice(0, 2).toUpperCase() || 'AD'}
              </span>
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium">{user?.username || 'Admin'}</p>
              <p className="text-xs text-[#B9BBBE]">Online</p>
            </div>
            <div className="ml-auto flex space-x-2">
              <button 
                className="text-[#B9BBBE] hover:text-white"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="w-8 h-8 rounded-full bg-[#5865F2] flex items-center justify-center">
              <span className="text-xs font-medium">?</span>
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium">Guest</p>
              <p className="text-xs text-[#B9BBBE]">Browse Only</p>
            </div>
            <div className="ml-auto flex space-x-2">
              <Link href="/auth">
                <div className="text-[#B9BBBE] hover:text-white">
                  <LogIn className="h-5 w-5" />
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
