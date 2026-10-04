import { redirect } from "next/navigation";

export default async function KoperasiDetailRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/pers/dashboard/village/${id}`);
}
