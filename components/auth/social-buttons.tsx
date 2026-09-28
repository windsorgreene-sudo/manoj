"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { GithubIcon, GoogleIcon } from "@/components/ui/brand-icons";
import { authClient } from "@/lib/auth-client";

/** Rendered only for providers whose keys are configured (hidden otherwise). */
export function SocialButtons({ google, github, next }: { google: boolean; github: boolean; next: string }) {
  const [loading, setLoading] = useState<"google" | "github" | null>(null);
  if (!google && !github) return null;

  const go = async (provider: "google" | "github") => {
    setLoading(provider);
    const { error } = await authClient.signIn.social({ provider, callbackURL: next });
    if (error) {
      toast.error(error.message ?? "Could not start social login");
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-2">
        {google ? (
          <Button type="button" variant="outline" className="h-11 rounded-xl" onClick={() => go("google")} disabled={loading !== null}>
            {loading === "google" ? <Loader2 className="animate-spin" /> : <GoogleIcon className="size-4" />} Google
          </Button>
        ) : null}
        {github ? (
          <Button type="button" variant="outline" className="h-11 rounded-xl" onClick={() => go("github")} disabled={loading !== null}>
            {loading === "github" ? <Loader2 className="animate-spin" /> : <GithubIcon className="size-4" />} GitHub
          </Button>
        ) : null}
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> or continue with email <span className="h-px flex-1 bg-border" />
      </div>
    </div>
  );
}
