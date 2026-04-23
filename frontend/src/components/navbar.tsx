import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Home, History, LogOut, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth-context";

function NavLink({
  href,
  active,
  children,
  onClick,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link href={href}>
      <button
        onClick={onClick}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
          active
            ? "bg-primary/15 text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
        }`}
      >
        {children}
      </button>
    </Link>
  );
}

export function Navbar() {
  const { user, logout } = useAuth();
  const [location, navigate] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/10 bg-background/80 backdrop-blur-md">
        <nav className="max-w-6xl mx-auto h-full flex items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2.5 cursor-pointer select-none">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-md shadow-purple-500/30 flex-shrink-0">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 text-lg hidden sm:block">
                ScamDetector
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/" active={location === "/"}>
              <Home className="w-4 h-4" />
              Home
            </NavLink>
            <NavLink href="/history" active={location === "/history"}>
              <History className="w-4 h-4" />
              History
            </NavLink>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full pl-1.5 pr-3 py-1.5 cursor-pointer hover:bg-white/10 transition-colors outline-none">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {initials}
                    </div>
                    <span className="text-sm text-foreground/80 hidden sm:block max-w-[120px] truncate">
                      {user.name}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-44 bg-card/90 backdrop-blur-md border-white/10"
                >
                  <div className="px-3 py-2">
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    className="cursor-pointer text-muted-foreground hover:text-foreground focus:text-foreground"
                    onClick={() => navigate("/history")}
                  >
                    <History className="w-4 h-4 mr-2" />
                    History
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={logout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                size="sm"
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg shadow-md shadow-purple-500/20 hover:shadow-purple-500/30 transition-all"
              >
                <User className="w-3.5 h-3.5 mr-1.5" />
                Sign In
              </Button>
            )}

            {/* Mobile burger */}
            <button
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="fixed top-16 left-0 right-0 z-40 border-b border-white/10 bg-background/95 backdrop-blur-md md:hidden"
          >
            <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
              <NavLink
                href="/"
                active={location === "/"}
                onClick={() => setMobileOpen(false)}
              >
                <Home className="w-4 h-4" />
                Home
              </NavLink>
              <NavLink
                href="/history"
                active={location === "/history"}
                onClick={() => setMobileOpen(false)}
              >
                <History className="w-4 h-4" />
                History
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
