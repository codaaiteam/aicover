// app/not-found.tsx
'use client';
import React from "react";
import { useLanguage } from "@/contexts/language";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <p className="mt-4">{t["notFound"]}</p>
      </div>
    </div>
  );
}