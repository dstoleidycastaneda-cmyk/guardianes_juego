import React, { useEffect, useState } from 'react';
import { Accessibility, Menu, Play, X } from 'lucide-react';
import { AchievementsPanel } from './components/AchievementsPanel';
import { GuardiFloatingHelper } from './components/GuardiCompanion';
import { GuardiansCommunity } from './components/GuardiansCommunity';
import { HomeHub } from './components/HomeHub';
import { IoTMonitor } from './components/IoTMonitor';
import { MissionSimulator } from './components/MissionSimulator';
import {
  EDUCATIONAL_BADGES,
  INITIAL_PLEDGES,
  INITIAL_RECOGNITIONS,
  INITIAL_SHIFTS,
  IOT_SCENARIOS,
} from './data/mobilityData';
import { checkAiConnectionStatus } from './services/aiSimulator';
import type {
  AppView,
  IoTParams,
  Mission,
  MissionChoice,
  RecognitionMessage,
  UserProfile,
  VolunteerShift,
} from './types/mobility';

const NAV_ITEMS: Array<{ id: AppView; label: string }> = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'monitor', label: 'Monitor IoT' },
  { id: 'misiones', label: 'Misiones IA' },
  { id: 'guardianes', label: 'Guardianes' },
  { id: 'logros', label: 'Mis Logros' },
];

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('inicio');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>('Estudiante');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [aiConnected, setAiConnected] = useState(false);

  // IoT Monitor State
  const [activeScenarioId, setActiveScenarioId] = useState<string>(IOT_SCENARIOS[1].id);
  const [iotParams, setIotParams] = useState<IoTParams>(IOT_SCENARIOS[1].params);

  // Mission Progress State
  const [completedMissionStars, setCompletedMissionStars] = useState<Record<string, number>>({});
  const [missionPoints, setMissionPoints] = useState<Record<string, number>>({});

  // Community Participation State
  const [shifts, setShifts] = useState<VolunteerShift[]>(INITIAL_SHIFTS);
  const [joinedPledgeIds, setJoinedPledgeIds] = useState<string[]>([]);
  const [recognitions, setRecognitions] = useState<RecognitionMessage[]>(INITIAL_RECOGNITIONS);

  useEffect(() => {
    checkAiConnectionStatus().then(setAiConnected);
  }, []);

  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  const handleSelectScenario = (scenarioId: string, params: IoTParams) => {
    setActiveScenarioId(scenarioId);
    setIotParams(params);
  };

  const handleCompleteMission = (mission: Mission, choice: MissionChoice) => {
    setCompletedMissionStars((prev) => ({
      ...prev,
      [mission.id]: Math.max(prev[mission.id] || 0, choice.starsEarned),
    }));
    setMissionPoints((prev) => ({
      ...prev,
      [mission.id]: Math.max(prev[mission.id] || 0, choice.pointsEarned),
    }));
  };

  const handleToggleShift = (shiftId: string) => {
    setShifts((prev) =>
      prev.map((s) =>
        s.id === shiftId ? { ...s, reservedByMe: !s.reservedByMe } : s
      )
    );
  };

  const handleTogglePledge = (pledgeId: string) => {
    setJoinedPledgeIds((prev) =>
      prev.includes(pledgeId) ? prev.filter((id) => id !== pledgeId) : [...prev, pledgeId]
    );
  };

  const handleAddRecognition = (message: string) => {
    const newItem: RecognitionMessage = {
      id: `rec-${Date.now()}`,
      author: `Participante (${profile})`,
      role: 'Comunidad Escolar',
      message,
      timeAgo: 'Justo ahora',
    };
    setRecognitions((prev) => [newItem, ...prev]);
  };

  const totalMissionPoints = Object.values(missionPoints).reduce((a, b) => a + b, 0);
  const pledgePoints = joinedPledgeIds.length * 30;
  const totalPoints = totalMissionPoints + pledgePoints;
  const totalStars = Object.values(completedMissionStars).reduce((a, b) => a + b, 0);
  const completedMissionIds = Object.keys(completedMissionStars);
  const unlockedBadgesCount = EDUCATIONAL_BADGES.filter(
    (b) => (completedMissionStars[b.missionId] || 0) >= 2
  ).length;

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 text-slate-900 ${reducedMotion ? 'reduced-motion' : ''}`}>
      {/* Clean 3-Zone Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => handleNavigate('inicio')}
            className="font-display text-lg sm:text-xl font-extrabold tracking-tight text-sky-700 hover:text-sky-800 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
          >
            Guardianes Movilidad
          </button>

          {/* Zone 2: 5 concise single-line text nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold" aria-label="Navegación principal">
            {NAV_ITEMS.map((item) => {
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`py-1.5 border-b-2 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 ${
                    active
                      ? 'border-sky-600 text-sky-700'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary CTA + Mobile Menu Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleNavigate('misiones')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs sm:text-sm font-bold hover:bg-sky-700 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Jugar Misión
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-expanded={mobileMenuOpen}
              aria-label="Abrir menú de navegación"
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-sky-600"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <nav
            className="md:hidden border-t border-slate-200 bg-white px-4 py-3 grid grid-cols-2 gap-2"
            aria-label="Menú móvil"
          >
            {NAV_ITEMS.map((item) => {
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-semibold text-left ${
                    active ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        )}
      </header>

      {/* Workspace Accessibility & Context Toolbar (below header) */}
      <div className="bg-slate-100/80 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2 text-slate-600">
            <span className="font-semibold text-slate-800">Perfil: {profile}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums font-semibold text-sky-800">{totalPoints} pts</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums font-semibold text-amber-700">{totalStars} estrellas</span>
          </div>

          <button
            type="button"
            onClick={() => setReducedMotion((r) => !r)}
            aria-pressed={reducedMotion}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-sky-600 ${
              reducedMotion
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Accessibility className="w-3.5 h-3.5" />
            {reducedMotion ? 'Animaciones reducidas: Sí' : 'Reducir animaciones'}
          </button>
        </div>
      </div>

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentView === 'inicio' && (
          <HomeHub
            profile={profile}
            onChangeProfile={setProfile}
            onNavigate={handleNavigate}
            totalPoints={totalPoints}
            totalStars={totalStars}
            completedMissionIds={completedMissionIds}
            unlockedBadgesCount={unlockedBadgesCount}
          />
        )}

        {currentView === 'monitor' && (
          <IoTMonitor
            params={iotParams}
            onChangeParams={setIotParams}
            activeScenarioId={activeScenarioId}
            onSelectScenario={handleSelectScenario}
            profile={profile}
            reducedMotion={reducedMotion}
          />
        )}

        {currentView === 'misiones' && (
          <MissionSimulator
            profile={profile}
            aiConnected={aiConnected}
            iotParams={iotParams}
            completedMissionStars={completedMissionStars}
            onCompleteMission={handleCompleteMission}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'guardianes' && (
          <GuardiansCommunity
            profile={profile}
            shifts={shifts}
            onToggleShift={handleToggleShift}
            pledges={INITIAL_PLEDGES}
            joinedPledgeIds={joinedPledgeIds}
            onTogglePledge={handleTogglePledge}
            recognitions={recognitions}
            onAddRecognition={handleAddRecognition}
          />
        )}

        {currentView === 'logros' && (
          <AchievementsPanel
            profile={profile}
            totalPoints={totalPoints}
            totalStars={totalStars}
            completedMissionStars={completedMissionStars}
            joinedPledgesCount={joinedPledgeIds.length}
            currentIoTParams={iotParams}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
          <p className="font-semibold text-slate-800">
            Guardianes Edu-Tecnológicos de la Movilidad Escolar: pequeñas acciones, grandes cambios en la movilidad escolar.
          </p>
          <p>Red TIC Cali, Colombia · Demostración educativa con datos simulados</p>
        </div>
      </footer>

      {/* Non-intrusive Guardi Companion Bubble */}
      <GuardiFloatingHelper
        currentView={currentView}
        profile={profile}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
