import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Bot, Key, BotMessageSquare, WandSparkles } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface BotSettings {
  token: string;
  clientId: string;
  guildId: string;
  prefix: string;
}

export default function SettingsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [settings, setSettings] = useState<BotSettings>({
    token: "",
    clientId: "",
    guildId: "",
    prefix: "/",
  });

  // Fetch current bot settings
  const { isLoading } = useQuery<BotSettings>({
    queryKey: ["/api/bot-settings"],
    onSuccess: (data) => {
      setSettings({
        token: data.token || "",
        clientId: data.clientId || "",
        guildId: data.guildId || "",
        prefix: data.prefix || "/",
      });
    },
    onError: (error) => {
      console.error("Failed to fetch bot settings:", error);
      toast({
        title: "Error",
        description: "Failed to load bot settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Save bot settings mutation
  const { mutate: saveSettings, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/bot-settings", settings);
    },
    onSuccess: () => {
      toast({
        title: "Settings Saved",
        description: "Discord bot settings have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bot-settings"] });
    },
    onError: (error) => {
      console.error("Failed to save bot settings:", error);
      toast({
        title: "Error",
        description: "Failed to save bot settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings();
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top Navigation */}
      <header className="bg-[#2F3136] shadow-sm z-10">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Settings</h1>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto fancy-scrollbar bg-[#36393F] p-6">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <Card className="bg-[#2F3136] border-[#202225] mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bot className="mr-2 h-6 w-6 text-[#5865F2]" />
                    Discord Bot Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure your Discord bot settings to enable the bot functionality.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="token">
                      Bot Token <span className="text-[#ED4245]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Key className="h-4 w-4 text-[#B9BBBE]" />
                      </div>
                      <Input
                        id="token"
                        name="token"
                        type="password"
                        placeholder="Enter your Discord bot token"
                        value={settings.token}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                    <p className="text-xs text-[#B9BBBE]">
                      You can get this from the{" "}
                      <a
                        href="https://discord.com/developers/applications"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#5865F2] hover:underline"
                      >
                        Discord Developer Portal
                      </a>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="clientId">
                      Application ID <span className="text-[#ED4245]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <BotMessageSquare className="h-4 w-4 text-[#B9BBBE]" />
                      </div>
                      <Input
                        id="clientId"
                        name="clientId"
                        placeholder="Enter your Discord application ID"
                        value={settings.clientId}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                    <p className="text-xs text-[#B9BBBE]">
                      This is your Discord application's unique identifier
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="guildId">
                      Test Guild ID
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <WandSparkles className="h-4 w-4 text-[#B9BBBE]" />
                      </div>
                      <Input
                        id="guildId"
                        name="guildId"
                        placeholder="Enter your Discord server ID (optional)"
                        value={settings.guildId}
                        onChange={handleChange}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-[#B9BBBE]">
                      For faster command updates during testing. Leave empty for global commands.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="prefix">
                      Command Prefix
                    </label>
                    <Input
                      id="prefix"
                      name="prefix"
                      placeholder="/"
                      value={settings.prefix}
                      onChange={handleChange}
                      maxLength={3}
                    />
                    <p className="text-xs text-[#B9BBBE]">
                      Default prefix for commands. Discord slash commands use "/"
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <p className="text-xs text-[#B9BBBE]">
                    <span className="text-[#ED4245]">*</span> Required fields
                  </p>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Settings"}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-[#2F3136] border-[#202225]">
                <CardHeader>
                  <CardTitle>Command Help</CardTitle>
                  <CardDescription>
                    Available Discord bot commands for Albion Online builds
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-[#36393F] p-4 rounded-md font-mono text-sm">
                    <div className="mb-3">
                      <span className="text-[#5865F2]">/build</span> &lt;name&gt;
                      <p className="text-[#B9BBBE] ml-6 mt-1">
                        Show a specific build by its name or alias
                      </p>
                    </div>

                    <div className="mb-3">
                      <span className="text-[#5865F2]">/builds</span> [activity]
                      <p className="text-[#B9BBBE] ml-6 mt-1">
                        List all available builds, optionally filtered by activity type
                      </p>
                    </div>

                    <div>
                      <span className="text-[#5865F2]">/albion-help</span>
                      <p className="text-[#B9BBBE] ml-6 mt-1">
                        Show help information for the Albion Online Bot
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
