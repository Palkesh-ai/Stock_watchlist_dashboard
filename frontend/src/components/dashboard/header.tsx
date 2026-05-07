"use client";

import { LogOut } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function DashboardHeader() {
  const { user, logout, isLogoutLoading } = useAuth();
  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4">
          <div className="text-right text-sm">
            <p className="font-medium">{user?.name}</p>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
          <Button variant="outline" disabled={isLogoutLoading} onClick={() => void logout()}>
            <LogOut className="mr-2 h-4 w-4" />
            {isLogoutLoading ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </header>
  );
}
