import type { IoTMetrics, IoTParams } from '../types/mobility';

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function computeIoTMetrics(params: IoTParams): IoTMetrics {
  const { vehicleFlow, pedestrianFlow, undueOccupation, cyclists, activeGuardians } = params;

  // Educational simulation model (deterministic & transparent)
  const guardianBonus = activeGuardians * 4.5;
  const occupationPenalty = undueOccupation * 6.5;
  const vehiclePressure = vehicleFlow * 0.85;
  const pedestrianLoad = pedestrianFlow * 0.22;

  const pedestrianSafetyScore = Math.round(
    clamp(88 - occupationPenalty - vehiclePressure * 0.55 - pedestrianLoad * 0.2 + guardianBonus, 12, 99)
  );

  const fluidityScore = Math.round(
    clamp(94 - vehicleFlow * 1.15 - undueOccupation * 4.2 + activeGuardians * 2.5, 10, 98)
  );

  const activeTrips = pedestrianFlow + cyclists * 1.6;
  const totalTrips = Math.max(1, activeTrips + vehicleFlow * 1.4);
  const sustainabilityScore = Math.round(clamp((activeTrips / totalTrips) * 100, 15, 98));

  const riskIndex = Math.round(clamp(100 - pedestrianSafetyScore * 0.65 - fluidityScore * 0.35, 5, 95));

  if (riskIndex <= 32) {
    return {
      pedestrianSafetyScore,
      fluidityScore,
      sustainabilityScore,
      riskIndex,
      status: 'seguro',
      statusLabel: 'Nivel Seguro',
      statusExplanation:
        'La cebra está despejada, hay buen acompañamiento adulto y la velocidad simulada favorece a peatones y ciclistas.',
    };
  }

  if (riskIndex <= 62) {
    return {
      pedestrianSafetyScore,
      fluidityScore,
      sustainabilityScore,
      riskIndex,
      status: 'moderado',
      statusLabel: 'Atención Moderada',
      statusExplanation:
        'Se observa congestión parcial o vehículos mal estacionados. Sumar Guardianes y liberar la zona peatonal mejora el entorno.',
    };
  }

  return {
    pedestrianSafetyScore,
    fluidityScore,
    sustainabilityScore,
    riskIndex,
    status: 'alerta',
    statusLabel: 'Alerta de Congestión y Riesgo',
    statusExplanation:
      'Alta ocupación indebida o exceso de flujo vehicular en hora pico. Se requiere despejar la cebra y activar descenso ordenado.',
  };
}

export function buildSimulatedMqttPayload(params: IoTParams, metrics: IoTMetrics) {
  return {
    topic: 'redtic/cali/colegio-demo/movilidad/simulado',
    simulated: true,
    node: 'esp32-puerta-principal',
    visionMode: 'conteo-anonimo-sin-biometria',
    payload: {
      flujoVehicularMin: params.vehicleFlow,
      flujoPeatonalMin: params.pedestrianFlow,
      ocupacionIndebida: params.undueOccupation,
      ciclistasMin: params.cyclists,
      guardianesActivos: params.activeGuardians,
      indiceSeguridadPeatonal: metrics.pedestrianSafetyScore,
      estadoVial: metrics.statusLabel,
    },
  };
}
