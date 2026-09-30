"use client";

import React from "react";
import Link from "next/link";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";

export function ArchivalFooter() {
  const { locale } = useTimeEcho();
  const isEs = locale === "es";

  return (
    <footer className="p-8 bg-manila/50 border-t border-crease text-foreground-muted font-sans select-none">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between w-full gap-4 text-xs font-sans-ui">
        <div className="flex items-center gap-2">
          <span>
            &copy; 2026 TimeEcho.{" "}
            {isEs
              ? "Enviado con esperanza, recibido con nostalgia."
              : "Sent with hope, received with nostalgia."}
          </span>
        </div>
        <nav className="flex gap-4 items-center font-sans-ui">
          <Link href="/" className="hover:text-wax transition-colors">
            {isEs ? "Acerca de" : "About"}
          </Link>
          <Link href="/" className="hover:text-wax transition-colors">
            {isEs ? "Privacidad" : "Privacy"}
          </Link>
          <Link href="/" className="hover:text-wax transition-colors">
            {isEs ? "Términos" : "Terms"}
          </Link>
          <span className="font-serif-editorial italic text-foreground-muted/60 hidden sm:inline">
            {isEs
              ? "Una cápsula del tiempo digital para el alma."
              : "A digital time capsule for the soul."}
          </span>
        </nav>
      </div>
    </footer>
  );
}
