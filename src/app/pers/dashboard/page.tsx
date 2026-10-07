import { Suspense } from "react";
import { ModellingWorkspace } from "@/features/modelling/Workspace";
export default function DashboardPage() {
  return (
    <Suspense
      fallback={<div className="p-12 text-center">Menyiapkan statistik…</div>}
    >
      <ModellingWorkspace />
    </Suspense>
  );
}
