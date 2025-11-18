import { useMemo, useState } from "react";
import type { CrimeRiskRecord } from "../../types";
import clsx from "clsx";

const CASE_FIELDS = [
  { key: "total", label: "Total Indikator" },
  { key: "adaPencurian", label: "Pencurian" },
  { key: "adaPenipuan", label: "Penipuan" },
  { key: "adaPenganiayaan", label: "Penganiayaan" },
  { key: "adaNarkoba", label: "Narkoba" },
  { key: "adaPerjudian", label: "Perjudian" },
  { key: "adaPembunuhan", label: "Pembunuhan" },
];

interface CaseExplorerProps {
  records?: CrimeRiskRecord[];
  title?: string;
  description?: string;
  limit?: number;
}

interface CaseAggregate {
  kecamatan: string;
  kelurahanCount: number;
  total: number;
  adaPencurian: number;
  adaPenipuan: number;
  adaPenganiayaan: number;
  adaPembakaran: number;
  adaPerkosaan: number;
  adaNarkoba: number;
  adaPerjudian: number;
  adaPembunuhan: number;
  adaPerdaganganManusia: number;
}

const buildAggregate = (records: CrimeRiskRecord[]): CaseAggregate[] => {
  const grouped: Record<string, CaseAggregate> = {};
  records.forEach((record) => {
    if (!grouped[record.kecamatan]) {
      grouped[record.kecamatan] = {
        kecamatan: record.kecamatan,
        kelurahanCount: 0,
        total: 0,
        adaPencurian: 0,
        adaPenipuan: 0,
        adaPenganiayaan: 0,
        adaPembakaran: 0,
        adaPerkosaan: 0,
        adaNarkoba: 0,
        adaPerjudian: 0,
        adaPembunuhan: 0,
        adaPerdaganganManusia: 0,
      };
    }
    const bucket = grouped[record.kecamatan];
    bucket.kelurahanCount += 1;
    bucket.total += record.jumlahJenisAktif;
    bucket.adaPencurian += record.adaPencurian;
    bucket.adaPenipuan += record.adaPenipuan;
    bucket.adaPenganiayaan += record.adaPenganiayaan;
    bucket.adaPembakaran += record.adaPembakaran;
    bucket.adaPerkosaan += record.adaPerkosaan;
    bucket.adaNarkoba += record.adaNarkoba;
    bucket.adaPerjudian += record.adaPerjudian;
    bucket.adaPembunuhan += record.adaPembunuhan;
    bucket.adaPerdaganganManusia += record.adaPerdaganganManusia;
  });
  return Object.values(grouped);
};

export const CaseExplorer = ({ records, title, description, limit }: CaseExplorerProps) => {
  const [selectedCase, setSelectedCase] = useState<string>(CASE_FIELDS[0].key);

  const aggregates = useMemo(() => (records ? buildAggregate(records) : []), [records]);
  const sorted = useMemo(() => {
    const arr = aggregates.slice();
    return arr.sort((a, b) => (b as any)[selectedCase] - (a as any)[selectedCase]);
  }, [aggregates, selectedCase]);

  const display = limit ? sorted.slice(0, limit) : sorted;

  return (
    <div className="rounded-4xl border border-slate-200/70 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">Seluruh laporan</p>
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">{title ?? "Detail kasus per kecamatan"}</h3>
          {description && <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          {CASE_FIELDS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setSelectedCase(item.key)}
              className={clsx(
                "rounded-full border px-3 py-1 text-xs font-semibold transition",
                selectedCase === item.key
                  ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/20 dark:text-white"
                  : "border-slate-200 text-slate-500 hover:border-brand-200 hover:text-brand-600 dark:border-white/10 dark:text-slate-300"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm text-slate-600 dark:text-slate-200">
          <thead className="text-xs uppercase tracking-widest text-slate-400">
            <tr>
              <th className="pb-2">Kecamatan</th>
              <th>Kelurahan</th>
              <th>{CASE_FIELDS.find((c) => c.key === selectedCase)?.label}</th>
              <th>Total Indikator</th>
            </tr>
          </thead>
          <tbody>
            {display.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-slate-400">
                  Data belum tersedia.
                </td>
              </tr>
            ) : (
              display.map((item) => (
                <tr key={item.kecamatan} className="border-t border-slate-100 dark:border-white/5">
                  <td className="py-3 text-slate-900 dark:text-white">{item.kecamatan}</td>
                  <td>{item.kelurahanCount}</td>
                  <td>{(item as any)[selectedCase]}</td>
                  <td>{item.total}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
