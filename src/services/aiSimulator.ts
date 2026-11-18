import type { FeedbackResponse, IoTParams, Mission, MissionChoice, UserProfile } from '../types/mobility';

export async function checkAiConnectionStatus(): Promise<boolean> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data?.aiConnected);
  } catch {
    return false;
  }
}

export async function requestMissionFeedback(args: {
  mission: Mission;
  choice: MissionChoice;
  profile: UserProfile;
  iotSnapshot: IoTParams;
}): Promise<FeedbackResponse> {
  const { mission, choice, profile, iotSnapshot } = args;

  try {
    const response = await fetch('/api/simulator/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        missionTitle: mission.title,
        missionContext: mission.situation,
        optionLabel: choice.label,
        optionOutcome: choice.simulatedOutcome,
        isBestChoice: choice.isOptimal,
        profile,
        iotSnapshot,
      }),
    });

    if (!response.ok) {
      return {
        source: 'preset-fallback',
        statusNote:
          'Servicio de IA no conectado en este momento. Mostrando retroalimentación pedagógica predeterminada.',
        guardiMessage: choice.defaultFeedback.guardiMessage,
        pedagogicalExplanation: choice.defaultFeedback.pedagogicalExplanation,
        schoolActionTip: choice.defaultFeedback.schoolActionTip,
      };
    }

    const data = await response.json();
    if (data?.connected && data?.feedback) {
      return {
        source: 'gemini-ai',
        statusNote: 'Retroalimentación generada por el servicio educativo de IA conectado.',
        guardiMessage: data.feedback.guardiMessage || choice.defaultFeedback.guardiMessage,
        pedagogicalExplanation:
          data.feedback.pedagogicalExplanation || choice.defaultFeedback.pedagogicalExplanation,
        schoolActionTip: data.feedback.schoolActionTip || choice.defaultFeedback.schoolActionTip,
      };
    }
  } catch {
    // Graceful fallback when running statically (e.g. Netlify static build) or offline
  }

  return {
    source: 'preset-fallback',
    statusNote:
      'Modo sin conexión a servicio de IA. Mostrando retroalimentación pedagógica predeterminada del simulador.',
    guardiMessage: choice.defaultFeedback.guardiMessage,
    pedagogicalExplanation: choice.defaultFeedback.pedagogicalExplanation,
    schoolActionTip: choice.defaultFeedback.schoolActionTip,
  };
}
