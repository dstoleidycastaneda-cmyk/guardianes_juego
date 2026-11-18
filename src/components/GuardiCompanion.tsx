import React, { useState } from 'react';
import { HelpCircle, MessageCircle, Sparkles, X } from 'lucide-react';
import { ASSET_IMAGES, PROFILE_META } from '../data/mobilityData';
import type { AppView, UserProfile } from '../types/mobility';

interface GuardiAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function GuardiAvatar({ size = 'md', className = '' }: GuardiAvatarProps) {
  const [imgError, setImgError] = useState(false);

  const dims =
    size === 'sm' ? 'w-11 h-11' : size === 'lg' ? 'w-20 h-20 sm:w-24 sm:h-24' : 'w-14 h-14';

  return (
    <div
      className={`${dims} rounded-2xl overflow-hidden bg-sky-100 border border-sky-200 shrink-0 flex items-center justify-center shadow-sm ${className}`}
    >
      {!imgError ? (
        <img
          src={ASSET_IMAGES.guardiMascot}
          alt="Guardi, el robot amigable de la movilidad escolar"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <svg viewBox="0 0 64 64" className="w-full h-full p-1.5" aria-hidden="true">
          <rect x="14" y="16" width="36" height="32" rx="12" fill="#38BDF8" />
          <rect x="20" y="22" width="24" height="15" rx="6" fill="#0F172A" />
          <circle cx="27" cy="29" r="3" fill="#FACC15" />
          <circle cx="37" cy="29" r="3" fill="#FACC15" />
          <path d="M27 34 Q32 37 37 34" stroke="#FACC15" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M32 16 L32 8" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="36" cy="8" rx="6" ry="3.5" fill="#22C55E" />
        </svg>
      )}
    </div>
  );
}

interface GuardiSpeechCardProps {
  title?: string;
  message: string;
  tone?: 'sky' | 'emerald' | 'amber';
  actionLabel?: string;
  onAction?: () => void;
}

export function GuardiSpeechCard({
  title = 'Guardi te acompaña',
  message,
  tone = 'sky',
  actionLabel,
  onAction,
}: GuardiSpeechCardProps) {
  const toneClasses =
    tone === 'emerald'
      ? 'bg-emerald-50/90 border-emerald-200 text-slate-900'
      : tone === 'amber'
        ? 'bg-amber-50/90 border-amber-200 text-slate-900'
        : 'bg-sky-50/90 border-sky-200 text-slate-900';

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 ${toneClasses}`}
    >
      <GuardiAvatar size="md" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold tracking-wide text-sky-800">{title}</p>
        <p className="mt-1 text-sm sm:text-base font-medium leading-relaxed text-slate-800">{message}</p>
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-4 py-2.5 rounded-xl bg-white border border-sky-200 text-sky-800 text-sm font-semibold hover:bg-sky-100 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

interface GuardiFloatingHelperProps {
  currentView: AppView;
  profile: UserProfile;
  onNavigate: (view: AppView) => void;
}

const VIEW_GUIDES: Record<AppView, { title: string; tip: string; nextLabel: string; nextView: AppView }> = {
  inicio: {
    title: '¿Cómo empezar?',
    tip: 'Elige una tarjeta de aventura: puedes explorar la ciudad escolar en el Monitor IoT o jugar una misión para ganar estrellas.',
    nextLabel: 'Ir a Misiones IA',
    nextView: 'misiones',
  },
  monitor: {
    title: 'Guía del Monitor IoT',
    tip: 'Mueve los controles o elige un escenario. Observa cómo cambia la cebra escolar cuando suben la ocupación indebida o los Guardianes.',
    nextLabel: 'Probar una Misión',
    nextView: 'misiones',
  },
  misiones: {
    title: 'Consejo para tu misión',
    tip: 'Lee con calma la situación, usa "Pedir pista" si tienes dudas y elige la opción que mejor proteja a los peatones.',
    nextLabel: 'Ver Mis Logros',
    nextView: 'logros',
  },
  guardianes: {
    title: 'Participación segura',
    tip: 'Los adultos acompañan los cruces en turnos voluntarios; los estudiantes suman compromisos sin exponerse al tráfico vehicular.',
    nextLabel: 'Explorar Monitor IoT',
    nextView: 'monitor',
  },
  logros: {
    title: 'Tu progreso educativo',
    tip: 'Aquí ves tus insignias, puntos y cómo aplicar lo aprendido en tu colegio. ¡Cada misión completada suma al cambio!',
    nextLabel: 'Volver al Inicio',
    nextView: 'inicio',
  },
};

export function GuardiFloatingHelper({
  currentView,
  profile,
  onNavigate,
}: GuardiFloatingHelperProps) {
  const [open, setOpen] = useState(false);
  const guide = VIEW_GUIDES[currentView];
  const profileInfo = PROFILE_META[profile];

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
      {open && (
        <div
          role="dialog"
          aria-label="Guía rápida de Guardi"
          className="w-80 max-w-[calc(100vw-2rem)] rounded-2xl bg-white border border-slate-200 shadow-xl p-4 text-slate-900"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <GuardiAvatar size="sm" />
              <div>
                <p className="text-sm font-bold text-slate-900">{guide.title}</p>
                <p className="text-xs text-slate-500">Perfil: {profileInfo.title}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar ayuda de Guardi"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-sky-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="mt-3 text-sm text-slate-700 leading-relaxed">{guide.tip}</p>
          <p className="mt-2 text-xs text-sky-800 bg-sky-50 rounded-xl p-2.5 leading-relaxed">
            {profileInfo.focusTip}
          </p>
          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                onNavigate(guide.nextView);
                setOpen(false);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700 transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {guide.nextLabel}
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-sky-600 text-white shadow-lg hover:bg-sky-700 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
      >
        {open ? <MessageCircle className="w-5 h-5" /> : <HelpCircle className="w-5 h-5" />}
        <span className="text-sm font-semibold whitespace-nowrap">
          {open ? 'Ocultar a Guardi' : 'Ayuda de Guardi'}
        </span>
      </button>
    </div>
  );
}
