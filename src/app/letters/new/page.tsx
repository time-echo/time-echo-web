"use client";

import React from "react";
import { LetterComposerForm } from "@/features/capsules";

export default function NewLetterPage() {
  return (
    <div className="max-w-7xl mx-auto py-4 font-ui animate-fade-in text-foreground">
      <LetterComposerForm />
    </div>
  );
}
