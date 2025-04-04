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
} from "lucide-react";

type SidebarItemProps = {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  current: boolean;
};

const SidebarItem = ({ href, icon, children, current }: SidebarItemProps) => (
  <Link href={href}>
    <a
      className={`sidebar-item flex items-center px-4 py-2 text-sm rounded-md w-full ${
        current ? "active" : ""
      }`}
    >
      <span className="mr-3">{icon}</span>
      {children}
    </a>
  </Link>
);

export function Sidebar() {
  const [location] = useLocation();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    management: true,
    categories: true,
  });

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
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
          <p className="text-[#B9BBBE] text-xs">Admin Dashboard</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 pt-4 pb-4 overflow-y-auto fancy-scrollbar">
        {/* Management Section */}
        <div className="px-4 mb-3 flex items-center justify-between cursor-pointer" 
             onClick={() => toggleCategory("management")}>
          <h2 className="text-[#B9BBBE] uppercase tracking-wider text-xs font-semibold">
            Management
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
              current={location === "/" || location.startsWith("/builds")}
            >
              Builds
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
          </div>
        )}

        {/* Build Categories Section */}
        <div className="px-4 mt-6 mb-3 flex items-center justify-between cursor-pointer"
             onClick={() => toggleCategory("categories")}>
          <h2 className="text-[#B9BBBE] uppercase tracking-wider text-xs font-semibold">
            Build Categories
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
              href="/builds?activityType=Solo PvP"
              icon={<Swords className="h-5 w-5" />}
              current={location === "/builds?activityType=Solo PvP"}
            >
              Solo PvP
            </SidebarItem>
            <SidebarItem
              href="/builds?activityType=Group PvP"
              icon={<Users className="h-5 w-5" />}
              current={location === "/builds?activityType=Group PvP"}
            >
              Group PvP
            </SidebarItem>
            <SidebarItem
              href="/builds?activityType=Ganking"
              icon={<Clock className="h-5 w-5" />}
              current={location === "/builds?activityType=Ganking"}
            >
              Ganking
            </SidebarItem>
            <SidebarItem
              href="/builds?activityType=Gathering"
              icon={<Package className="h-5 w-5" />}
              current={location === "/builds?activityType=Gathering"}
            >
              Gathering
            </SidebarItem>
            <SidebarItem
              href="/builds?activityType=Avalon"
              icon={<Globe className="h-5 w-5" />}
              current={location === "/builds?activityType=Avalon"}
            >
              Avalon
            </SidebarItem>
            <SidebarItem
              href="/builds?activityType=Farming"
              icon={<ShieldCheck className="h-5 w-5" />}
              current={location === "/builds?activityType=Farming"}
            >
              Farming
            </SidebarItem>
          </div>
        )}
      </nav>

      {/* User Area */}
      <div className="p-4 border-t border-[#202225] flex items-center">
        <div className="w-8 h-8 rounded-full bg-[#5865F2] flex items-center justify-center">
          <span className="text-xs font-medium">AD</span>
        </div>
        <div className="ml-2">
          <p className="text-sm font-medium">Admin</p>
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
      </div>
    </div>
  );
}

export default Sidebar;
