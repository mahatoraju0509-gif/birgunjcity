"use client";

import { useEffect } from "react";
import { incrementViews } from "@/lib/articles";

export default function ViewTracker({ id, currentViews }: { id: string; currentViews: number }) {
  useEffect(() => {
    incrementViews(id, currentViews).catch(() => {});
  }, [id, currentViews]);

  return null;
}