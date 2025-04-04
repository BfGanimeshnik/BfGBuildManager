import { useState } from "react";
import Sidebar from "@/components/ui/sidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-50 md:hidden bg-black bg-opacity-50" onClick={() => setShowMobileSidebar(false)}>
          <div className="fixed inset-y-0 left-0 z-50 h-full" onClick={(e) => e.stopPropagation()}>
            <Sidebar />
          </div>
        </div>
      )}
      
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-0 left-0 z-20 m-4">
        <Button
          variant="outline"
          size="icon"
          className="rounded-md bg-[#2F3136]"
          onClick={() => setShowMobileSidebar(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
