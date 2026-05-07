"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthRedirectGuard } from "@/components/shared/auth-redirect-guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { LoginSchema, loginSchema } from "@/schemas/auth-schema";

export default function LoginPage() {
  const { login, isLoginLoading } = useAuth();
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await login(values);
  });

  return (
    <AuthRedirectGuard>
      <main className="flex min-h-screen items-center justify-center p-4">
        <AuthCard title="Welcome Back" description="Login to manage your watchlist and portfolio.">
          <form className="space-y-4" onSubmit={(e) => void onSubmit(e)}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...form.register("email")} />
              {form.formState.errors.email ? (
                <p className="text-xs text-red-600">{form.formState.errors.email.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...form.register("password")} />
              {form.formState.errors.password ? (
                <p className="text-xs text-red-600">{form.formState.errors.password.message}</p>
              ) : null}
            </div>
            <Button className="w-full" disabled={isLoginLoading} type="submit">
              {isLoginLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <p className="mt-4 text-sm text-muted-foreground">
            No account? <Link className="font-medium text-primary" href="/signup">Create one</Link>
          </p>
        </AuthCard>
      </main>
    </AuthRedirectGuard>
  );
}
