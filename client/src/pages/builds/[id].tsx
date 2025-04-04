import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { type Build } from "@shared/schema";
import { BuildDetail } from "@/components/build/build-detail";

export default function BuildDetailPage() {
  const [match, params] = useRoute<{ id: string }>("/builds/:id");
  const [, setLocation] = useLocation();

  // If the URL is /builds/new, redirect to the new build page
  if (params?.id === "new") {
    setLocation("/builds/new");
    return null;
  }

  // Extract the actual ID and check if it's for editing
  const isEditing = params?.id?.endsWith("/edit");
  const id = isEditing ? params?.id?.replace("/edit", "") : params?.id;

  // Fetch build data
  const { data: build, isLoading, isError } = useQuery<Build>({
    queryKey: [`/api/builds/${id}`],
    enabled: !!id && !isNaN(Number(id)),
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-[#2F3136] shadow-sm z-10 h-16 flex items-center px-6">
          <h1 className="text-xl font-bold">Loading Build...</h1>
        </header>
        <main className="flex-1 bg-[#36393F] p-6 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
        </main>
      </div>
    );
  }

  // Error state
  if (isError || !build) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-[#2F3136] shadow-sm z-10 h-16 flex items-center px-6">
          <h1 className="text-xl font-bold">Build Not Found</h1>
        </header>
        <main className="flex-1 bg-[#36393F] p-6 flex flex-col justify-center items-center">
          <div className="text-lg font-semibold text-[#ED4245] mb-2">
            Failed to load build
          </div>
          <p className="text-[#B9BBBE] mb-4">
            The build you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <button
            className="text-[#5865F2] hover:underline"
            onClick={() => setLocation("/builds")}
          >
            Back to Builds
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="bg-[#2F3136] shadow-sm z-10 h-16 flex items-center px-6">
        <h1 className="text-xl font-bold">{build.name}</h1>
      </header>
      <main className="flex-1 overflow-y-auto fancy-scrollbar bg-[#36393F] p-6">
        <BuildDetail build={build} />
      </main>
    </div>
  );
}
