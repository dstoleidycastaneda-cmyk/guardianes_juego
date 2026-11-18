import React, { useState } from 'react';
import {
  Calendar,
  Check,
  HeartHandshake,
  MessageSquareHeart,
  Send,
  Shield,
  Users,
} from 'lucide-react';
import type {
  CommunityPledge,
  RecognitionMessage,
  UserProfile,
  VolunteerShift,
} from '../types/mobility';
import { GuardiSpeechCard } from './GuardiCompanion';

interface GuardiansCommunityProps {
  profile: UserProfile;
  shifts: VolunteerShift[];
  onToggleShift: (shiftId: string) => void;
  pledges: CommunityPledge[];
  joinedPledgeIds: string[];
  onTogglePledge: (pledgeId: string) => void;
  recognitions: RecognitionMessage[];
  onAddRecognition: (message: string) => void;
}

export function GuardiansCommunity({
  profile,
  shifts,
  onToggleShift,
  pledges,
  joinedPledgeIds,
  onTogglePledge,
  recognitions,
  onAddRecognition,
}: GuardiansCommunityProps) {
  const [noteInput, setNoteInput] = useState('');

  const totalSupporters = pledges.reduce(
    (acc, p) => acc + p.supportersCount + (joinedPledgeIds.includes(p.id) ? 1 : 0),
    0
  );
  const coveredShifts = shifts.filter((s) => !s.assignedName.startsWith('Disponible') || s.reservedByMe).length;

  const handlePostNote = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = noteInput.trim();
    if (!trimmed) return;
    onAddRecognition(trimmed);
    setNoteInput('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Safe Participation Principle */}
      <section className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
              Guardianes de la Movilidad Escolar
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Estudiantes, acudientes y docentes colaboramos juntos. Los adultos acompañan los cruces en turnos
              voluntarios, y los estudiantes lideran el ejemplo sin exponerse nunca al tráfico vehicular.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 shrink-0">
            <div>
              <p className="text-xs text-emerald-800">Compromisos</p>
              <p className="font-mono text-2xl font-bold text-emerald-900 tabular-nums">{totalSupporters}</p>
            </div>
            <div>
              <p className="text-xs text-emerald-800">Turnos activos</p>
              <p className="font-mono text-2xl font-bold text-emerald-900 tabular-nums">
                {coveredShifts}/{shifts.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-emerald-800">Mis aportes</p>
              <p className="font-mono text-2xl font-bold text-emerald-900 tabular-nums">
                {joinedPledgeIds.length}
              </p>
            </div>
          </div>
        </div>

        {/* Visual Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-sky-50 border border-sky-200 p-4 flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-sky-600 text-white flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Estudiantes Guardianes</h2>
              <p className="mt-1 text-xs text-slate-700 leading-relaxed">
                Usan la cebra, promueven el casco en bici y cumplen retos dentro del plantel y el andén seguro.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Acudientes Voluntarios</h2>
              <p className="mt-1 text-xs text-slate-700 leading-relaxed">
                Visten chaleco reflectivo en turnos cortos de ingreso y salida para cuidar el paso peatonal.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Docentes y Directivos</h2>
              <p className="mt-1 text-xs text-slate-700 leading-relaxed">
                Orientan pedagógicamente los retos de aula, organizan puntos de encuentro y cuidan la cultura vial.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Mobility Pledges */}
        <section className="lg:col-span-7 rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900">
              Compromisos de Movilidad Segura
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Elige los compromisos que quieres practicar en tu colegio (ganas +{pledges[0]?.points} puntos educativos por cada uno).
            </p>
          </div>

          <div className="space-y-3">
            {pledges.map((pledge) => {
              const joined = joinedPledgeIds.includes(pledge.id);
              const count = pledge.supportersCount + (joined ? 1 : 0);
              return (
                <div
                  key={pledge.id}
                  className={`rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                    joined ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-sky-800">Para {pledge.audience}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{count} apoyos simulados</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">{pledge.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600">{pledge.description}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onTogglePledge(pledge.id)}
                    aria-pressed={joined}
                    className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-sky-600 ${
                      joined
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-white border border-slate-300 text-slate-800 hover:bg-sky-50 hover:border-sky-300'
                    }`}
                  >
                    {joined && <Check className="w-4 h-4" />}
                    {joined ? 'Compromiso activo' : 'Me comprometo'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Simulated Volunteer Shifts & Recognition Wall */}
        <div className="lg:col-span-5 space-y-6">
          <section className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-sky-600" />
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">
                  Turnos voluntarios simulados
                </h2>
                <p className="text-xs text-slate-500">
                  Exclusivo para adultos (acudientes y docentes) · Sin datos personales reales
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {shifts.map((shift) => {
                const isOpen = shift.assignedName.startsWith('Disponible');
                const canReserve = profile === 'Acudiente' || profile === 'Docente' || profile === 'Directivo';
                return (
                  <div
                    key={shift.id}
                    className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-sky-800">
                        {shift.day} · {shift.slot}
                      </p>
                      <p className="text-sm font-bold text-slate-900 truncate">{shift.zone}</p>
                      <p className="text-xs text-slate-600 truncate">
                        {shift.reservedByMe
                          ? `Reservado en demostración (${profile})`
                          : shift.assignedName}
                      </p>
                    </div>
                    {(isOpen || shift.reservedByMe) && (
                      <button
                        type="button"
                        onClick={() => onToggleShift(shift.id)}
                        disabled={!canReserve && !shift.reservedByMe}
                        title={
                          canReserve
                            ? 'Simular reserva de turno adulto'
                            : 'Cambia al perfil Acudiente o Docente para simular un turno adulto'
                        }
                        className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-colors ${
                          shift.reservedByMe
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : canReserve
                              ? 'bg-sky-600 text-white hover:bg-sky-700'
                              : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        {shift.reservedByMe ? 'Liberar turno' : 'Simular apoyo'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            {profile === 'Estudiante' && (
              <p className="text-xs text-slate-500">
                Nota: Los turnos en vía son solo para adultos. Como Estudiante puedes sumar compromisos seguros a la izquierda.
              </p>
            )}
          </section>

          <section className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquareHeart className="w-5 h-5 text-orange-500" />
              <h2 className="font-display text-lg font-bold text-slate-900">
                Mensajes de reconocimiento
              </h2>
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {recognitions.map((rec) => (
                <div key={rec.id} className="rounded-2xl bg-amber-50/70 border border-amber-200 p-3.5">
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-600">
                    <span className="font-bold text-slate-900">{rec.author}</span>
                    <span>{rec.timeAgo}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-800 leading-relaxed">{rec.message}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handlePostNote} className="flex items-center gap-2">
              <label htmlFor="recognition-input" className="sr-only">
                Escribe un mensaje positivo de movilidad escolar
              </label>
              <input
                id="recognition-input"
                type="text"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                maxLength={140}
                placeholder="Agradece una buena acción en tu colegio..."
                className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-bold hover:bg-sky-700 transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
                Enviar
              </button>
            </form>
          </section>
        </div>
      </div>

      <GuardiSpeechCard
        title="Guardi celebra el trabajo en equipo"
        tone="emerald"
        message="Cuando estudiantes, familias y profes nos cuidamos mutuamente, llegar al colegio se vuelve un momento alegre y seguro para todos."
      />
    </div>
  );
}
