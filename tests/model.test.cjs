const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const fromBuild = (file) =>
  require(path.join(process.env.KOPDES_TEST_DIR, file));
const {
  buildModel,
  DEFAULT_OPTIONS,
  parseOptions,
  optionsQuery,
  modelDataset,
} = fromBuild("features/modelling/model.js");
const { modelCsv, supplySvg } = fromBuild("features/modelling/exports.js");
const { MOCK_KOPERASI, PROVINSI_LIST } = fromBuild("lib/mockData.js");
const { toCsv } = fromBuild("lib/export.js");
const base = buildModel(DEFAULT_OPTIONS);
const sum = (rows, key) => rows.reduce((acc, row) => acc + row[key], 0);

test("every annual demo total reconciles with the original cooperative dataset", () => {
  assert.equal(base.records.length, MOCK_KOPERASI.length * 12);
  for (const row of base.cooperativeRows) {
    assert.equal(row.revenue, row.cooperative.volumeUsaha);
    assert.equal(row.profit, row.cooperative.totalShu);
    assert.equal(row.goods + row.logistics + row.operating, row.expenses);
    assert.equal(row.revenue - row.expenses, row.profit);
    assert.equal(row.closingCash - row.openingCash, row.profit);
  }
  assert.equal(base.totals.revenue, sum(MOCK_KOPERASI, "volumeUsaha"));
  assert.equal(base.totals.profit, sum(MOCK_KOPERASI, "totalShu"));
});
test("province partitions sum back to the national results", () => {
  const scoped = PROVINSI_LIST.map((p) =>
    buildModel({ ...DEFAULT_OPTIONS, province: p.id }),
  );
  for (const key of [
    "revenue",
    "profit",
    "expenses",
    "cooperativeCount",
    "members",
    "openingCash",
    "closingCash",
  ]) {
    assert.equal(
      scoped.reduce((n, r) => n + r.totals[key], 0),
      base.totals[key],
    );
  }
});
test("region, cooperative, and date filters intersect", () => {
  const k = MOCK_KOPERASI[0];
  const scoped = buildModel({
    ...DEFAULT_OPTIONS,
    province: k.provinsiId,
    cooperative: k.id,
    from: "2026-02",
    to: "2026-04",
  });
  assert.equal(scoped.records.length, 3);
  assert.equal(scoped.totals.cooperativeCount, 1);
  assert.deepEqual(
    scoped.records.map((r) => r.month),
    ["2026-02", "2026-03", "2026-04"],
  );
  assert.ok(scoped.records.every((r) => r.cooperativeId === k.id));
  const other = PROVINSI_LIST.find((p) => p.id !== k.provinsiId);
  assert.equal(
    buildModel({ ...DEFAULT_OPTIONS, province: other.id, cooperative: k.id })
      .records.length,
    0,
  );
});
test("selected period preserves prior cash and does not sum balances across months", () => {
  const full = buildModel({ ...DEFAULT_OPTIONS, lag: 1, price: 10, cost: 5 });
  const partial = buildModel({
    ...full.options,
    from: "2026-03",
    to: "2026-06",
  });
  assert.equal(partial.totals.openingCash, full.trend[1].closingCash);
  assert.equal(partial.totals.closingCash, full.trend[5].closingCash);
  assert.equal(
    partial.totals.closingCash,
    partial.totals.openingCash + partial.totals.cashIn - partial.totals.cashOut,
  );
});
test("a price scenario changes revenue and profit but leaves cost unchanged", () => {
  const scenario = buildModel({ ...DEFAULT_OPTIONS, price: 10 });
  assert.equal(scenario.totals.expenses, base.totals.expenses);
  assert.ok(
    Math.abs(scenario.totals.revenue - base.totals.revenue * 1.1) <=
      scenario.records.length / 2,
  );
  assert.equal(
    scenario.totals.profit - base.totals.profit,
    scenario.totals.revenue - base.totals.revenue,
  );
});
test("cost pressure can produce losses and negative cash without clamping them away", () => {
  const scenario = buildModel({ ...DEFAULT_OPTIONS, price: -50, cost: 50 });
  assert.ok(scenario.totals.profit < 0);
  assert.ok(scenario.totals.closingCash < 0);
  assert.equal(
    scenario.totals.profit,
    scenario.totals.revenue - scenario.totals.expenses,
  );
});
test("receipt lag affects cash timing but not accrued profit", () => {
  const delayed = buildModel({ ...DEFAULT_OPTIONS, lag: 2 });
  assert.equal(delayed.totals.profit, base.totals.profit);
  assert.equal(delayed.trend[0].cashIn, 0);
  assert.equal(delayed.trend[1].cashIn, 0);
  assert.equal(delayed.trend[2].cashIn, base.trend[0].revenue);
  assert.equal(
    delayed.totals.cashIn,
    base.totals.revenue - base.trend[10].revenue - base.trend[11].revenue,
  );
});
test("invalid ranges, absent regions, and years without data produce explicit empty results", () => {
  assert.equal(
    buildModel({ ...DEFAULT_OPTIONS, from: "2026-12", to: "2026-01" })
      .validRange,
    false,
  );
  for (const opts of [
    { from: "2027-01", to: "2027-12" },
    { province: "unknown" },
    { cooperative: "unknown" },
    { from: "2026-12", to: "2026-01" },
  ]) {
    const result = buildModel({ ...DEFAULT_OPTIONS, ...opts });
    assert.equal(result.records.length, 0);
    assert.equal(result.totals.cooperativeCount, 0);
    assert.equal(result.totals.revenue, 0);
  }
});
test("URL options validate numbers, bound scenarios and round trip", () => {
  const parsed = parseOptions({
    price: "500",
    cost: "-90",
    lag: "NaN",
    from: "2026-13",
    to: ["2026-06", "2026-07"],
  });
  assert.equal(parsed.price, 50);
  assert.equal(parsed.cost, -30);
  assert.equal(parsed.lag, 0);
  assert.equal(parsed.from, DEFAULT_OPTIONS.from);
  assert.equal(parsed.to, "2026-06");
  assert.deepEqual(
    parseOptions(Object.fromEntries(new URLSearchParams(optionsQuery(parsed)))),
    parsed,
  );
});
test("CSV contains every selected cooperative-month and the exact scenario values", () => {
  const result = buildModel({
    ...DEFAULT_OPTIONS,
    cooperative: MOCK_KOPERASI[0].id,
    from: "2026-03",
    to: "2026-04",
    price: 12,
    lag: 1,
  });
  const lines = modelCsv(result).slice(1).split("\r\n");
  assert.equal(lines.length, 3);
  assert.ok(lines[0].includes('"kas_akhir_idr"'));
  for (const [index, r] of result.records.entries()) {
    assert.ok(lines[index + 1].includes(`"${r.month}"`));
    assert.ok(lines[index + 1].includes(`"${r.revenue}"`));
    assert.ok(lines[index + 1].includes(`"${r.closingCash}"`));
    assert.ok(lines[index + 1].endsWith('"12","0","1","2026-03","2026-04"'));
  }
});
test("CSV preserves commas, quotes and Unicode and neutralizes spreadsheet formulas in text", () => {
  assert.equal(
    toCsv([
      ["Nama", "Nilai"],
      ['Kopdes "Maju", É', 100],
      ["=1+1", -20],
    ]),
    '\uFEFF"Nama","Nilai"\r\n"Kopdes ""Maju"", É","100"\r\n"\'=1+1","-20"',
  );
});
test("JSON and SVG use the same filtered model and explicitly identify demo data", () => {
  const result = buildModel({
    ...DEFAULT_OPTIONS,
    province: "32",
    from: "2026-01",
    to: "2026-04",
    cost: 5,
  });
  const dataset = JSON.parse(JSON.stringify(modelDataset(result)));
  assert.equal(dataset.metadata.isDemo, true);
  assert.deepEqual(dataset.metadata.options, result.options);
  assert.deepEqual(dataset.totals, result.totals);
  assert.equal(dataset.monthlyRecords.length, result.records.length);
  assert.equal(dataset.supplyChain.length, result.cooperatives.length);
  assert.ok(dataset.supplyChain.every((edge) => edge.partnerLocation === null));
  const svg = supplySvg(result);
  assert.ok(svg.includes('xmlns="http://www.w3.org/2000/svg"'));
  assert.ok(svg.includes("DATA SIMULASI"));
  assert.ok(svg.includes(`${result.totals.cooperativeCount} koperasi`));
  assert.ok(svg.includes("biaya 5%"));
});
