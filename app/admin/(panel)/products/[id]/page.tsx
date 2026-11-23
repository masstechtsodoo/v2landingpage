"use client";

import { use } from "react";
import { ProductEditor } from "@/components/admin/product-editor";

export default function ProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ProductEditor key={id} id={id === "new" ? undefined : Number(id)} />;
}
