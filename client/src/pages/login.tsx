import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

export default function LoginPage() {
  const { user, loginMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // Redirect to home if already logged in
  if (user) {
    setLocation("/");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(formData, {
      onSuccess: () => {
        setLocation("/");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#36393F] p-4">
      <Card className="w-full max-w-md bg-[#2F3136] border-[#202225]">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37] flex items-center justify-center text-black font-bold text-2xl">
              AO
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Albion Online Bot</CardTitle>
          <CardDescription className="text-center">
            Admin Dashboard Login
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
                className="bg-[#40444B] border-[#202225]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-[#40444B] border-[#202225]"
              />
            </div>
            <div className="text-sm text-[#B9BBBE] flex items-center">
              <Shield className="h-4 w-4 mr-1" />
              Default credentials: admin / admin
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
