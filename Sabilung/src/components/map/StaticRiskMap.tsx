import { useEffect, useMemo, useState } from "react";
import { GeoJSON, MapContainer } from "react-leaflet";
import type { Feature, FeatureCollection } from "geojson";
import type { CrimeRiskRecord, RiskCategory } from "../../types";
import { BlurFade } from "../common/BlurFade";
import { geoJSON } from "leaflet";

const categoryPalette: Record<RiskCategory, string> = {
  AMAN: "#22c55e",
  RENDAH: "#0ea5e9",
  SEDANG: "#f97316",
  TINGGI: "#ef4444",
};

interface StaticRiskMapProps {
  records?: CrimeRiskRecord[];
  title?: string;
}

const normalizeKey = (kecamatan?: string, kelurahan?: string) =>
  `${(kecamatan ?? "").toLowerCase()}|${(kelurahan ?? "").toLowerCase()}`;

export const StaticRiskMap = ({ records, title }: StaticRiskMapProps) => {
  const [features, setFeatures] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    fetch("/maps/kab_bandung_desa.geojson")
      .then((res) => res.json())
      .then((json) => setFeatures(json))
      .catch(() => setFeatures(null));
  }, []);

  const lookup = useMemo(() => {
    const map = new Map<string, CrimeRiskRecord>();
    (records ?? []).forEach((record) => {
      map.set(normalizeKey(record.kecamatan, record.kelurahan), record);
    });
    return map;
  }, [records]);

  const styleFeature = (feature: Feature) => {
    const kec = (feature?.properties as Record<string, string>)?.WADMKC || (feature?.properties as Record<string, string>)?.WADMKD;
    const desa = (feature?.properties as Record<string, string>)?.WADMKD || (feature?.properties as Record<string, string>)?.NAMOBJ;
    const match = lookup.get(normalizeKey(kec, desa));
    const color = match ? categoryPalette[match.kategoriRisiko] : "#cbd5f5";
    return {
      fillColor: color,
      weight: 0.3,
      color: "#0f172a22",
      fillOpacity: 0.85,
    };
  };

  const bounds = useMemo(() => {
    if (!features) return undefined;
    try {
      return geoJSON(features as any).getBounds();
    } catch {
      return undefined;
    }
  }, [features]);

  return (
    <div className="rounded-4xl border border-slate-200/70 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-slate-900/70">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">Choropleth</p>
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">{title ?? "Peta hasil analisis notebook"}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-300">Menampilkan intensitas risiko hingga level desa berdasarkan hasil mining CSV.</p>
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-300">
          {Object.entries(categoryPalette).map(([key, value]) => (
            <span key={key} className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: value }} />
              {key}
            </span>
          ))}
        </div>
      </div>
      <BlurFade loading={!features} className="mt-4">
        {features ? (
          <MapContainer
            center={[-7.05, 107.6]}
            zoom={9}
            bounds={bounds}
            zoomControl={false}
            doubleClickZoom={false}
            dragging={false}
            scrollWheelZoom={false}
            attributionControl={false}
            className="h-[260px] w-full rounded-3xl bg-slate-100 dark:bg-slate-900"
          >
            <GeoJSON data={features as any} style={styleFeature as any} />
          </MapContainer>
        ) : (
          <div className="flex h-[420px] items-center justify-center rounded-3xl border border-dashed border-slate-200 text-slate-500">
            GeoJSON tidak ditemukan.
          </div>
        )}
      </BlurFade>
    </div>
  );
};
