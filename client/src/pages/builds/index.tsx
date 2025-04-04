import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BuildCard } from "@/components/build/build-card";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, LayoutGrid, List } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { type Build } from "@shared/schema";

export default function BuildsPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activityType, setActivityType] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Get activity type from URL if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const activityTypeParam = params.get("activityType");
    if (activityTypeParam) {
      setActivityType(activityTypeParam);
    }
  }, []);

  // Fetch all builds
  const { data: builds, isLoading, isError, refetch } = useQuery<Build[]>({
    queryKey: ["/api/builds"],
  });

  // Handle build deletion
  const handleDelete = async (id: number) => {
    try {
      await apiRequest("DELETE", `/api/builds/${id}`);
      toast({
        title: "Build Deleted",
        description: "The build has been successfully deleted.",
      });
      refetch();
    } catch (error) {
      console.error("Failed to delete build:", error);
      toast({
        title: "Error",
        description: "Failed to delete the build. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter builds based on search query and activity type
  const filteredBuilds = builds
    ? builds.filter((build) => {
        const matchesSearch =
          searchQuery === "" ||
          build.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          build.commandAlias.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (build.description &&
            build.description.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesActivity =
          !activityType || build.activityType === activityType;

        return matchesSearch && matchesActivity;
      })
    : [];

  // Activity type options for filtering
  const activityTypes = [
    "Solo PvP",
    "Group PvP",
    "Ganking",
    "Gathering",
    "Avalon",
    "Farming",
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top Navigation */}
      <header className="bg-[#2F3136] shadow-sm z-10">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Builds Manager</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search builds..."
                className="bg-[#40444B] text-sm rounded-md px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-[#5865F2] border border-[#202225]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Search className="h-4 w-4 text-[#B9BBBE]" />
              </div>
            </div>

            <Button
              onClick={() => setLocation("/builds/new")}
              className="bg-[#5865F2] hover:bg-opacity-80 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center transition-colors"
            >
              <Plus className="h-5 w-5 mr-1.5" />
              New Build
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pb-2 flex space-x-4 border-b border-[#202225]">
          <button
            className={`px-3 py-2 text-sm font-medium ${
              !activityType
                ? "text-white border-b-2 border-[#D4AF37]"
                : "text-[#B9BBBE] border-b-2 border-transparent hover:text-white"
            }`}
            onClick={() => setActivityType(null)}
          >
            All Builds
          </button>
          <button
            className={`px-3 py-2 text-sm font-medium ${
              activityType === "recent"
                ? "text-white border-b-2 border-[#D4AF37]"
                : "text-[#B9BBBE] border-b-2 border-transparent hover:text-white"
            }`}
            onClick={() => setActivityType("recent")}
          >
            Recent
          </button>
          <button
            className={`px-3 py-2 text-sm font-medium ${
              activityType === "meta"
                ? "text-white border-b-2 border-[#D4AF37]"
                : "text-[#B9BBBE] border-b-2 border-transparent hover:text-white"
            }`}
            onClick={() => setActivityType("meta")}
          >
            Meta Builds
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto fancy-scrollbar bg-[#36393F] p-6">
        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
          <div className="flex flex-wrap items-center space-x-2">
            <div className="relative inline-block text-left">
              <select
                className="inline-flex justify-center items-center px-4 py-2 bg-[#2F3136] rounded-md text-sm font-medium text-white hover:bg-opacity-80 border border-[#202225] focus:outline-none"
                value={activityType || ""}
                onChange={(e) => setActivityType(e.target.value || null)}
              >
                <option value="">All Activity Types</option>
                {activityTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {activityType && (
              <div className="flex items-center space-x-1 ml-2">
                <span className="text-sm text-[#B9BBBE]">Active filters:</span>
                <div className="bg-[#2F3136] rounded-full px-3 py-1 text-xs flex items-center">
                  {activityType}
                  <button
                    className="ml-1.5 text-[#B9BBBE] hover:text-white"
                    onClick={() => setActivityType(null)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="inline-flex rounded-md shadow-sm" role="group">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              className="rounded-l-lg rounded-r-none"
              onClick={() => setViewMode("list")}
            >
              <List className="h-5 w-5" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              className="rounded-l-none rounded-r-lg"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-10">
            <div className="text-lg font-semibold text-[#ED4245] mb-2">
              Failed to load builds
            </div>
            <p className="text-[#B9BBBE]">Please try again later.</p>
            <Button className="mt-4" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        )}

        {/* No Results */}
        {!isLoading && !isError && filteredBuilds.length === 0 && (
          <div className="text-center py-10">
            <div className="text-lg font-semibold mb-2">No builds found</div>
            <p className="text-[#B9BBBE]">
              {searchQuery || activityType
                ? "Try changing your search or filter criteria."
                : "Create your first build to get started."}
            </p>
            <Button className="mt-4" onClick={() => setLocation("/builds/new")}>
              Create New Build
            </Button>
          </div>
        )}

        {/* Build Cards Grid */}
        {!isLoading && !isError && filteredBuilds.length > 0 && (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
                : "space-y-4 mb-8"
            }
          >
            {filteredBuilds.map((build) => (
              <BuildCard
                key={build.id}
                id={build.id}
                name={build.name}
                description={build.description}
                activityType={build.activityType}
                tier={build.tier}
                imgUrl={build.imgUrl}
                equipment={build.equipment}
                updatedAt={build.updatedAt}
                isMeta={build.isMeta}
                onView={(id) => setLocation(`/builds/${id}`)}
                onEdit={(id) => setLocation(`/builds/${id}/edit`)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Pagination - Simple version */}
        {!isLoading && !isError && filteredBuilds.length > 0 && (
          <div className="flex justify-between items-center">
            <div className="text-sm text-[#B9BBBE]">
              Showing <span className="font-medium">{filteredBuilds.length}</span>{" "}
              build{filteredBuilds.length !== 1 ? "s" : ""}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
