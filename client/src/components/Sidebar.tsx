import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { LayoutDashboard, TrendingUp, Bell, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const [location] = useLocation();
  const { logout, user } = useAuth();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/stocks", label: "Stocks", icon: TrendingUp },
    { href: "/alerts", label: "Alerts", icon: Bell },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-card border-r border-border/50">
      <div className="p-6 border-b border-border/50">
        <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
          CandleAlert
        </h1>
        <p className="text-xs text-muted-foreground mt-1">Smart Stock Signals</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "nav-item cursor-pointer group",
                  isActive ? "active" : ""
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50 bg-black/20">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
            {user?.firstName?.[0] || user?.email?.[0] || "U"}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.firstName || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 border-white/5"
          onClick={() => logout()}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const { logout } = useAuth();
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border/50 z-50 flex items-center justify-around px-2">
      <Link href="/">
        <div className="p-2 text-muted-foreground hover:text-primary">
          <LayoutDashboard className="w-6 h-6" />
        </div>
      </Link>
      <Link href="/stocks">
        <div className="p-2 text-muted-foreground hover:text-primary">
          <TrendingUp className="w-6 h-6" />
        </div>
      </Link>
      <Link href="/alerts">
        <div className="p-2 text-muted-foreground hover:text-primary">
          <Bell className="w-6 h-6" />
        </div>
      </Link>
      <Link href="/settings">
        <div className="p-2 text-muted-foreground hover:text-primary">
          <Settings className="w-6 h-6" />
        </div>
      </Link>
      <button onClick={() => logout()} className="p-2 text-muted-foreground hover:text-destructive">
        <LogOut className="w-6 h-6" />
      </button>
    </nav>
  );
}
