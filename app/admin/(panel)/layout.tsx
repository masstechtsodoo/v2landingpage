import { Sidebar } from "@/components/admin/sidebar";
import { Toaster } from "@/components/admin/ui";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100svh] flex-col lg:flex-row">
      <Sidebar />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8 lg:px-10">
        <div className="mx-auto max-w-[80rem]">{children}</div>
      </main>
      <Toaster />
    </div>
  );
}
