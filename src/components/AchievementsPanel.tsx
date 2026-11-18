import React from 'react';
import {
  Award,
  Bike,
  CheckCircle2,
  Compass,
  Lock,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react';
import { EDUCATIONAL_BADGES, IOT_SCENARIOS, MISSIONS, PROFILE_META } from '../data/mobilityData';
import { computeIoTMetrics } from '../services/iotSimulator';
import type { AppView, IoTParams, UserProfile } from '../types/mobility';
import { GuardiSpeechCard } from './GuardiCompanion';

interface AchievementsPanelProps {
  profile: UserProfile;
  totalPoints: number;
  totalStars: number;
  completedMissionStars: Record<string, number>;
  joinedPledgesCount: number;
  currentIoTParams: IoTParams;
  onNavigate: (view: AppView) => void;
}

export function AchievementsPanel({
  profile,
  totalPoints,
  totalStars,
  completedMissionStars,
  joinedPledgesCount,
  currentIoTParams,
  onNavigate,
}: AchievementsPanelProps) {
  const completedCount = Object.keys(completedMissionStars).length;
  const maxStars = MISSIONS.length * 3;
  const missionProgressPct = Math.round((completedCount / MISSIONS.length) * 100);

  const unlockedBadgeIds = EDUCATIONAL_BADGES.filter(
    (b) => (completedMissionStars[b.missionId] || 0) >= 2
  ).map((b) => b.id);

  // Scenario comparison (collaborative benchmark, zero shaming)
  const baselineBad = computeIoTMetrics(IOT_SCENARIOS[0].params);
  const organizedGood = computeIoTMetrics(IOT_SCENARIOS[1].params);
  const currentSim = computeIoTMetrics(currentIoTParams);

  const badgeIconMap: Record<string, React.ReactNode> = {
    'protector-peaton': <ShieldCheck className="w-7 h-7" />,
    'experto-movilidad': <Compass className="w-7 h-7" />,
    'guardian-responsable': <Award className="w-7 h-7" />,
    'amigo-bicicleta': <Bike className="w-7 h-7" />,
  };

  const badgeColors: Record<string, string> = {
    sky: 'bg-sky-600 text-white',
    emerald: 'bg-emerald-600 text-white',
    amber: 'bg-amber-500 text-slate-950',
    orange: 'bg-orange-500 text-white',
  };

  const improvementRecommendations: string[] = [];
  if (completedCount < MISSIONS.length) {
    improvementRecommendations.push(
      `Completa las ${MISSIONS.length - completedCount} misiones pendientes para desbloquear todas las insignias educativas.`
    );
  }
  if (joinedPledgesCount === 0) {
    improvementRecommendations.push(
      'Súmate al menos a un compromiso comunitario en "Somos Guardianes" para fortalecer la cultura vial.'
    );
  }
  if (currentIoTParams.undueOccupation > 2) {
    improvementRecommendations.push(
      'En el Monitor IoT, experimenta reducir la ocupación indebida a 0 o 1 vehículo para ver cuánto sube la seguridad peatonal.'
    );
  }
  if (improvementRecommendations.length === 0) {
    improvementRecommendations.push(
      '¡Gran recorrido! Comparte estas prácticas con tu curso o familia para multiplicar el cambio en tu colegio de Cali.'
    );
  }

  return (
    <div className="space-y-6">
      {/* Learning Overview Header */}
      <section className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
              Mis Logros y Reconocimientos
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Panel de progreso individual y aprendizaje colaborativo · Perfil {PROFILE_META[profile].title}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('misiones')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-bold hover:bg-sky-700 transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            Seguir jugando misiones
          </button>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-sky-50 border border-sky-200 p-4">
            <p className="text-xs font-semibold text-sky-800">Puntos educativos</p>
            <p className="mt-1 font-mono text-3xl font-extrabold text-slate-900 tabular-nums">{totalPoints}</p>
          </div>
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
            <p className="text-xs font-semibold text-amber-900">Estrellas obtenidas</p>
            <p className="mt-1 font-mono text-3xl font-extrabold text-slate-900 tabular-nums inline-flex items-center gap-1.5">
              {totalStars}/{maxStars}
              <Star className="w-6 h-6 fill-amber-400 text-amber-500" aria-hidden="true" />
            </p>
          </div>
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
            <p className="text-xs font-semibold text-emerald-900">Misiones completadas</p>
            <p className="mt-1 font-mono text-3xl font-extrabold text-slate-900 tabular-nums">
              {completedCount}/{MISSIONS.length}
            </p>
          </div>
          <div className="rounded-2xl bg-orange-50 border border-orange-200 p-4">
            <p className="text-xs font-semibold text-orange-900">Insignias ganadas</p>
            <p className="mt-1 font-mono text-3xl font-extrabold text-slate-900 tabular-nums">
              {unlockedBadgeIds.length}/{EDUCATIONAL_BADGES.length}
            </p>
          </div>
        </div>

        {/* Mission Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
            <span>Avance general de tu aventura</span>
            <span className="font-mono tabular-nums">{missionProgressPct}%</span>
          </div>
          <div className="h-3.5 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-sky-600 rounded-full transition-all"
              style={{ width: `${missionProgressPct}%` }}
            />
          </div>
        </div>
      </section>

      {/* Collectible Badges */}
      <section className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
        <div>
          <h2 className="font-display text-xl font-bold text-slate-900">Insignias Educativas</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Se desbloquean al obtener al menos 2 estrellas en cada misión del simulador.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {EDUCATIONAL_BADGES.map((badge) => {
            const unlocked = unlockedBadgeIds.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`rounded-2xl border p-4 flex flex-col justify-between gap-3 ${
                  unlocked
                    ? 'bg-white border-slate-300 shadow-sm'
                    : 'bg-slate-50 border-slate-200 opacity-80'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      unlocked ? badgeColors[badge.accentColor] : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {badgeIconMap[badge.id]}
                  </div>
                  {unlocked ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" />
                      Lograda
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                      <Lock className="w-3.5 h-3.5" />
                      Por descubrir
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{badge.name}</h3>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Scenario Comparison & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <section className="lg:col-span-7 rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900">
              Comparación de Escenarios Simulados
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Cómo mejora la seguridad peatonal cuando la comunidad escolar se organiza
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                label: 'Hora pico sin organización',
                safety: baselineBad.pedestrianSafetyScore,
                sustainability: baselineBad.sustainabilityScore,
                barClass: 'bg-orange-500',
              },
              {
                label: 'Tu simulación actual (Monitor IoT)',
                safety: currentSim.pedestrianSafetyScore,
                sustainability: currentSim.sustainabilityScore,
                barClass: 'bg-sky-600',
              },
              {
                label: 'Ingreso organizado con Guardianes',
                safety: organizedGood.pedestrianSafetyScore,
                sustainability: organizedGood.sustainabilityScore,
                barClass: 'bg-emerald-600',
              },
            ].map((row) => (
              <div key={row.label} className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2">
                <div className="flex items-center justify-between gap-2 text-sm font-bold text-slate-900">
                  <span>{row.label}</span>
                  <span className="font-mono text-xs text-slate-600 tabular-nums">
                    Seguridad {row.safety}% · Sostenibilidad {row.sustainability}%
                  </span>
                </div>
                <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
                  <div className={`h-full rounded-full ${row.barClass}`} style={{ width: `${row.safety}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="lg:col-span-5 rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="font-display text-xl font-bold text-slate-900">
            Recomendaciones de Mejora
          </h2>
          <ul className="space-y-2.5">
            {improvementRecommendations.map((tip, i) => (
              <li
                key={i}
                className="rounded-2xl bg-sky-50 border border-sky-200 p-3.5 text-sm text-slate-800 leading-relaxed"
              >
                {tip}
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-500">
            {PROFILE_META[profile].focusTip}
          </p>
        </section>
      </div>

      <GuardiSpeechCard
        title="Mensaje final de Guardi"
        tone="sky"
        message={
          completedCount === MISSIONS.length
            ? '¡Felicitaciones! Completaste todas las misiones educativas. Recuerda: pequeñas acciones diarias hacen grandes cambios en la movilidad de nuestro colegio.'
            : 'Cada misión superada te acerca a ser un experto en movilidad segura. ¡Sigue explorando a tu ritmo!'
        }
        actionLabel="Ir al Monitor IoT"
        onAction={() => onNavigate('monitor')}
      />
    </div>
  );
}
