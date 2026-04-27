import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, ArrowRight, Eye, EyeOff, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

const FEATURES = [
  { icon: "🛡️", label: "AI-Powered Detection" },
  { icon: "🔐", label: "Secure & Private" },
  { icon: "⚡", label: "Instant Results" },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, isAuthLoading } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");

    try {
      await login(email.trim(), password);
      toast({
        title: "Login successful",
        description: "Welcome back to ScamDetector.",
      });
      navigate("/");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(message);
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative z-10">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left — branding panel */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden md:flex flex-col gap-8"
        >
          <div>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-2xl shadow-purple-500/40 mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight mb-3">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-500 to-pink-500">
                Stay Protected
              </span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              AI-powered scam detection that keeps you safe from fraud,
              phishing, and suspicious messages.
            </p>
          </div>

          <div className="space-y-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
              >
                <span className="text-2xl">{f.icon}</span>
                <span className="font-medium text-foreground/80">
                  {f.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Decorative glow orbs */}
          <div className="relative h-24 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-pink-900/30 border border-white/5 flex items-center justify-center gap-2 px-4">
            <Zap className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-muted-foreground font-mono">
              Powered by Advanced AI Models
            </span>
          </div>
        </motion.div>

        {/* Right — form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Mobile logo */}
          <div className="md:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg shadow-purple-500/30 mb-3">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-500 to-pink-500">
              ScamDetector
            </h1>
          </div>

          <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
            <CardContent className="p-8">
              <div className="mb-6">
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/30 px-3 py-1 rounded-full text-xs font-mono tracking-wide uppercase mb-3"
                >
                  Secure Login
                </Badge>
                <h1 className="text-2xl font-extrabold">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                    Welcome back
                  </span>
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Sign in to your account to continue
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-foreground/80"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-black/20 border-white/10 focus-visible:ring-purple-500/50 h-12"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-foreground/80"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-11 bg-black/20 border-white/10 focus-visible:ring-purple-500/50 h-12"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-destructive text-sm bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2"
                  >
                    {error}
                  </motion.p>
                )}

                <Button
                  type="submit"
                  disabled={isAuthLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl h-12 text-base font-medium shadow-lg hover:shadow-purple-500/25 transition-all duration-200 hover:scale-[1.02]"
                >
                  {isAuthLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Sign In
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>

                <div className="relative my-1">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs text-muted-foreground">
                    <span className="bg-card px-3">Don't have an account?</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/signup")}
                  className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-foreground h-12 rounded-xl"
                >
                  Create Account
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
