import { redirect } from "next/navigation";
import { optionsQuery, parseOptions } from "@/features/modelling/model";
export default async function PetaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  redirect(`/modelling/peta?${optionsQuery(parseOptions(await searchParams))}`);
}
