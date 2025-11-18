import { GeoJSON, MapContainer, TileLayer, Tooltip, CircleMarker } from "react-leaflet";
import type { Layer } from "leaflet";
import type { Feature } from "geojson";
import { bandungZones } from "../../data/bandungZones";
import type { MapZone, RiskCategory } from "../../types";
import { useTheme } from "../../context/ThemeContext";

const categoryColor: Record<RiskCategory, string> = {
  AMAN: "#10b981",
  RENDAH: "#38bdf8",
  SEDANG: "#f59e0b",
  TINGGI: "#f87171",
};

interface InteractiveRiskMapProps {
  zones: MapZone[];
}

export const InteractiveRiskMap = ({ zones }: InteractiveRiskMapProps) => {
  const { theme } = useTheme();
  const zoneDictionary = zones.reduce<Record<string, MapZone>>((acc, zone) => {
    acc[zone.kecamatan.toLowerCase()] = zone;
    return acc;
  }, {});

  const styleFeature = (feature?: Feature) => {
    const kec = (feature?.properties as { kecamatan?: string })?.kecamatan?.toLowerCase();
    const zone = kec ? zoneDictionary[kec] : undefined;
    const color = zone ? categoryColor[zone.kategoriRisiko] : "#64748b";
    return {
      color,
      weight: 1.5,
      fillColor: color,
      fillOpacity: 0.45,
    };
  };

  const onEachFeature = (feature: Feature, layer: Layer) => {
    const kec = (feature?.properties as { kecamatan?: string })?.kecamatan?.toLowerCase();
    const zone = kec ? zoneDictionary[kec] : undefined;
    if (zone) {
      layer.bindTooltip(
        `${zone.kecamatan} • ${zone.kategoriRisiko}\nDominan: ${zone.dominantCase}`,
        {
          direction: "top",
        }
      );
    }
  };

  return (
    <div className="rounded-4xl border border-slate-200/70 bg-white shadow-xl dark:border-white/10 dark:bg-slate-900/70">
      <MapContainer
        center={[-7.02, 107.62]}
        zoom={10}
        scrollWheelZoom={false}
        className="h-[420px] w-full rounded-4xl"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">Carto</a>'
          url={
            theme === "dark"
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          }
        />
        <GeoJSON data={bandungZones as any} style={styleFeature as any} onEachFeature={onEachFeature as any} />
        {zones.map((zone) => (
          <CircleMarker
            key={zone.kecamatan}
            center={[zone.coordinates[0], zone.coordinates[1]]}
            radius={12}
            pathOptions={{ color: categoryColor[zone.kategoriRisiko], fillOpacity: 0.7 }}
          >
            <Tooltip direction="top">
              <div className="text-xs">
                <p className="font-semibold">{zone.kecamatan}</p>
                <p>{zone.kategoriRisiko}</p>
                <p>Dominan: {zone.dominantCase}</p>
              </div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};
