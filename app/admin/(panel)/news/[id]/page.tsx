"use client";

import { use } from "react";
import { ProjectEditor } from "@/components/admin/project-editor";

export default function ProjectEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ProjectEditor key={id} id={id === "new" ? undefined : Number(id)} />;
}
