import { BuildForm } from "@/components/build/build-form";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function NewBuildPage() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top Navigation */}
      <header className="bg-[#2F3136] shadow-sm z-10">
        <div className="flex items-center h-16 px-6">
          <div className="mr-4">
            <Link href="/builds">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          <h1 className="text-xl font-bold">Create New Build</h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto fancy-scrollbar bg-[#36393F] p-6">
        <BuildForm />
      </main>
    </div>
  );
}
