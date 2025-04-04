import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Build } from "@shared/schema";
import { ChartBarStacked, Activity, Swords, Users, Clock, Package, Info } from "lucide-react";

// Chart components
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function StatsPage() {
  // Fetch all builds to generate statistics
  const { data: builds, isLoading } = useQuery<Build[]>({
    queryKey: ["/api/builds"],
  });

  // Generate stats from builds data
  const generateStats = () => {
    if (!builds) return null;

    // Count builds by activity type
    const activityCounts: Record<string, number> = {};
    builds.forEach((build) => {
      const activity = build.activityType;
      activityCounts[activity] = (activityCounts[activity] || 0) + 1;
    });

    // Format for charts
    const activityData = Object.entries(activityCounts).map(([name, value]) => ({
      name,
      value,
    }));

    // Count weapons used
    const weaponCounts: Record<string, number> = {};
    builds.forEach((build) => {
      if (build.equipment.weapon) {
        const weapon = build.equipment.weapon.name;
        weaponCounts[weapon] = (weaponCounts[weapon] || 0) + 1;
      }
    });

    // Format for charts and sort by count
    const weaponData = Object.entries(weaponCounts)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10 weapons

    // Count armor pieces used
    const armorCounts: Record<string, number> = {};
    builds.forEach((build) => {
      if (build.equipment.head) {
        const head = build.equipment.head.name;
        armorCounts[head] = (armorCounts[head] || 0) + 1;
      }
      if (build.equipment.chest) {
        const chest = build.equipment.chest.name;
        armorCounts[chest] = (armorCounts[chest] || 0) + 1;
      }
      if (build.equipment.shoes) {
        const shoes = build.equipment.shoes.name;
        armorCounts[shoes] = (armorCounts[shoes] || 0) + 1;
      }
    });

    // Format for charts and sort by count
    const armorData = Object.entries(armorCounts)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10 armor pieces

    return {
      activityData,
      weaponData,
      armorData,
      totalBuilds: builds.length,
      metaBuilds: builds.filter((build) => build.isMeta).length,
    };
  };

  const stats = generateStats();

  // Colors for charts
  const COLORS = ["#D4AF37", "#5865F2", "#3BA55C", "#ED4245", "#9B59B6", "#3498DB", "#E67E22", "#1ABC9C"];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top Navigation */}
      <header className="bg-[#2F3136] shadow-sm z-10">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center">
            <ChartBarStacked className="h-5 w-5 mr-2" />
            <h1 className="text-xl font-bold">Statistics</h1>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto fancy-scrollbar bg-[#36393F] p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
          </div>
        ) : !stats ? (
          <div className="text-center py-10">
            <Info className="h-12 w-12 text-[#B9BBBE] mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Data Available</h2>
            <p className="text-[#B9BBBE]">
              Create some builds to see statistics here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-[#2F3136] border-[#202225]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#B9BBBE] text-sm">Total Builds</p>
                      <h3 className="text-3xl font-bold">{stats.totalBuilds}</h3>
                    </div>
                    <div className="h-12 w-12 bg-[#36393F] rounded-lg flex items-center justify-center text-[#D4AF37]">
                      <Package className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#2F3136] border-[#202225]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#B9BBBE] text-sm">Meta Builds</p>
                      <h3 className="text-3xl font-bold">{stats.metaBuilds}</h3>
                    </div>
                    <div className="h-12 w-12 bg-[#36393F] rounded-lg flex items-center justify-center text-[#5865F2]">
                      <Activity className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#2F3136] border-[#202225]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#B9BBBE] text-sm">Solo Builds</p>
                      <h3 className="text-3xl font-bold">
                        {stats.activityData.find((d) => d.name === "Solo PvP")?.value || 0}
                      </h3>
                    </div>
                    <div className="h-12 w-12 bg-[#36393F] rounded-lg flex items-center justify-center text-[#ED4245]">
                      <Swords className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#2F3136] border-[#202225]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#B9BBBE] text-sm">Group Builds</p>
                      <h3 className="text-3xl font-bold">
                        {stats.activityData.find((d) => d.name === "Group PvP")?.value || 0}
                      </h3>
                    </div>
                    <div className="h-12 w-12 bg-[#36393F] rounded-lg flex items-center justify-center text-[#3BA55C]">
                      <Users className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Statistics */}
            <Tabs defaultValue="activity">
              <TabsList className="mb-4">
                <TabsTrigger value="activity">By Activity</TabsTrigger>
                <TabsTrigger value="equipment">By Equipment</TabsTrigger>
              </TabsList>

              <TabsContent value="activity">
                <Card className="bg-[#2F3136] border-[#202225]">
                  <CardHeader>
                    <CardTitle>Builds by Activity Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stats.activityData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          >
                            {stats.activityData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-2">
                      <h4 className="font-medium">Distribution</h4>
                      <div className="space-y-1">
                        {stats.activityData.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              ></div>
                              <span className="text-sm">{item.name}</span>
                            </div>
                            <span className="text-sm font-medium">{item.value} builds</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="equipment">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-[#2F3136] border-[#202225]">
                    <CardHeader>
                      <CardTitle>Top Weapons</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart
                            data={stats.weaponData}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={100} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#D4AF37" />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#2F3136] border-[#202225]">
                    <CardHeader>
                      <CardTitle>Top Armor Pieces</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart
                            data={stats.armorData}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={100} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#5865F2" />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
    </div>
  );
}
