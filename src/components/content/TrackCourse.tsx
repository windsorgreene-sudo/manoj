"use client";

import { useEffect } from "react";
import { recordCourseView } from "@/lib/learning";

// Records that a course was viewed, for the dashboard "continue learning" list.
export function TrackCourse({
  slug,
  title,
  icon,
  color,
}: {
  slug: string;
  title: string;
  icon: string;
  color: string;
}) {
  useEffect(() => {
    recordCourseView({ slug, title, icon, color });
  }, [slug, title, icon, color]);
  return null;
}
