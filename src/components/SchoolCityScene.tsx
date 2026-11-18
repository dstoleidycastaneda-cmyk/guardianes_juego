import React from 'react';
import type { IoTMetrics, IoTParams } from '../types/mobility';

interface SchoolCitySceneProps {
  params: IoTParams;
  metrics: IoTMetrics;
  isPlaying: boolean;
  reducedMotion: boolean;
}

export function SchoolCityScene({
  params,
  metrics,
  isPlaying,
  reducedMotion,
}: SchoolCitySceneProps) {
  // Visual counts scaled from simulated IoT parameters
  const carCount = Math.max(1, Math.min(8, Math.round(params.vehicleFlow / 6)));
  const blockedCount = Math.min(4, Math.ceil(params.undueOccupation / 3));
  const pedestrianCount = Math.max(2, Math.min(10, Math.round(params.pedestrianFlow / 8)));
  const cyclistCount = Math.min(6, Math.round(params.cyclists / 5));
  const guardianCount = Math.min(6, Math.max(0, Math.round(params.activeGuardians / 1.6)));

  const animateActive = isPlaying && !reducedMotion;

  const statusBannerColor =
    metrics.status === 'seguro'
      ? 'bg-emerald-600 text-white'
      : metrics.status === 'moderado'
        ? 'bg-amber-500 text-slate-950'
        : 'bg-red-600 text-white';

  return (
    <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 bg-slate-50">
        <div>
          <p className="text-sm font-bold text-slate-900">Ciudad Escolar Interactiva (Simulación)</p>
          <p className="text-xs text-slate-500">
            Cambia los controles para ver cómo responden vehículos, peatones, ciclistas y Guardianes
          </p>
        </div>
        <div className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap ${statusBannerColor}`}>
          {metrics.statusLabel} · Seguridad {metrics.pedestrianSafetyScore}%
        </div>
      </div>

      <div className="relative bg-sky-100">
        <svg
          viewBox="0 0 800 410"
          className="w-full h-auto block select-none"
          role="img"
          aria-label={`Representación visual del entorno escolar: ${carCount} vehículos en vía, ${pedestrianCount} peatones, ${cyclistCount} ciclistas, ${params.undueOccupation} vehículos en ocupación indebida y ${params.activeGuardians} guardianes activos`}
        >
          <defs>
            <linearGradient id="caliSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#BAE6FD" />
              <stop offset="100%" stopColor="#E0F2FE" />
            </linearGradient>
          </defs>

          {/* Sky & Farallones de Cali mountains */}
          <rect x="0" y="0" width="800" height="175" fill="url(#caliSky)" />
          <path d="M0 165 Q120 95 250 145 Q380 85 520 150 Q660 100 800 155 L800 175 L0 175 Z" fill="#93C5FD" opacity="0.55" />
          <circle cx="715" cy="52" r="24" fill="#FACC15" />

          {/* School Campus Zone */}
          <rect x="0" y="130" width="800" height="58" fill="#DCFCE7" />
          {/* Samán trees */}
          <g>
            <rect x="52" y="128" width="12" height="42" rx="4" fill="#92400E" />
            <ellipse cx="58" cy="115" rx="44" ry="26" fill="#22C55E" />
            <rect x="692" y="128" width="12" height="42" rx="4" fill="#92400E" />
            <ellipse cx="698" cy="115" rx="44" ry="26" fill="#16A34A" />
          </g>

          {/* School Building */}
          <rect x="215" y="64" width="370" height="106" rx="12" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="3" />
          <polygon points="205,68 400,26 595,68" fill="#EA580C" />
          <rect x="345" y="112" width="110" height="58" rx="8" fill="#0284C7" />
          <rect x="358" y="124" width="84" height="46" rx="4" fill="#E0F2FE" />
          <text x="400" y="96" textAnchor="middle" fontSize="15" fontWeight="800" fill="#0F172A">
            COLEGIO · ZONA ESCOLAR
          </text>
          {/* Windows */}
          {[242, 286, 482, 526].map((wx) => (
            <rect key={wx} x={wx} y="106" width="28" height="28" rx="4" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2" />
          ))}

          {/* ESP32 / Sensor mast at school gate */}
          <rect x="194" y="95" width="7" height="75" rx="3" fill="#475569" />
          <rect x="182" y="88" width="32" height="18" rx="4" fill="#0F172A" />
          <circle cx="198" cy="97" r="4" fill={metrics.status === 'alerta' ? '#EF4444' : '#22C55E'} />

          {/* Upper Sidewalk (Andén Seguro) */}
          <rect x="0" y="170" width="800" height="42" fill="#E2E8F0" />
          <line x1="0" y1="212" x2="800" y2="212" stroke="#94A3B8" strokeWidth="3" />

          {/* Dedicated Green Bike Lane (Ciclorruta) */}
          <rect x="0" y="212" width="800" height="40" fill="#10B981" />
          <line x1="0" y1="252" x2="800" y2="252" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="14 10" />
          <text x="20" y="237" fontSize="12" fontWeight="700" fill="#FFFFFF" opacity="0.9">
            CICLORRUTA ESCOLAR
          </text>

          {/* Main Street (Calzada Vehicular) */}
          <rect x="0" y="252" width="800" height="110" fill="#475569" />
          <line x1="0" y1="307" x2="800" y2="307" stroke="#FDE047" strokeWidth="3" strokeDasharray="20 14" />

          {/* Yellow School Zebra Crosswalk */}
          <g>
            {[0, 1, 2, 3, 4].map((idx) => (
              <rect
                key={idx}
                x={354}
                y={217 + idx * 28}
                width={92}
                height={18}
                rx={4}
                fill="#FACC15"
              />
            ))}
          </g>

          {/* Lower Sidewalk */}
          <rect x="0" y="362" width="800" height="48" fill="#CBD5E1" />
          <text x="20" y="391" fontSize="12" fontWeight="700" fill="#334155">
            ANDÉN PEATONAL SEGURO
          </text>

          {/* Drop-off safe bay indicator */}
          <rect x="520" y="254" width="150" height="42" rx="6" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="8 5" />
          <text x="595" y="269" textAnchor="middle" fontSize="10" fontWeight="700" fill="#BAE6FD">
            ZONA BAJA Y SIGUE
          </text>

          {/* Active Guardians (Adults in reflective vests organizing safe zones) */}
          {Array.from({ length: guardianCount }).map((_, idx) => {
            const positions = [
              { x: 332, y: 196 },
              { x: 468, y: 196 },
              { x: 332, y: 378 },
              { x: 468, y: 378 },
              { x: 540, y: 196 },
              { x: 245, y: 196 },
            ];
            const pos = positions[idx % positions.length];
            return (
              <g key={`guardian-${idx}`} transform={`translate(${pos.x}, ${pos.y})`}>
                <circle cx="0" cy="-12" r="7" fill="#FDE68A" stroke="#0F172A" strokeWidth="1.5" />
                <rect x="-8" y="-5" width="16" height="16" rx="5" fill="#FACC15" stroke="#EA580C" strokeWidth="2" />
                <line x1="-5" y1="2" x2="5" y2="2" stroke="#0F172A" strokeWidth="2" />
              </g>
            );
          })}

          {/* Undue Occupation (Cars improperly blocking crosswalk or bike lane) */}
          {Array.from({ length: blockedCount }).map((_, idx) => {
            const blockPositions = [
              { x: 368, y: 266 },
              { x: 382, y: 222 },
              { x: 342, y: 314 },
              { x: 410, y: 274 },
            ];
            const pos = blockPositions[idx % blockPositions.length];
            return (
              <g key={`blocked-${idx}`} transform={`translate(${pos.x}, ${pos.y})`}>
                <rect x="-26" y="-14" width="52" height="26" rx="7" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2" />
                <rect x="-15" y="-10" width="26" height="11" rx="3" fill="#FEE2E2" />
                <polygon points="0,-28 -9,-13 9,-13" fill="#FACC15" stroke="#991B1B" strokeWidth="1.5" />
                <text x="0" y="-15" textAnchor="middle" fontSize="10" fontWeight="900" fill="#991B1B">
                  !
                </text>
              </g>
            );
          })}

          {/* Moving Vehicles on Main Street */}
          {Array.from({ length: carCount }).map((_, idx) => {
            const laneY = idx % 2 === 0 ? 275 : 326;
            const startX = (idx * 108 + 40) % 720;
            const carColors = ['#0284C7', '#F59E0B', '#64748B', '#0EA5E9', '#FB923C'];
            const color = idx === 0 ? '#EAB308' : carColors[idx % carColors.length];
            return (
              <g key={`car-${idx}`} transform={`translate(${startX}, ${laneY})`}>
                {animateActive && (
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from={`${idx % 2 === 0 ? -70 : 830} ${laneY}`}
                    to={`${idx % 2 === 0 ? 830 : -70} ${laneY}`}
                    dur={`${Math.max(4, 14 - Math.round(params.vehicleFlow / 5) + (idx % 3))}s`}
                    begin={`${-(idx * 1.4)}s`}
                    repeatCount="indefinite"
                  />
                )}
                <rect x="-28" y="-13" width="56" height="26" rx="7" fill={color} stroke="#0F172A" strokeWidth="1.5" />
                <rect x="-14" y="-9" width="26" height="10" rx="3" fill="#E0F2FE" />
                <circle cx="-16" cy="13" r="4.5" fill="#0F172A" />
                <circle cx="16" cy="13" r="4.5" fill="#0F172A" />
              </g>
            );
          })}

          {/* Cyclists in Bike Lane */}
          {Array.from({ length: cyclistCount }).map((_, idx) => {
            const startX = (idx * 135 + 70) % 740;
            return (
              <g key={`bike-${idx}`} transform={`translate(${startX}, 233)`}>
                {animateActive && (
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="-40 233"
                    to="840 233"
                    dur={`${6 + (idx % 3) * 1.5}s`}
                    begin={`${-(idx * 1.1)}s`}
                    repeatCount="indefinite"
                  />
                )}
                <circle cx="-9" cy="6" r="6" fill="none" stroke="#FFFFFF" strokeWidth="2.5" />
                <circle cx="9" cy="6" r="6" fill="none" stroke="#FFFFFF" strokeWidth="2.5" />
                <path d="M-9 6 L0 -2 L9 6 M0 -2 L3 -8" stroke="#FDE047" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <circle cx="3" cy="-12" r="4.5" fill="#EA580C" />
              </g>
            );
          })}

          {/* Pedestrians on Sidewalk & Zebra */}
          {Array.from({ length: pedestrianCount }).map((_, idx) => {
            const onZebra = idx < 3;
            const px = onZebra ? 375 + idx * 24 : 90 + ((idx * 85) % 620);
            const py = onZebra ? 245 + (idx % 2) * 55 : idx % 2 === 0 ? 192 : 382;
            const shirtColors = ['#0284C7', '#EC4899', '#16A34A', '#F97316', '#6366F1'];
            return (
              <g key={`ped-${idx}`} transform={`translate(${px}, ${py})`}>
                {animateActive && onZebra && (
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values={`${px} 200; ${px} 365; ${px} 200`}
                    dur={`${6 + idx}s`}
                    repeatCount="indefinite"
                  />
                )}
                <circle cx="0" cy="-11" r="5.5" fill="#FDBA74" stroke="#0F172A" strokeWidth="1.2" />
                <rect x="-5.5" y="-5.5" width="11" height="12" rx="4" fill={shirtColors[idx % shirtColors.length]} />
              </g>
            );
          })}
        </svg>

        {/* Legend Strip */}
        <div className="px-4 py-2.5 bg-white border-t border-slate-200 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-yellow-400 inline-block" aria-hidden="true" />
            Cebra peatonal
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" aria-hidden="true" />
            Ciclorruta
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-red-600 inline-block" aria-hidden="true" />
            Ocupación indebida ({params.undueOccupation})
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400 border border-orange-600 inline-block" aria-hidden="true" />
            Guardianes adultos ({params.activeGuardians})
          </span>
        </div>
      </div>
    </div>
  );
}
