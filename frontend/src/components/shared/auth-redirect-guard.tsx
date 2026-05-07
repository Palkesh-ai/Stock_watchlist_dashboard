"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Skeleton } from "@/components/ui/skeleton";

export function AuthRedirectGuard({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && token) router.replace("/dashboard");
  }, [isHydrated, token, router]);

  if (!isHydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md space-y-3">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-40 w-full" />
        </div>
      </main>
    );
  }

  if (token) return null;
  return <>{children}</>;
}
