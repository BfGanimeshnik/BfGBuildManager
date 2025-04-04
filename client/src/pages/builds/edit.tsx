import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BuildForm } from "@/components/build/build-form";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Build } from "@shared/schema";

export default function EditBuildPage() {
  const params = useParams();
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<any>(null);
  const id = params?.id;
  
  // Fetch build data
  const { data, isError, error } = useQuery<Build>({
    queryKey: [`/api/builds/${id}`],
    enabled: !!id,
  });
  
  useEffect(() => {
    if (data) {
      // Transform the data to match the form's expected format
      // Important: We need to preserve the id and all structure for form updating
      const formattedData = {
        ...data,
        // Ensure required fields have non-null values
        name: data.name || "",
        activityType: data.activityType || "",
        commandAlias: data.commandAlias || "",
        tier: data.tier || "T8",
        // Other transformations as needed
        description: data.description || "",
        estimatedCost: data.estimatedCost || "",
        // Make sure equipment structure is preserved
        equipment: data.equipment || {},
        // Make sure alternatives structure is preserved
        alternatives: data.alternatives || {},
        // Preserve other fields
        isMeta: data.isMeta || false,
        tags: data.tags || [],
        id: data.id
      };
      
      setFormData(formattedData);
      setIsLoading(false);
    } else if (isError) {
      setIsLoading(false);
      console.error("Error loading build:", error);
    }
  }, [data, isError, error]);
  
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!formData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold mb-4">Build Not Found</h1>
        <p className="text-[#B9BBBE] mb-6">The build you are looking for does not exist.</p>
        <Button onClick={() => navigate("/builds")}>Go to Builds</Button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top Navigation */}
      <header className="bg-[#2F3136] shadow-sm z-10">
        <div className="flex items-center h-16 px-6">
          <div className="mr-4">
            <Link href={`/builds/${id}`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          <h1 className="text-xl font-bold">Edit Build</h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto fancy-scrollbar bg-[#36393F] p-6">
        <BuildForm initialData={formData} isEditing={true} />
      </main>
    </div>
  );
}