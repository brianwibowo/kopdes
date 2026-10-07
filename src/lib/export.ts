export type CsvValue = string | number | boolean | null | undefined;
export function toCsv(rows: CsvValue[][]): string {
  return (
    "\uFEFF" +
    rows
      .map((row) =>
        row
          .map((value) => {
            let text = value == null ? "" : String(value);
            // Keep exported text as text when opened in a spreadsheet.
            if (typeof value === "string" && /^[=+\-@\t\r]/.test(text))
              text = "'" + text;
            return `"${text.replace(/"/g, '""')}"`;
          })
          .join(","),
      )
      .join("\r\n")
  );
}
export function downloadFile(content: string, filename: string, mime: string) {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function downloadCsv(rows: CsvValue[][], filename: string) {
  downloadFile(toCsv(rows), filename, "text/csv;charset=utf-8");
}
