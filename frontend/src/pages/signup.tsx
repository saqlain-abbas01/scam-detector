import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Shield,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  User,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

const PERKS = [
  "Unlimited scam analysis",
  "Full scan history saved",
  "Urdu language support",
  "Instant threat detection",
];

function StrengthBar({ password }: { password: string }) {
  const score = [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) =>
    r.test(password),
  ).length;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = [
    "bg-transparent",
    "bg-destructive",
    "bg-amber-500",
    "bg-blue-500",
    "bg-emerald-500",
  ];
  if (!password) return null;
  return (
    <div className="space-y-1 mt-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= score ? colors[score] : "bg-white/10"}`}
          />
        ))}
      </div>
      <p
        className={`text-xs ${score >= 3 ? "text-emerald-400" : score >= 2 ? "text-amber-400" : "text-destructive"}`}
      >
        {labels[score]} password
      </p>
    </div>
  );
}

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const { signup, isAuthLoading } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password || !confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError("");

    try {
      await signup(name.trim(), email.trim(), password);
      toast({
        title: "Account created",
        description: "Welcome to ScamDetector.",
      });
      navigate("/");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Signup failed. Please try again.";
      setError(message);
      toast({
        title: "Signup failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative z-10">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
        {/* Right — form (comes first on mobile via order) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="order-2 md:order-1"
        >
          {/* Mobile logo */}
          <div className="md:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-600 to-purple-600 shadow-lg shadow-pink-500/30 mb-3">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500">
              ScamDetector
            </h1>
          </div>

          <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
            <CardContent className="p-8">
              <div className="mb-6">
                <Badge
                  variant="outline"
                  className="bg-pink-500/10 text-pink-400 border-pink-500/30 px-3 py-1 rounded-full text-xs font-mono tracking-wide uppercase mb-3"
                >
                  Create Account
                </Badge>
                <h1 className="text-2xl font-extrabold">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                    Get started free
                  </span>
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Join thousands protected by ScamDetector
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-foreground/80"
                  >
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 bg-black/20 border-white/10 focus-visible:ring-pink-500/50 h-12"
                      autoComplete="name"
                    />
                  </div>
                </div>

                {/* Email */}
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
                      className="pl-10 bg-black/20 border-white/10 focus-visible:ring-pink-500/50 h-12"
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password */}
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
                      className="pl-10 pr-11 bg-black/20 border-white/10 focus-visible:ring-pink-500/50 h-12"
                      autoComplete="new-password"
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
                  <StrengthBar password={password} />
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="confirm"
                    className="text-sm font-medium text-foreground/80"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="confirm"
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className={`pl-10 pr-11 bg-black/20 border-white/10 focus-visible:ring-pink-500/50 h-12 ${
                        confirm && confirm !== password
                          ? "border-destructive/50"
                          : confirm && confirm === password
                            ? "border-emerald-500/50"
                            : ""
                      }`}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {confirm && confirm === password && (
                    <p className="text-xs text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Passwords match
                    </p>
                  )}
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
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl h-12 text-base font-medium shadow-lg hover:shadow-pink-500/25 transition-all duration-200 hover:scale-[1.02] mt-2"
                >
                  {isAuthLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Create Account
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>

                <div className="relative my-1">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs text-muted-foreground">
                    <span className="bg-card px-3">
                      Already have an account?
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/login")}
                  className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-foreground h-12 rounded-xl"
                >
                  Sign In
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Left — perks panel */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden md:flex flex-col gap-8 order-1 md:order-2"
        >
          <div>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-600 to-purple-600 shadow-2xl shadow-pink-500/40 mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight mb-3">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500">
                Everything You Need
              </span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Create a free account and unlock the full power of AI scam
              detection.
            </p>
          </div>

          <div className="space-y-3">
            {PERKS.map((perk, i) => (
              <motion.div
                key={perk}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
                <span className="font-medium text-foreground/80">{perk}</span>
              </motion.div>
            ))}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "10K+", label: "Users" },
              { value: "99%", label: "Accuracy" },
              { value: "Free", label: "Forever" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-3 text-center"
              >
                <div className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
