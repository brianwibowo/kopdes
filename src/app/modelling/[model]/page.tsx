import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ModellingWorkspace } from "@/features/modelling/Workspace";
import { MODEL_TABS } from "@/features/modelling/model";
export default async function ModelPage({
  params,
}: {
  params: Promise<{ model: string }>;
}) {
  const { model } = await params;
  const tab = MODEL_TABS.find((t) => t.id === model);
  if (!tab) notFound();
  return (
    <Suspense
      fallback={<div className="p-12 text-center">Menyiapkan model…</div>}
    >
      <ModellingWorkspace view={tab.id} />
    </Suspense>
  );
}
