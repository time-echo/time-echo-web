"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { LetterComposerForm } from "@/features/capsules";

export default function NewLetterPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthLoading, isAuthenticated, router]);

  return (
    <div className="max-w-7xl mx-auto py-4 font-ui animate-fade-in text-foreground">
      <LetterComposerForm />
    </div>
  );
}
