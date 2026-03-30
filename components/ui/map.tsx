"use client";

import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";

export interface MapMarker {
  lat: number;
  lng: number;
  flag: string;
  label: string;
  isHQ?: boolean;
  labelOffset?: { dx: number; dy: number };
}

interface WorldMapProps {
  markers?: MapMarker[];
}

const W = 960;
const H = 500;

const HIGHLIGHT = new Set([
  "Ecuador", "Colombia", "United States of America",
  "Guatemala", "Peru", "Mexico", "Panama", "Venezuela",
  "Bolivia", "Chile",
]);

interface ProjectedMarker extends MapMarker {
  x: number;
  y: number;
}

export function WorldMap({ markers = [] }: WorldMapProps) {
  const [paths, setPaths] = useState<{ d: string; highlight: boolean }[]>([]);
  const [pts, setPts]     = useState<ProjectedMarker[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);
  const projRef = useRef<d3.GeoProjection | null>(null);

  useEffect(() => {
    // Mercator centrado en las Américas
    const proj = d3
      .geoMercator()
      .scale(480)
      .center([-80, 5])
      .translate([W / 2, H / 2]);

    projRef.current = proj;
    const pathGen = d3.geoPath().projection(proj);

    fetch(
      "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/cultural/ne_110m_admin_0_countries.json"
    )
      .then((r) => r.json())
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ps = data.features.map((f: any) => ({
          d: pathGen(f) ?? "",
          highlight: HIGHLIGHT.has(f.properties?.NAME ?? ""),
        }));
        setPaths(ps);

        const projected = markers.flatMap((m) => {
          const p = proj([m.lng, m.lat]);
          if (!p) return [];
          return [{ ...m, x: p[0], y: p[1] }];
        });
        setPts(projected);
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-project if markers change after initial load
  useEffect(() => {
    const proj = projRef.current;
    if (!proj || paths.length === 0) return;
    const projected = markers.flatMap((m) => {
      const p = proj([m.lng, m.lat]);
      if (!p) return [];
      return [{ ...m, x: p[0], y: p[1] }];
    });
    setPts(projected);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers, paths.length]);

  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{ background: "#07090F", aspectRatio: "960/500" }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        <defs>
          <filter id="glow-hq" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-dot" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="region-hl" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#4F7EFF" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#4F7EFF" stopOpacity="0"    />
          </radialGradient>
        </defs>

        {/* Country fills */}
        {paths.map(({ d, highlight }, i) => (
          <path
            key={i}
            d={d}
            fill={highlight ? "rgba(79,126,255,0.14)" : "rgba(79,126,255,0.04)"}
            stroke={highlight ? "rgba(79,126,255,0.5)" : "rgba(79,126,255,0.15)"}
            strokeWidth={highlight ? 0.8 : 0.4}
          />
        ))}

        {/* Subtle regional glow over office cluster */}
        <ellipse cx="470" cy="280" rx="110" ry="120" fill="url(#region-hl)" />

        {/* Markers */}
        {pts.map((m) => {
          const color = m.isHQ ? "#00FF9D" : "#4F7EFF";
          const r     = m.isHQ ? 7 : 5;
          const off   = m.labelOffset ?? { dx: 14, dy: 0 };
          const lx    = m.x + off.dx;
          const ly    = m.y + off.dy;
          const anchor = off.dx < 0 ? "end" : "start";
          const isHov  = hovered === m.label;

          // Label pill dimensions
          const charW  = 7;
          const flagW  = 16;
          const padX   = 8;
          const padY   = 5;
          const fontSize = m.isHQ ? 12 : 11;
          const pillW  = flagW + 4 + m.label.length * charW + padX * 2 + (m.isHQ ? 16 : 0);
          const pillH  = fontSize + padY * 2;
          const pillX  = anchor === "end" ? lx - pillW : lx;
          const pillY  = ly - pillH / 2;

          return (
            <g
              key={m.label}
              onMouseEnter={() => setHovered(m.label)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "default" }}
            >
              {/* HQ pulse rings */}
              {m.isHQ && (
                <>
                  <circle cx={m.x} cy={m.y} r={r} fill="none" stroke={color} strokeWidth="1">
                    <animate attributeName="r"       from={r}  to={r + 16} dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.7" to="0"     dur="2.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={m.x} cy={m.y} r={r} fill="none" stroke={color} strokeWidth="0.6">
                    <animate attributeName="r"       from={r}  to={r + 26} dur="2.5s" begin="0.9s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.4" to="0"     dur="2.5s" begin="0.9s" repeatCount="indefinite" />
                  </circle>
                </>
              )}

              {/* Glow halo */}
              <circle cx={m.x} cy={m.y} r={r + 5}
                fill={color}
                opacity={isHov ? 0.3 : m.isHQ ? 0.2 : 0.12}
              />

              {/* Core dot */}
              <circle
                cx={m.x} cy={m.y} r={isHov ? r + 2 : r}
                fill={color}
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="1"
                filter={`url(#${m.isHQ ? "glow-hq" : "glow-dot"})`}
                style={{ transition: "r 0.15s" }}
              />

              {/* Label pill */}
              <rect
                x={pillX} y={pillY} width={pillW} height={pillH} rx={5}
                fill="rgba(7,9,15,0.88)"
                stroke={m.isHQ ? "rgba(0,255,157,0.4)" : "rgba(79,126,255,0.3)"}
                strokeWidth="0.7"
                style={{ pointerEvents: "none" }}
              />
              <text
                x={anchor === "end" ? pillX + padX : pillX + padX}
                y={pillY + pillH / 2}
                dominantBaseline="middle"
                fontSize={fontSize}
                fontWeight={m.isHQ ? 700 : 500}
                fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
                fill={m.isHQ ? "#00FF9D" : "rgba(255,255,255,0.88)"}
                style={{ pointerEvents: "none" }}
              >
                {m.flag} {m.label}{m.isHQ ? " ★" : ""}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
