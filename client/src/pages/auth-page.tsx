import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { FormEventHandler, useState } from "react";
import { Redirect } from "wouter";

export default function AuthPage() {
  const { user, isLoading, loginMutation, registerMutation } = useAuth();
  
  // Redirect to home if the user is already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="flex h-screen">
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <Tabs defaultValue="login" className="w-full max-w-md">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LoginForm isLoading={loginMutation.isPending} onSubmit={(data) => loginMutation.mutate(data)} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Register to manage your Albion Online builds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RegisterForm isLoading={registerMutation.isPending} onSubmit={(data) => registerMutation.mutate(data)} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="hidden md:block md:w-1/2 bg-gray-800 text-white p-12 flex flex-col justify-center">
        <div className="max-w-lg">
          <h1 className="text-3xl font-bold mb-4">Albion Online Build Manager</h1>
          <p className="text-lg mb-6">
            Create, manage, and share your Albion Online builds with your Discord community.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="mr-2">✓</span> 
              <span>Manage equipment builds for different activities</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span> 
              <span>Share builds via Discord with beautiful formatting</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span> 
              <span>Track meta builds and alternatives</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span> 
              <span>Organize builds by activity type and tags</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

interface LoginFormProps {
  isLoading: boolean;
  onSubmit: (data: { username: string; password: string }) => void;
}

function LoginForm({ isLoading, onSubmit }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onSubmit({ username, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Logging in...
          </>
        ) : (
          "Login"
        )}
      </Button>
    </form>
  );
}

interface RegisterFormProps {
  isLoading: boolean;
  onSubmit: (data: { username: string; password: string }) => void;
}

function RegisterForm({ isLoading, onSubmit }: RegisterFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setError("");
    onSubmit({ username, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="register-username">Username</Label>
        <Input
          id="register-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Choose a username"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-password">Password</Label>
        <Input
          id="register-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Choose a password"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
          required
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
}