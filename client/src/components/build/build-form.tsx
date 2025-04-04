import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { buildSchema, equipmentSchema, alternativesSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Trash2, Upload } from "lucide-react";

// Create a combined schema for the form
const formSchema = buildSchema;

// Use this type for our form values
type FormValues = z.infer<typeof formSchema>;

// Type for an equipment piece in the form
interface EquipmentPieceInput {
  name: string;
  tier: string;
  quality?: string;
}

// Type for an alternative option
interface AlternativeOption {
  name: string;
  description?: string;
}

interface BuildFormProps {
  initialData?: FormValues;
  isEditing?: boolean;
}

export function BuildForm({ initialData, isEditing = false }: BuildFormProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imgUrl || null);
  
  // Alternative options state
  const [weaponAlternatives, setWeaponAlternatives] = useState<AlternativeOption[]>(
    initialData?.alternatives?.weapons || [{ name: "", description: "" }]
  );
  const [armorAlternatives, setArmorAlternatives] = useState<AlternativeOption[]>(
    initialData?.alternatives?.armor || [{ name: "", description: "" }]
  );
  const [consumableAlternatives, setConsumableAlternatives] = useState<AlternativeOption[]>(
    initialData?.alternatives?.consumables || [{ name: "", description: "" }]
  );

  // Initialize the form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      activityType: "Solo PvP",
      commandAlias: "",
      tier: "T8",
      estimatedCost: "",
      equipment: {
        weapon: { name: "", tier: "T8" },
        offHand: { name: "", tier: "T8" },
        head: { name: "", tier: "T8" },
        chest: { name: "", tier: "T8" },
        shoes: { name: "", tier: "T8" },
        cape: { name: "", tier: "T8" },
        food: { name: "", tier: "T8" },
        potion: { name: "", tier: "T8" },
      },
      isMeta: false,
      tags: [],
    },
  });

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image file size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Error",
        description: "Image must be a JPEG, PNG, GIF, or SVG file",
        variant: "destructive",
      });
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle alternative options
  const addAlternative = (type: 'weapons' | 'armor' | 'consumables') => {
    const newOption = { name: "", description: "" };
    if (type === 'weapons') {
      setWeaponAlternatives([...weaponAlternatives, newOption]);
    } else if (type === 'armor') {
      setArmorAlternatives([...armorAlternatives, newOption]);
    } else {
      setConsumableAlternatives([...consumableAlternatives, newOption]);
    }
  };

  const removeAlternative = (type: 'weapons' | 'armor' | 'consumables', index: number) => {
    if (type === 'weapons') {
      setWeaponAlternatives(weaponAlternatives.filter((_, i) => i !== index));
    } else if (type === 'armor') {
      setArmorAlternatives(armorAlternatives.filter((_, i) => i !== index));
    } else {
      setConsumableAlternatives(consumableAlternatives.filter((_, i) => i !== index));
    }
  };

  const updateAlternative = (
    type: 'weapons' | 'armor' | 'consumables',
    index: number,
    field: 'name' | 'description',
    value: string
  ) => {
    if (type === 'weapons') {
      const updated = [...weaponAlternatives];
      updated[index] = { ...updated[index], [field]: value };
      setWeaponAlternatives(updated);
    } else if (type === 'armor') {
      const updated = [...armorAlternatives];
      updated[index] = { ...updated[index], [field]: value };
      setArmorAlternatives(updated);
    } else {
      const updated = [...consumableAlternatives];
      updated[index] = { ...updated[index], [field]: value };
      setConsumableAlternatives(updated);
    }
  };

  // Form submission
  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);

      // Filter out empty alternatives
      const filteredWeaponAlts = weaponAlternatives.filter(alt => alt.name.trim() !== "");
      const filteredArmorAlts = armorAlternatives.filter(alt => alt.name.trim() !== "");
      const filteredConsumableAlts = consumableAlternatives.filter(alt => alt.name.trim() !== "");

      // Combine alternatives
      const alternatives = {
        weapons: filteredWeaponAlts.length > 0 ? filteredWeaponAlts : undefined,
        armor: filteredArmorAlts.length > 0 ? filteredArmorAlts : undefined,
        consumables: filteredConsumableAlts.length > 0 ? filteredConsumableAlts : undefined,
      };

      // Remove empty equipment pieces
      const equipment: any = {};
      Object.entries(values.equipment).forEach(([key, value]) => {
        if (value && value.name && value.name.trim() !== "") {
          equipment[key] = value;
        }
      });

      // Create form data for file upload
      const formData = new FormData();
      if (imageFile) {
        formData.append("image", imageFile);
      }

      // Prepare the build data with clear structure
      const buildData = {
        ...values,
        equipment,
        alternatives: Object.keys(alternatives).length > 0 ? alternatives : undefined,
        // If we're editing, make sure to explicitly include the ID
        ...(isEditing && initialData?.id ? { id: initialData.id } : {})
      };

      console.log("Sending build data:", buildData);
      formData.append("data", JSON.stringify(buildData));

      // Make the API request
      let response;
      if (isEditing && initialData?.id) {
        response = await fetch(`/api/builds/${initialData.id}`, {
          method: "PUT",
          body: formData,
          credentials: "include",
        });
      } else {
        response = await fetch("/api/builds", {
          method: "POST",
          body: formData,
          credentials: "include",
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save build");
      }

      const savedBuild = await response.json();

      toast({
        title: isEditing ? "Build Updated" : "Build Created",
        description: isEditing
          ? "Your build has been updated successfully."
          : "Your new build has been created successfully.",
      });

      // Redirect to the build details page
      setLocation(`/builds/${savedBuild.id}`);
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save build",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Activity type options
  const activityTypes = [
    "Solo PvP",
    "Group PvP",
    "Ganking",
    "Gathering",
    "Avalon",
    "Farming",
    "Dungeons",
    "HCE",
    "Arena",
  ];

  // Tier options
  const tierOptions = ["T4", "T5", "T6", "T7", "T8"];

  // Quality options
  const qualityOptions = ["Normal", "Good", "Outstanding", "Excellent", "Masterpiece"];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
            <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
            <TabsTrigger value="image">Image</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Build Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Build Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Great Axe Solo Build" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what this build is used for"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="activityType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Activity Type</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-[#36393F] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            {activityTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="commandAlias"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Command Alias</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. greataxe-solo"
                            {...field}
                            onChange={(e) => {
                              // Only allow lowercase letters, numbers, and hyphens
                              const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          This will be used in Discord commands like /build [alias]
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Tier</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-[#36393F] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            {tierOptions.map((tier) => (
                              <option key={tier} value={tier}>
                                {tier}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="estimatedCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimated Cost</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 1.2M Silver" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="isMeta"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Meta Build</FormLabel>
                        <FormDescription>
                          Mark this build as a current meta/recommended build
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Equipment Tab */}
          <TabsContent value="equipment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Weapons & Offhand</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="equipment.weapon.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weapon</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Great Axe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="equipment.weapon.tier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tier</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-[#36393F] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            >
                              {tierOptions.map((tier) => (
                                <option key={tier} value={tier}>
                                  {tier}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="equipment.weapon.quality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quality</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-[#36393F] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                              value={field.value || ""}
                            >
                              <option value="">Normal</option>
                              {qualityOptions.map((quality) => (
                                <option key={quality} value={quality}>
                                  {quality}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="equipment.offHand.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Off-hand</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Shield or Torch (optional)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="equipment.offHand.tier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tier</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-[#36393F] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                              value={field.value || ""}
                            >
                              <option value="">Select</option>
                              {tierOptions.map((tier) => (
                                <option key={tier} value={tier}>
                                  {tier}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="equipment.offHand.quality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quality</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-[#36393F] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                              value={field.value || ""}
                            >
                              <option value="">Normal</option>
                              {qualityOptions.map((quality) => (
                                <option key={quality} value={quality}>
                                  {quality}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Armor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Head */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="equipment.head.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Head</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Scholar Cowl" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="equipment.head.tier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tier</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-[#36393F] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            >
                              {tierOptions.map((tier) => (
                                <option key={tier} value={tier}>
                                  {tier}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="equipment.head.quality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quality</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-[#36393F] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                              value={field.value || ""}
                            >
                              <option value="">Normal</option>
                              {qualityOptions.map((quality) => (
                                <option key={quality} value={quality}>
                                  {quality}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Chest */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="equipment.chest.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chest</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Cleric Robe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="equipment.chest.tier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tier</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-[#36393F] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            >
                              {tierOptions.map((tier) => (
                                <option key={tier} value={tier}>
                                  {tier}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="equipment.chest.quality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quality</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-[#36393F] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                              value={field.value || ""}
                            >
                              <option value="">Normal</option>
                              {qualityOptions.map((quality) => (
                                <option key={quality} value={quality}>
                                  {quality}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Shoes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="equipment.shoes.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shoes</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Scholar Sandals" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="equipment.shoes.tier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tier</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-[#36393F] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            >
                              {tierOptions.map((tier) => (
                                <option key={tier} value={tier}>
                                  {tier}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="equipment.shoes.quality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quality</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-[#36393F] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                              value={field.value || ""}
                            >
                              <option value="">Normal</option>
                              {qualityOptions.map((quality) => (
                                <option key={quality} value={quality}>
                                  {quality}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Cape */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="equipment.cape.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cape</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Thetford Cape (optional)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="equipment.cape.tier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tier</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-[#36393F] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                              value={field.value || ""}
                            >
                              <option value="">Select</option>
                              {tierOptions.map((tier) => (
                                <option key={tier} value={tier}>
                                  {tier}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="equipment.cape.quality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quality</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-[#36393F] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                              value={field.value || ""}
                            >
                              <option value="">Normal</option>
                              {qualityOptions.map((quality) => (
                                <option key={quality} value={quality}>
                                  {quality}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Consumables</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Food */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="equipment.food.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Food</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Beef Stew (optional)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="equipment.food.tier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tier</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-[#36393F] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                            value={field.value || ""}
                          >
                            <option value="">Select</option>
                            {tierOptions.map((tier) => (
                              <option key={tier} value={tier}>
                                {tier}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Potion */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="equipment.potion.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Potion</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Resistance Potion (optional)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="equipment.potion.tier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tier</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-[#36393F] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                            value={field.value || ""}
                          >
                            <option value="">Select</option>
                            {tierOptions.map((tier) => (
                              <option key={tier} value={tier}>
                                {tier}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alternatives Tab */}
          <TabsContent value="alternatives" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Weapon Alternatives</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {weaponAlternatives.map((alt, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="md:col-span-1">
                      <FormItem>
                        <FormLabel>Weapon Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Halberd"
                            value={alt.name}
                            onChange={(e) => updateAlternative('weapons', index, 'name', e.target.value)}
                          />
                        </FormControl>
                      </FormItem>
                    </div>
                    <div className="md:col-span-1">
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. For more range"
                            value={alt.description}
                            onChange={(e) => updateAlternative('weapons', index, 'description', e.target.value)}
                          />
                        </FormControl>
                      </FormItem>
                    </div>
                    <div className="flex items-end justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAlternative('weapons', index)}
                      >
                        <Trash2 className="h-5 w-5 text-[#B9BBBE] hover:text-[#ED4245]" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addAlternative('weapons')}
                  className="w-full"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Weapon Alternative
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Armor Alternatives</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {armorAlternatives.map((alt, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="md:col-span-1">
                      <FormItem>
                        <FormLabel>Armor Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Hellion Jacket"
                            value={alt.name}
                            onChange={(e) => updateAlternative('armor', index, 'name', e.target.value)}
                          />
                        </FormControl>
                      </FormItem>
                    </div>
                    <div className="md:col-span-1">
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. For more sustain"
                            value={alt.description}
                            onChange={(e) => updateAlternative('armor', index, 'description', e.target.value)}
                          />
                        </FormControl>
                      </FormItem>
                    </div>
                    <div className="flex items-end justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAlternative('armor', index)}
                      >
                        <Trash2 className="h-5 w-5 text-[#B9BBBE] hover:text-[#ED4245]" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addAlternative('armor')}
                  className="w-full"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Armor Alternative
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Consumable Alternatives</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {consumableAlternatives.map((alt, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="md:col-span-1">
                      <FormItem>
                        <FormLabel>Consumable Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Omelette"
                            value={alt.name}
                            onChange={(e) => updateAlternative('consumables', index, 'name', e.target.value)}
                          />
                        </FormControl>
                      </FormItem>
                    </div>
                    <div className="md:col-span-1">
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Cheaper option"
                            value={alt.description}
                            onChange={(e) => updateAlternative('consumables', index, 'description', e.target.value)}
                          />
                        </FormControl>
                      </FormItem>
                    </div>
                    <div className="flex items-end justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAlternative('consumables', index)}
                      >
                        <Trash2 className="h-5 w-5 text-[#B9BBBE] hover:text-[#ED4245]" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addAlternative('consumables')}
                  className="w-full"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Consumable Alternative
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Image Tab */}
          <TabsContent value="image" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Build Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <FormLabel>Upload Image</FormLabel>
                  <div className="flex flex-col items-center justify-center w-full">
                    {imagePreview ? (
                      <div className="relative w-full mb-5">
                        <img
                          src={imagePreview}
                          alt="Build Preview"
                          className="w-full h-64 object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-[#36393F] border-[#202225] hover:bg-[#2F3136]">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-[#B9BBBE]" />
                          <p className="mb-2 text-sm text-[#B9BBBE]">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-[#B9BBBE]">
                            PNG, JPG, GIF or SVG (MAX. 5MB)
                          </p>
                        </div>
                        <input
                          id="dropzone-file"
                          type="file"
                          className="hidden"
                          accept="image/png, image/jpeg, image/gif, image/svg+xml"
                          onChange={handleImageChange}
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="text-sm text-[#B9BBBE]">
                  <p>
                    Upload an image that represents this build. The image will be shown in the build
                    details and in Discord embed messages.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={() => setLocation("/builds")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEditing ? "Update Build" : "Create Build"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
