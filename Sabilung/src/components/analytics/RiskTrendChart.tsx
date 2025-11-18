import type { TrendPoint } from "../../types";

interface RiskTrendChartProps {
  data: TrendPoint[];
}

export const RiskTrendChart = ({ data }: RiskTrendChartProps) => {
  if (!data.length) return null;

  const maxValue = Math.max(...data.map((item) => item.value));
  const minValue = Math.min(...data.map((item) => item.value));
  const range = maxValue - minValue || 1;
  const width = 340;
  const height = 160;
  const step = width / (data.length - 1);

  const points = data
    .map((item, index) => {
      const x = index * step;
      const normalized = (item.value - minValue) / range;
      const y = height - normalized * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-3xl border border-slate-200/70 bg-white px-5 py-4 shadow-lg dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-300">
        <p>Kenaikan Kasus per Bulan</p>
        <p>Triwulan 2025</p>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="mt-4 h-40 w-full">
        <defs>
          <linearGradient id="riskGradient" x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#1A76FF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1A76FF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline fill="none" stroke="#53B7FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={points} />
        <polygon fill="url(#riskGradient)" points={`${points} ${width},${height} 0,${height}`} opacity={0.35} />
        {data.map((item, index) => {
          const x = index * step;
          const normalized = (item.value - minValue) / range;
          const y = height - normalized * height;
          return (
            <g key={item.label}>
              <circle cx={x} cy={y} r={4} className="fill-white dark:fill-white" />
              <text x={x} y={height + 20} textAnchor="middle" className="fill-slate-500 text-xs dark:fill-slate-300">
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
