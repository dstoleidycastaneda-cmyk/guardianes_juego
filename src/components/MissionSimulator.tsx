import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Star,
  WifiOff,
} from 'lucide-react';
import { MISSIONS } from '../data/mobilityData';
import { requestMissionFeedback } from '../services/aiSimulator';
import type {
  AppView,
  FeedbackResponse,
  IoTParams,
  Mission,
  MissionChoice,
  UserProfile,
} from '../types/mobility';
import { GuardiAvatar } from './GuardiCompanion';

interface MissionSimulatorProps {
  profile: UserProfile;
  aiConnected: boolean;
  iotParams: IoTParams;
  completedMissionStars: Record<string, number>;
  onCompleteMission: (mission: Mission, choice: MissionChoice) => void;
  onNavigate: (view: AppView) => void;
}

export function MissionSimulator({
  profile,
  aiConnected,
  iotParams,
  completedMissionStars,
  onCompleteMission,
  onNavigate,
}: MissionSimulatorProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<MissionChoice | null>(null);
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const mission = MISSIONS[activeIndex];

  const selectMission = (index: number) => {
    setActiveIndex(index);
    setShowHint(false);
    setSelectedChoice(null);
    setFeedback(null);
    setLoadingFeedback(false);
  };

  const handleChooseOption = async (choice: MissionChoice) => {
    setSelectedChoice(choice);
    setLoadingFeedback(true);
    onCompleteMission(mission, choice);

    const result = await requestMissionFeedback({
      mission,
      choice,
      profile,
      iotSnapshot: iotParams,
    });
    setFeedback(result);
    setLoadingFeedback(false);
  };

  const handleRetryMission = () => {
    setSelectedChoice(null);
    setFeedback(null);
  };

  const handleNextMission = () => {
    if (activeIndex < MISSIONS.length - 1) {
      selectMission(activeIndex + 1);
    } else {
      onNavigate('logros');
    }
  };

  return (
    <div className="space-y-6">
      {/* Mission Selector Bar */}
      <section className="rounded-3xl bg-white border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
              Simulador Educativo de Misiones
            </h1>
            <p className="text-sm text-slate-600">
              Observa cada situación escolar, elige una decisión segura y descubre sus consecuencias con Guardi.
            </p>
          </div>
          <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
            {aiConnected ? (
              <>
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span>IA educativa conectada</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-amber-600" />
                <span>Modo local · Retroalimentación predeterminada</span>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {MISSIONS.map((m, idx) => {
            const isActive = idx === activeIndex;
            const stars = completedMissionStars[m.id] || 0;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => selectMission(idx)}
                className={`text-left rounded-2xl border p-3.5 transition-all focus-visible:outline-2 focus-visible:outline-sky-600 ${
                  isActive
                    ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-bold ${isActive ? 'text-sky-100' : 'text-sky-700'}`}>
                    Misión {m.number}
                  </span>
                  <div className="flex items-center gap-0.5" aria-label={`${stars} de 3 estrellas`}>
                    {[1, 2, 3].map((n) => (
                      <Star
                        key={n}
                        className={`w-3.5 h-3.5 ${
                          n <= stars
                            ? 'fill-amber-400 text-amber-400'
                            : isActive
                              ? 'text-sky-300'
                              : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-1 text-sm font-bold leading-snug">{m.title}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Active Mission Stage */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Illustrated Situation */}
        <div className="lg:col-span-5 rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm flex flex-col">
          <div className="relative aspect-[4/3] bg-sky-100">
            {!imgErrors[mission.id] ? (
              <img
                src={mission.imagePath}
                alt={mission.imageAlt}
                referrerPolicy="no-referrer"
                onError={() => setImgErrors((prev) => ({ ...prev, [mission.id]: true }))}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-sky-100 to-amber-50">
                <Cpu className="w-10 h-10 text-sky-600 mb-2" />
                <p className="font-display font-bold text-slate-800">{mission.title}</p>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/35 to-transparent p-4 text-white">
              <p className="text-xs text-sky-200 font-medium">{mission.technicalTopic}</p>
              <p className="text-sm font-bold mt-0.5">Misión {mission.number}: {mission.title}</p>
            </div>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-sm font-bold text-slate-900">Situación observada</h2>
              <p className="text-sm text-slate-700 leading-relaxed">{mission.situation}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-[11px] text-slate-500">Vehículos</p>
                <p className="font-mono text-sm font-bold text-slate-900 tabular-nums">
                  {mission.iotSnapshot.vehicleFlow}/min
                </p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500">Peatones</p>
                <p className="font-mono text-sm font-bold text-slate-900 tabular-nums">
                  {mission.iotSnapshot.pedestrianFlow}/min
                </p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500">En cebra</p>
                <p className="font-mono text-sm font-bold text-red-700 tabular-nums">
                  {mission.iotSnapshot.undueOccupation} autos
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Guardi Challenge + Choices / Feedback */}
        <div className="lg:col-span-7 rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col justify-between gap-5">
          {/* Guardi Prompt */}
          <div className="rounded-2xl bg-sky-50 border border-sky-200 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <GuardiAvatar size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-sky-800">Desafío de Guardi</p>
              <p className="mt-1 text-sm sm:text-base font-medium text-slate-800 leading-relaxed">
                {mission.guardiIntro}
              </p>
            </div>
            {!selectedChoice && (
              <button
                type="button"
                onClick={() => setShowHint((h) => !h)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-sky-200 text-sky-800 text-xs font-bold hover:bg-sky-100 transition-colors whitespace-nowrap shrink-0"
              >
                <Lightbulb className="w-4 h-4 text-amber-500" />
                {showHint ? 'Ocultar pista' : 'Pedir pista'}
              </button>
            )}
          </div>

          {showHint && !selectedChoice && (
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-950">
              <strong>Pista de Guardi:</strong> {mission.guardiHint}
            </div>
          )}

          {/* Decision Options */}
          {!selectedChoice ? (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">
                Elige tu decisión para resolver el reto:
              </h3>
              <div className="space-y-3">
                {mission.choices.map((choice, idx) => (
                  <button
                    key={choice.id}
                    type="button"
                    onClick={() => handleChooseOption(choice)}
                    className="w-full text-left rounded-2xl border border-slate-200 bg-slate-50 hover:bg-sky-50 hover:border-sky-300 p-4 transition-all flex items-start gap-3.5 focus-visible:outline-2 focus-visible:outline-sky-600"
                  >
                    <span className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-sky-700 font-display font-bold text-sm flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm sm:text-base font-bold text-slate-900">{choice.label}</p>
                      <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {choice.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Consequence & Pedagogical Feedback */
            <div className="space-y-4">
              {/* Outcome Banner */}
              <div
                className={`rounded-2xl border p-4 sm:p-5 space-y-3 ${
                  selectedChoice.isOptimal
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-amber-50 border-amber-200'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={`w-5 h-5 ${
                        selectedChoice.isOptimal ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    />
                    <span className="text-sm font-bold text-slate-900">
                      Consecuencia educativa simulada
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5" aria-label={`${selectedChoice.starsEarned} estrellas ganadas`}>
                      {[1, 2, 3].map((n) => (
                        <Star
                          key={n}
                          className={`w-5 h-5 ${
                            n <= selectedChoice.starsEarned
                              ? 'fill-amber-400 text-amber-500'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-mono text-sm font-bold text-sky-800 tabular-nums">
                      +{selectedChoice.pointsEarned} pts
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-800 leading-relaxed">{selectedChoice.simulatedOutcome}</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  <div className="rounded-xl bg-white/80 border border-slate-200/80 px-3 py-2 text-xs font-semibold text-slate-700">
                    {selectedChoice.impactSummary.pedestrianSafetyDelta}
                  </div>
                  <div className="rounded-xl bg-white/80 border border-slate-200/80 px-3 py-2 text-xs font-semibold text-slate-700">
                    {selectedChoice.impactSummary.congestionDelta}
                  </div>
                  <div className="rounded-xl bg-white/80 border border-slate-200/80 px-3 py-2 text-xs font-semibold text-slate-700">
                    {selectedChoice.impactSummary.sustainabilityDelta}
                  </div>
                </div>
              </div>

              {/* Guardi AI / Preset Feedback */}
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 sm:p-5 space-y-3">
                {loadingFeedback ? (
                  <p className="text-sm font-medium text-slate-600">
                    Guardi está analizando tu decisión...
                  </p>
                ) : feedback ? (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-sky-800">
                        {feedback.source === 'gemini-ai'
                          ? 'Retroalimentación con IA conectada'
                          : 'Retroalimentación pedagógica predeterminada'}
                      </span>
                      <span>{feedback.statusNote}</span>
                    </div>
                    <p className="text-base font-bold text-slate-900">“{feedback.guardiMessage}”</p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {feedback.pedagogicalExplanation}
                    </p>
                    <div className="rounded-xl bg-sky-50 border border-sky-200 p-3.5 text-sm text-sky-950">
                      <strong>¿Cómo aplicarlo en tu colegio?</strong> {feedback.schoolActionTip}
                    </div>
                  </>
                ) : null}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleRetryMission}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-800 text-sm font-semibold hover:bg-slate-200 transition-colors whitespace-nowrap"
                >
                  <RotateCcw className="w-4 h-4" />
                  Intentar otra decisión
                </button>
                <button
                  type="button"
                  onClick={handleNextMission}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-bold hover:bg-sky-700 transition-colors whitespace-nowrap"
                >
                  {activeIndex < MISSIONS.length - 1 ? 'Siguiente misión' : 'Ver Mis Logros'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
