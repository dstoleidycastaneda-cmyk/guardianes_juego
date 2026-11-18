import React, { useState } from 'react';
import {
  Award,
  Compass,
  Cpu,
  Gamepad2,
  Play,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react';
import { ASSET_IMAGES, MISSIONS, PROFILE_META } from '../data/mobilityData';
import type { AppView, UserProfile } from '../types/mobility';
import { GuardiAvatar } from './GuardiCompanion';

interface HomeHubProps {
  profile: UserProfile;
  onChangeProfile: (profile: UserProfile) => void;
  onNavigate: (view: AppView) => void;
  totalPoints: number;
  totalStars: number;
  completedMissionIds: string[];
  unlockedBadgesCount: number;
}

const PROFILES: UserProfile[] = ['Estudiante', 'Acudiente', 'Docente', 'Directivo'];

export function HomeHub({
  profile,
  onChangeProfile,
  onNavigate,
  totalPoints,
  totalStars,
  completedMissionIds,
  unlockedBadgesCount,
}: HomeHubProps) {
  const [heroImgError, setHeroImgError] = useState(false);
  const activeProfileMeta = PROFILE_META[profile];

  const moduleCards: Array<{
    id: AppView;
    step: string;
    title: string;
    technicalName: string;
    description: string;
    cta: string;
    icon: React.ReactNode;
    surfaceClass: string;
    iconBgClass: string;
  }> = [
    {
      id: 'monitor',
      step: '01',
      title: 'Explora mi colegio',
      technicalName: 'Monitor inteligente IoT · ESP32 y visión artificial simulada',
      description:
        'Observa en una ciudad escolar interactiva cómo cambian el tráfico, la cebra y los ciclistas al ajustar controles y escenarios.',
      cta: 'Abrir monitor escolar',
      icon: <Cpu className="w-6 h-6" />,
      surfaceClass: 'bg-sky-50/70 border-sky-200 hover:border-sky-400',
      iconBgClass: 'bg-sky-600 text-white',
    },
    {
      id: 'misiones',
      step: '02',
      title: '¡Toma la mejor decisión!',
      technicalName: 'Simulador educativo con IA · Misiones interactivas',
      description:
        'Supera 4 misiones reales frente al colegio, analiza consecuencias con Guardi y gana estrellas por cada acción responsable.',
      cta: 'Jugar misiones',
      icon: <Gamepad2 className="w-6 h-6" />,
      surfaceClass: 'bg-amber-50/70 border-amber-200 hover:border-amber-400',
      iconBgClass: 'bg-amber-500 text-slate-950',
    },
    {
      id: 'guardianes',
      step: '03',
      title: 'Somos Guardianes',
      technicalName: 'Guardianes de la movilidad · Participación comunitaria',
      description:
        'Únete a compromisos estudiantiles seguros, explora turnos voluntarios de acudientes y comparte mensajes positivos.',
      cta: 'Ver comunidad',
      icon: <Users className="w-6 h-6" />,
      surfaceClass: 'bg-emerald-50/70 border-emerald-200 hover:border-emerald-400',
      iconBgClass: 'bg-emerald-600 text-white',
    },
    {
      id: 'logros',
      step: '04',
      title: 'Mis logros',
      technicalName: 'Resultados y reconocimientos · Panel de aprendizaje',
      description:
        'Consulta tus puntos, insignias educativas, comparación de escenarios simulados y consejos para tu colegio.',
      cta: 'Ver mis logros',
      icon: <Award className="w-6 h-6" />,
      surfaceClass: 'bg-orange-50/70 border-orange-200 hover:border-orange-400',
      iconBgClass: 'bg-orange-500 text-white',
    },
  ];

  return (
    <div className="space-y-10">
      {/* Hero Adventure Split */}
      <section className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-sky-700">
                <span>Red TIC Cali, Colombia</span>
                <span aria-hidden="true">·</span>
                <span>Hackatón Educativa de Movilidad Escolar</span>
                <span aria-hidden="true">·</span>
                <span>Entorno 100% simulado</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-slate-900 leading-[1.12] [text-wrap:balance]">
                Guardianes Edu-Tecnológicos de la Movilidad Escolar
              </h1>

              <p className="text-base sm:text-lg font-semibold text-sky-700">
                “Pequeñas acciones, grandes cambios en la movilidad escolar”.
              </p>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                Los estudiantes pueden ser parte de la solución y no del problema. Explora sensores simulados,
                toma decisiones responsables y construye un entorno escolar más seguro para peatones y ciclistas.
              </p>
            </div>

            {/* Guardi Welcome Box */}
            <div className="rounded-2xl bg-sky-50 border border-sky-200 p-4 flex items-start gap-4">
              <GuardiAvatar size="md" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-sky-800">
                  Guardi te da la bienvenida · Perfil {activeProfileMeta.title}
                </p>
                <p className="mt-1 text-sm text-slate-800 leading-relaxed">
                  “{activeProfileMeta.guardiGreeting}”
                </p>
              </div>
            </div>

            {/* Primary Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('misiones')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-sky-600 text-white text-base font-bold hover:bg-sky-700 transition-colors shadow-sm whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
              >
                <Play className="w-5 h-5 fill-current" />
                ¡Empezar una Misión!
              </button>
              <button
                type="button"
                onClick={() => onNavigate('monitor')}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white border border-slate-300 text-slate-800 text-sm sm:text-base font-semibold hover:bg-slate-100 transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
              >
                <Compass className="w-5 h-5 text-sky-600" />
                Explorar Monitor IoT
              </button>
            </div>
          </div>

          {/* Illustrated Cali School Campus */}
          <div className="lg:col-span-5 relative min-h-[260px] sm:min-h-[340px] bg-sky-100">
            {!heroImgError ? (
              <img
                src={ASSET_IMAGES.heroSchool}
                alt="Ilustración educativa de un colegio en Cali con paso peatonal, bus escolar, ciclorruta y Guardianes"
                referrerPolicy="no-referrer"
                onError={() => setHeroImgError(true)}
                className="w-full h-full lg:absolute lg:inset-0 object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-sky-100 via-emerald-50 to-amber-50">
                <ShieldCheck className="w-12 h-12 text-sky-600 mb-3" />
                <p className="font-display font-bold text-slate-800">Entorno Escolar Seguro en Cali</p>
                <p className="text-sm text-slate-600 mt-1">Cebra peatonal, ciclorruta y transporte escolar</p>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/35 to-transparent p-5 text-white">
              <p className="text-xs font-medium text-sky-200">Escenario educativo interactivo</p>
              <p className="text-sm font-semibold mt-0.5">
                Ingreso escolar seguro: peatones, bicicletas y acudientes en equipo
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Selector & Adventure Progress Strip */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <div className="lg:col-span-7 rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 flex flex-col justify-between gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Elige tu perfil de experiencia</h2>
              <p className="text-xs text-slate-500">
                Sin registro ni datos personales · Adapta los mensajes de Guardi y recomendaciones
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="group" aria-label="Selector de perfil">
            {PROFILES.map((item) => {
              const active = profile === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => onChangeProfile(item)}
                  aria-pressed={active}
                  className={`px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 ${
                    active
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-slate-600">{activeProfileMeta.focusTip}</p>
        </div>

        <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 grid grid-cols-3 gap-3 items-center">
          <div>
            <p className="text-xs text-slate-500">Puntos</p>
            <p className="mt-1 font-mono text-2xl font-bold text-sky-700 tabular-nums">{totalPoints}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Estrellas</p>
            <p className="mt-1 font-mono text-2xl font-bold text-amber-600 tabular-nums inline-flex items-center gap-1">
              {totalStars}
              <Star className="w-5 h-5 fill-amber-400 text-amber-500" aria-hidden="true" />
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Misiones · Insignias</p>
            <p className="mt-1 font-mono text-xl font-bold text-emerald-700 tabular-nums">
              {completedMissionIds.length}/{MISSIONS.length} · {unlockedBadgesCount}/4
            </p>
          </div>
        </div>
      </section>

      {/* 4 Adventure Modules */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
              Centro de Aventuras Educativas
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Elige por dónde empezar. Cada actividad combina aprendizaje ciudadano y tecnología escolar.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {moduleCards.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => onNavigate(card.id)}
              className={`group text-left rounded-3xl border p-6 transition-all flex flex-col justify-between gap-5 shadow-sm hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 ${card.surfaceClass}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${card.iconBgClass}`}>
                    {card.icon}
                  </div>
                  <span className="font-mono text-xs font-semibold text-slate-500 tabular-nums">
                    Módulo {card.step}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-sky-800 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">{card.technicalName}</p>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{card.description}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-900/10">
                <span className="text-sm font-bold text-slate-900">{card.cta}</span>
                <span className="text-sm font-bold text-sky-700 group-hover:translate-x-1 transition-transform">
                  Entrar →
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
