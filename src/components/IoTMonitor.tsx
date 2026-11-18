import React, { useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
  Info,
  Pause,
  Play,
  Radio,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';
import { IOT_SCENARIOS } from '../data/mobilityData';
import { buildSimulatedMqttPayload, computeIoTMetrics } from '../services/iotSimulator';
import type { IoTHistoryPoint, IoTParams, UserProfile } from '../types/mobility';
import { GuardiSpeechCard } from './GuardiCompanion';
import { SchoolCityScene } from './SchoolCityScene';

interface IoTMonitorProps {
  params: IoTParams;
  onChangeParams: (next: IoTParams) => void;
  activeScenarioId: string;
  onSelectScenario: (scenarioId: string, params: IoTParams) => void;
  profile: UserProfile;
  reducedMotion: boolean;
}

export function IoTMonitor({
  params,
  onChangeParams,
  activeScenarioId,
  onSelectScenario,
  profile,
  reducedMotion,
}: IoTMonitorProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showArchitecture, setShowArchitecture] = useState(false);
  const [history, setHistory] = useState<IoTHistoryPoint[]>(() => {
    const initial = computeIoTMetrics(params);
    return [
      { tick: 'T-4', safety: Math.max(15, initial.pedestrianSafetyScore - 6), congestion: Math.min(90, initial.riskIndex + 4) },
      { tick: 'T-3', safety: Math.max(15, initial.pedestrianSafetyScore - 3), congestion: Math.min(90, initial.riskIndex + 2) },
      { tick: 'T-2', safety: initial.pedestrianSafetyScore, congestion: initial.riskIndex },
      { tick: 'T-1', safety: initial.pedestrianSafetyScore, congestion: initial.riskIndex },
      { tick: 'Actual', safety: initial.pedestrianSafetyScore, congestion: initial.riskIndex },
    ];
  });

  const metrics = computeIoTMetrics(params);
  const mqttPreview = buildSimulatedMqttPayload(params, metrics);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      const m = computeIoTMetrics(params);
      const jitterSafety = Math.max(10, Math.min(99, m.pedestrianSafetyScore + Math.round((Math.random() - 0.5) * 4)));
      const jitterRisk = Math.max(5, Math.min(95, m.riskIndex + Math.round((Math.random() - 0.5) * 4)));
      setHistory((prev) => {
        const next = [
          ...prev.slice(1).map((p, i) => ({ ...p, tick: `T-${4 - i}` })),
          { tick: 'Actual', safety: jitterSafety, congestion: jitterRisk },
        ];
        return next;
      });
    }, 2400);
    return () => clearInterval(interval);
  }, [isPlaying, params]);

  const updateField = (key: keyof IoTParams, value: number) => {
    onChangeParams({ ...params, [key]: value });
  };

  const resetToDefault = () => {
    const base = IOT_SCENARIOS[1];
    onSelectScenario(base.id, base.params);
  };

  const StatusIcon =
    metrics.status === 'seguro'
      ? CheckCircle2
      : metrics.status === 'moderado'
        ? AlertTriangle
        : ShieldAlert;

  const statusStyles =
    metrics.status === 'seguro'
      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
      : metrics.status === 'moderado'
        ? 'bg-amber-50 border-amber-200 text-amber-950'
        : 'bg-red-50 border-red-200 text-red-950';

  const sliderConfigs: Array<{
    key: keyof IoTParams;
    label: string;
    unit: string;
    min: number;
    max: number;
    helper: string;
  }> = [
    {
      key: 'vehicleFlow',
      label: 'Flujo vehicular',
      unit: 'veh/min',
      min: 2,
      max: 45,
      helper: 'Carros y rutas pasando frente al colegio',
    },
    {
      key: 'pedestrianFlow',
      label: 'Flujo peatonal',
      unit: 'est/min',
      min: 5,
      max: 80,
      helper: 'Estudiantes caminando por el andén y la cebra',
    },
    {
      key: 'undueOccupation',
      label: 'Ocupación indebida',
      unit: 'vehículos',
      min: 0,
      max: 12,
      helper: 'Vehículos deteniéndose sobre cebra o ciclorruta',
    },
    {
      key: 'cyclists',
      label: 'Ciclistas',
      unit: 'bicis/min',
      min: 0,
      max: 35,
      helper: 'Estudiantes usando la ciclorruta escolar',
    },
    {
      key: 'activeGuardians',
      label: 'Guardianes activos',
      unit: 'voluntarios',
      min: 0,
      max: 10,
      helper: 'Acudientes y docentes acompañando zonas seguras',
    },
  ];

  // Build SVG polyline points for the trend chart
  const chartWidth = 420;
  const chartHeight = 120;
  const toPoints = (values: number[]) =>
    values
      .map((val, idx) => {
        const x = 24 + (idx * (chartWidth - 48)) / Math.max(1, values.length - 1);
        const y = chartHeight - 16 - ((val / 100) * (chartHeight - 32));
        return `${x},${y}`;
      })
      .join(' ');

  return (
    <div className="space-y-6">
      {/* Educational Simulation Notice */}
      <div className="rounded-2xl bg-sky-50 border border-sky-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-sm text-sky-950">
          <Info className="w-5 h-5 text-sky-600 shrink-0" />
          <span>
            <strong>Monitor Inteligente IoT (Datos Simulados):</strong> Los valores representan una simulación educativa; no hay sensores físicos conectados ni cámaras activas.
          </span>
        </div>
        <span className="text-xs font-semibold text-sky-800">Perfil: {profile}</span>
      </div>

      {/* Main Two-Zone Simulation Split */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Zone (60%+) Interactive School Stage & Charts */}
        <div className="xl:col-span-7 space-y-5">
          <SchoolCityScene
            params={params}
            metrics={metrics}
            isPlaying={isPlaying}
            reducedMotion={reducedMotion}
          />

          {/* Color-coded simple explanation */}
          <div className={`rounded-2xl border p-4 flex items-start gap-3 ${statusStyles}`}>
            <StatusIcon className="w-6 h-6 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold">
                Estado del entorno escolar: {metrics.statusLabel}
              </p>
              <p className="text-sm mt-0.5 leading-relaxed opacity-90">{metrics.statusExplanation}</p>
            </div>
          </div>

          {/* Indicators & Live Trend Graph */}
          <div className="rounded-3xl bg-white border border-slate-200 p-5 space-y-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-sky-600" />
                <h2 className="font-display text-lg font-bold text-slate-900">
                  Indicadores y Tendencia Simulada
                </h2>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="inline-flex items-center gap-1.5 text-emerald-700">
                  <span className="w-3 h-1 bg-emerald-600 rounded-full inline-block" />
                  Seguridad peatonal
                </span>
                <span className="inline-flex items-center gap-1.5 text-orange-600">
                  <span className="w-3 h-1 bg-orange-500 rounded-full inline-block" />
                  Riesgo / Congestión
                </span>
              </div>
            </div>

            {/* 3 Clear Progress Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>Seguridad peatonal</span>
                  <span className="font-mono text-emerald-700 tabular-nums">
                    {metrics.pedestrianSafetyScore}%
                  </span>
                </div>
                <div className="mt-2 h-2.5 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${metrics.pedestrianSafetyScore}%` }}
                  />
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>Fluidez vial</span>
                  <span className="font-mono text-sky-700 tabular-nums">{metrics.fluidityScore}%</span>
                </div>
                <div className="mt-2 h-2.5 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full transition-all"
                    style={{ width: `${metrics.fluidityScore}%` }}
                  />
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>Movilidad sostenible</span>
                  <span className="font-mono text-amber-700 tabular-nums">
                    {metrics.sustainabilityScore}%
                  </span>
                </div>
                <div className="mt-2 h-2.5 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${metrics.sustainabilityScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* SVG Trend Line Chart */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-32">
                {[25, 50, 75].map((pct) => {
                  const y = chartHeight - 16 - ((pct / 100) * (chartHeight - 32));
                  return (
                    <line
                      key={pct}
                      x1="24"
                      y1={y}
                      x2={chartWidth - 24}
                      y2={y}
                      stroke="#CBD5E1"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                  );
                })}
                <polyline
                  fill="none"
                  stroke="#059669"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={toPoints(history.map((h) => h.safety))}
                />
                <polyline
                  fill="none"
                  stroke="#EA580C"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={toPoints(history.map((h) => h.congestion))}
                />
                {history.map((pt, idx) => {
                  const x = 24 + (idx * (chartWidth - 48)) / Math.max(1, history.length - 1);
                  const ySafe = chartHeight - 16 - ((pt.safety / 100) * (chartHeight - 32));
                  return (
                    <g key={`${pt.tick}-${idx}`}>
                      <circle cx={x} cy={ySafe} r="4" fill="#059669" />
                      <text x={x} y={chartHeight - 2} textAnchor="middle" fontSize="10" fill="#64748B">
                        {pt.tick}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Right Zone: Scenarios & Interactive Controls */}
        <div className="xl:col-span-5 space-y-5">
          {/* Scenarios */}
          <div className="rounded-3xl bg-white border border-slate-200 p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-lg font-bold text-slate-900">
                Escenarios preconfigurados
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying((p) => !p)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold hover:bg-slate-200 transition-colors whitespace-nowrap"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {isPlaying ? 'Pausar' : 'Reanudar'}
                </button>
                <button
                  type="button"
                  onClick={resetToDefault}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold hover:bg-slate-200 transition-colors whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reiniciar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-2.5">
              {IOT_SCENARIOS.map((sc) => {
                const selected = activeScenarioId === sc.id;
                return (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => onSelectScenario(sc.id, sc.params)}
                    className={`text-left rounded-2xl border p-3.5 transition-colors focus-visible:outline-2 focus-visible:outline-sky-600 ${
                      selected
                        ? 'bg-sky-50 border-sky-400 text-slate-900'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold">{sc.name}</span>
                      <span className="text-xs font-medium text-slate-500">{sc.timeWindow}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">{sc.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5 Interactive Sliders */}
          <div className="rounded-3xl bg-white border border-slate-200 p-5 space-y-4 shadow-sm">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">
                Controles interactivos de la vía escolar
              </h2>
              <p className="text-xs text-slate-500">
                Ajusta cada variable simulada y observa el cambio inmediato en la ciudad escolar
              </p>
            </div>

            <div className="space-y-4">
              {sliderConfigs.map((cfg) => {
                const val = params[cfg.key];
                const inputId = `slider-${cfg.key}`;
                return (
                  <div key={cfg.key} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <label htmlFor={inputId} className="text-sm font-semibold text-slate-800">
                        {cfg.label}
                      </label>
                      <span className="font-mono text-sm font-bold text-sky-700 tabular-nums">
                        {val} {cfg.unit}
                      </span>
                    </div>
                    <input
                      id={inputId}
                      type="range"
                      min={cfg.min}
                      max={cfg.max}
                      value={val}
                      onChange={(e) => updateField(cfg.key, Number(e.target.value))}
                      className="guardian-slider w-full"
                    />
                    <p className="text-xs text-slate-500">{cfg.helper}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <GuardiSpeechCard
            title="Guardi explica los colores"
            tone={metrics.status === 'seguro' ? 'emerald' : 'amber'}
            message={
              params.undueOccupation >= 5
                ? '¡Mira esos carros rojos sobre la cebra! Prueba bajar la ocupación indebida y sumar Guardianes para ver cómo mejora la seguridad.'
                : '¡Qué bien! Cuando respetamos la cebra y usamos la ciclorruta, el indicador verde nos muestra un colegio más seguro.'
            }
          />
        </div>
      </div>

      {/* Expandable Technical Architecture (ESP32, Vision, MQTT) */}
      <section className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => setShowArchitecture((s) => !s)}
          aria-expanded={showArchitecture}
          className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-base sm:text-lg font-bold text-slate-900">
                Arquitectura Tecnológica Preparada: ESP32, Visión Artificial Anónima y MQTT
              </h2>
              <p className="text-xs text-slate-500">
                Referencia técnica para docentes y evaluadores · Sin recolección biométrica ni cámaras activas
              </p>
            </div>
          </div>
          {showArchitecture ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
        </button>

        {showArchitecture && (
          <div className="px-6 pb-6 pt-2 border-t border-slate-200 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-xs font-bold text-sky-700">1. Nodos de Borde (ESP32)</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">Sensores de flujo y distancia</p>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Microcontroladores ESP32 miden ocupación en zonas restringidas y conteo agregado sin almacenar identidad.
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-xs font-bold text-emerald-700">2. Visión Artificial Anónima</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">Conteo por categorías en borde</p>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Procesamiento local que solo cuenta peatones, bicicletas y vehículos sin guardar video ni reconocimiento facial.
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-xs font-bold text-amber-700">3. Mensajería MQTT</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">Telemetría ligera hacia la web</p>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Publicación en tópicos estructurados listos para conectar hardware real cuando la institución lo valide.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900 text-slate-100 p-4 font-mono text-xs overflow-x-auto">
              <div className="flex items-center gap-2 text-sky-300 mb-2">
                <Radio className="w-4 h-4" />
                <span>Ejemplo de paquete MQTT simulado ({mqttPreview.topic})</span>
              </div>
              <pre className="leading-relaxed">{JSON.stringify(mqttPreview, null, 2)}</pre>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
