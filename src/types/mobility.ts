export type UserProfile = 'Estudiante' | 'Acudiente' | 'Docente' | 'Directivo';

export type AppView = 'inicio' | 'monitor' | 'misiones' | 'guardianes' | 'logros';

export interface IoTParams {
  vehicleFlow: number; // veh/min (2 - 45)
  pedestrianFlow: number; // est/min (5 - 80)
  undueOccupation: number; // vehiculos en zona prohibida (0 - 12)
  cyclists: number; // bicis/min (0 - 35)
  activeGuardians: number; // voluntarios (0 - 10)
}

export interface IoTScenario {
  id: string;
  name: string;
  shortLabel: string;
  description: string;
  timeWindow: string;
  params: IoTParams;
}

export type RiskStatus = 'seguro' | 'moderado' | 'alerta';

export interface IoTMetrics {
  pedestrianSafetyScore: number; // 0 - 100
  fluidityScore: number; // 0 - 100
  sustainabilityScore: number; // 0 - 100
  riskIndex: number; // 0 - 100
  status: RiskStatus;
  statusLabel: string;
  statusExplanation: string;
}

export interface IoTHistoryPoint {
  tick: string;
  safety: number;
  congestion: number;
}

export interface MissionChoice {
  id: string;
  label: string;
  description: string;
  isOptimal: boolean;
  starsEarned: 1 | 2 | 3;
  pointsEarned: number;
  simulatedOutcome: string;
  impactSummary: {
    pedestrianSafetyDelta: string;
    congestionDelta: string;
    sustainabilityDelta: string;
  };
  defaultFeedback: {
    guardiMessage: string;
    pedagogicalExplanation: string;
    schoolActionTip: string;
  };
}

export interface Mission {
  id: string;
  number: number;
  title: string;
  technicalTopic: string;
  imagePath: string;
  imageAlt: string;
  situation: string;
  guardiIntro: string;
  guardiHint: string;
  iotSnapshot: IoTParams;
  badgeId: string;
  choices: MissionChoice[];
}

export interface FeedbackResponse {
  source: 'gemini-ai' | 'preset-fallback';
  statusNote: string;
  guardiMessage: string;
  pedagogicalExplanation: string;
  schoolActionTip: string;
}

export interface EducationalBadge {
  id: string;
  name: string;
  description: string;
  missionId: string;
  accentColor: 'sky' | 'emerald' | 'amber' | 'orange';
}

export interface VolunteerShift {
  id: string;
  day: string;
  slot: string;
  zone: string;
  assignedName: string;
  role: 'Acudiente' | 'Docente';
  reservedByMe?: boolean;
}

export interface CommunityPledge {
  id: string;
  title: string;
  audience: 'Estudiantes' | 'Acudientes' | 'Docentes';
  description: string;
  supportersCount: number;
  points: number;
}

export interface RecognitionMessage {
  id: string;
  author: string;
  role: string;
  message: string;
  timeAgo: string;
}
