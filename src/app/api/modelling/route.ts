import {
  buildModel,
  modelDataset,
  parseOptions,
} from "@/features/modelling/model";
import { modelCsv, supplySvg } from "@/features/modelling/exports";
export function GET(request: Request) {
  const url = new URL(request.url);
  const result = buildModel(parseOptions(Object.fromEntries(url.searchParams)));
  if (!result.validRange)
    return Response.json(
      { error: "Bulan awal harus sebelum atau sama dengan bulan akhir." },
      { status: 400 },
    );
  const format = url.searchParams.get("format") || "json";
  if (!["json", "csv", "svg"].includes(format))
    return Response.json(
      { error: "Format tersedia: json, csv, svg." },
      { status: 400 },
    );
  const headers = {
    "Cache-Control": "no-store",
    "Content-Disposition": `attachment; filename="kopdes-demo.${format}"`,
  };
  if (format === "csv")
    return new Response(modelCsv(result), {
      headers: { ...headers, "Content-Type": "text/csv;charset=utf-8" },
    });
  if (format === "svg")
    return new Response(supplySvg(result), {
      headers: { ...headers, "Content-Type": "image/svg+xml" },
    });
  return Response.json(modelDataset(result), { headers });
}
