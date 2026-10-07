import { redirect } from "next/navigation";
import { optionsQuery, parseOptions } from "@/features/modelling/model";
export default async function ModellingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  redirect(
    `/modelling/supply-chain?${optionsQuery(parseOptions(await searchParams))}`,
  );
}
