import type {
  CommunityPledge,
  EducationalBadge,
  IoTScenario,
  Mission,
  RecognitionMessage,
  UserProfile,
  VolunteerShift,
} from '../types/mobility';

export const ASSET_IMAGES = {
  heroSchool: '/src/assets/images/hero_school_cali_1795020842307.jpg',
  guardiMascot: '/src/assets/images/guardi_robot_mascot_1795020842360.jpg',
  missionCrosswalk: '/src/assets/images/mission_crosswalk_scene_1795020842340.jpg',
  missionBikeLane: '/src/assets/images/mission_bike_lane_1795020843185.jpg',
} as const;

export const PROFILE_META: Record<
  UserProfile,
  {
    title: string;
    subtitle: string;
    guardiGreeting: string;
    focusTip: string;
  }
> = {
  Estudiante: {
    title: 'Estudiante',
    subtitle: 'Aprende jugando con misiones y retos seguros',
    guardiGreeting:
      '¡Hola! Soy Guardi. ¿Me ayudas a mejorar la movilidad de nuestro colegio? Elige una misión o explora cómo se mueve nuestro entorno.',
    focusTip:
      'Recuerda: los estudiantes cuidamos la movilidad desde el andén, la cebra y la bici, sin dirigir el tráfico de la calle.',
  },
  Acudiente: {
    title: 'Acudiente',
    subtitle: 'Buenas prácticas de llegada y turnos voluntarios',
    guardiGreeting:
      '¡Bienvenido, acudiente! Con pequeñas acciones al dejar o recoger a los estudiantes podemos proteger cada paso peatonal.',
    focusTip:
      'Detenerse en zonas autorizadas y respetar la cebra reduce hasta un 60% los puntos de riesgo en el ingreso escolar.',
  },
  Docente: {
    title: 'Docente',
    subtitle: 'Orientación pedagógica y análisis simulado de aula',
    guardiGreeting:
      '¡Hola, profe! Aquí tienes escenarios simulados de IoT y misiones de cultura ciudadana para trabajar con tu grupo en clase.',
    focusTip:
      'Cada decisión en el simulador conecta educación vial, pensamiento sistémico y tecnología ESP32/MQTT sin recopilar datos de menores.',
  },
  Directivo: {
    title: 'Directivo',
    subtitle: 'Indicadores simulados y gestión comunitaria del plantel',
    guardiGreeting:
      '¡Saludos! Explora cómo la organización de horarios, la señalización y las brigadas adultas transforman el acceso escolar.',
    focusTip:
      'Los indicadores mostrados son simulaciones educativas diseñadas para planear campañas escolares y futuras integraciones IoT.',
  },
};

export const IOT_SCENARIOS: IoTScenario[] = [
  {
    id: 'hora-pico',
    name: 'Hora pico desordenada',
    shortLabel: 'Hora pico crítica',
    description:
      'Muchos carros llegan al mismo tiempo, varios estacionan sobre la cebra y hay pocos adultos acompañando.',
    timeWindow: '6:50 AM · Ingreso escolar',
    params: {
      vehicleFlow: 38,
      pedestrianFlow: 62,
      undueOccupation: 9,
      cyclists: 6,
      activeGuardians: 1,
    },
  },
  {
    id: 'ingreso-guardianes',
    name: 'Ingreso organizado con Guardianes',
    shortLabel: 'Ingreso organizado',
    description:
      'Acudientes voluntarios acompañan el cruce peatonal, los vehículos avanzan en fila ordenada y la cebra queda libre.',
    timeWindow: '6:50 AM · Con brigada activa',
    params: {
      vehicleFlow: 20,
      pedestrianFlow: 58,
      undueOccupation: 1,
      cyclists: 14,
      activeGuardians: 7,
    },
  },
  {
    id: 'dia-bici',
    name: 'Día de la Bicicleta y Peatón',
    shortLabel: 'Movilidad sostenible',
    description:
      'Más familias caminan en grupo o llegan en bicicleta por la ciclorruta escolar con casco y respeto mutuo.',
    timeWindow: '7:00 AM · Jornada sostenible',
    params: {
      vehicleFlow: 10,
      pedestrianFlow: 68,
      undueOccupation: 0,
      cyclists: 28,
      activeGuardians: 8,
    },
  },
  {
    id: 'salida-lluvia',
    name: 'Salida lluviosa en Cali',
    shortLabel: 'Tarde lluviosa',
    description:
      'La lluvia aumenta la llegada de vehículos particulares y reduce visibilidad; se requiere mayor calma y orden.',
    timeWindow: '12:40 PM · Salida con lluvia',
    params: {
      vehicleFlow: 34,
      pedestrianFlow: 52,
      undueOccupation: 6,
      cyclists: 4,
      activeGuardians: 4,
    },
  },
];

export const MISSIONS: Mission[] = [
  {
    id: 'paso-peatonal',
    number: 1,
    title: '¡Protejamos el paso peatonal!',
    technicalTopic: 'Prioridad peatonal · Sensor de ocupación en cebra',
    imagePath: ASSET_IMAGES.missionCrosswalk,
    imageAlt: 'Estudiantes esperando en el andén junto a la cebra amarilla frente al colegio',
    situation:
      'Son las 6:45 a. m. Varios estudiantes quieren cruzar la cebra frente a la puerta principal, pero un automóvil se detuvo encima de las líneas amarillas para bajar una maleta.',
    guardiIntro:
      '¡Alerta en la cebra! El sensor simulado detectó ocupación indebida en el cruce. ¿Qué decisión protege mejor a los peatones?',
    guardiHint:
      'Piensa en qué acción mantiene a los estudiantes fuera de peligro en el andén mientras despeja la cebra de forma segura.',
    iotSnapshot: {
      vehicleFlow: 32,
      pedestrianFlow: 55,
      undueOccupation: 7,
      cyclists: 8,
      activeGuardians: 2,
    },
    badgeId: 'protector-peaton',
    choices: [
      {
        id: 'c1-a',
        label: 'Esperar en el andén y avisar al acudiente Guardián para que dialogue con el conductor',
        description:
          'Los estudiantes permanecen seguros en la acera mientras un adulto voluntario pide avanzar hacia la zona permitida.',
        isOptimal: true,
        starsEarned: 3,
        pointsEarned: 150,
        simulatedOutcome:
          'La cebra se despeja en 20 segundos, ningún estudiante queda entre carros y el flujo peatonal recupera su ritmo seguro.',
        impactSummary: {
          pedestrianSafetyDelta: '+38% seguridad peatonal',
          congestionDelta: '-22% bloqueo en cruce',
          sustainabilityDelta: '+10% confianza al caminar',
        },
        defaultFeedback: {
          guardiMessage: '¡Excelente decisión! Protegiste a los peatones y actuaste con mucha inteligencia.',
          pedagogicalExplanation:
            'Permanecer en el andén evita quedar en puntos ciegos de otros vehículos, y pedir apoyo a un adulto Guardián resuelve el bloqueo sin exponer a ningún estudiante.',
          schoolActionTip:
            'En tu colegio, identifica siempre la zona de parada segura antes de cruzar y acude al docente o brigadista adulto si la cebra está obstruida.',
        },
      },
      {
        id: 'c1-b',
        label: 'Rodear rápidamente el carro estacionado pasando por detrás',
        description:
          'Intentar cruzar por un espacio estrecho fuera de la cebra para no llegar tarde al timbre.',
        isOptimal: false,
        starsEarned: 1,
        pointsEarned: 40,
        simulatedOutcome:
          'Aumenta el riesgo porque los conductores que vienen atrás o en reversa no alcanzan a ver a los estudiantes pequeños.',
        impactSummary: {
          pedestrianSafetyDelta: '-25% visibilidad peatonal',
          congestionDelta: 'Sin mejora en el cruce',
          sustainabilityDelta: 'Riesgo de incidente vial',
        },
        defaultFeedback: {
          guardiMessage: '¡Intentémoslo de nuevo! Cada decisión nos enseña algo muy valioso.',
          pedagogicalExplanation:
            'Cruzar por detrás de un vehículo detenido es peligroso porque oculta a los niños de la vista de otros conductores y motos.',
          schoolActionTip:
            'Aunque tengas prisa, espera unos segundos en el andén y cruza únicamente cuando la cebra esté despejada y los vehículos se hayan detenido.',
        },
      },
      {
        id: 'c1-c',
        label: 'Salir a la calzada para hacer señales con las manos a los otros carros',
        description:
          'Un estudiante se para en mitad de la calle intentando detener el tráfico.',
        isOptimal: false,
        starsEarned: 1,
        pointsEarned: 50,
        simulatedOutcome:
          'El estudiante queda expuesto a vehículos en movimiento; la organización del tráfico corresponde únicamente a adultos capacitados o autoridades.',
        impactSummary: {
          pedestrianSafetyDelta: '-30% protección del estudiante',
          congestionDelta: '+15% confusión vehicular',
          sustainabilityDelta: 'Requiere protocolo seguro',
        },
        defaultFeedback: {
          guardiMessage: '¡Intentémoslo de nuevo! Tu intención es ayudar, pero tu seguridad es lo primero.',
          pedagogicalExplanation:
            'Los niños y adolescentes son Guardianes desde el ejemplo y la prevención, nunca asumiendo funciones de control del tráfico sobre la vía.',
          schoolActionTip:
            'Apoya la movilidad compartiendo buenas prácticas con tu familia y dejando el acompañamiento vial en manos de adultos Guardianes.',
        },
      },
    ],
  },
  {
    id: 'sin-congestion',
    number: 2,
    title: '¡Lleguemos al colegio sin congestión!',
    technicalTopic: 'Fluidez en ascenso y descenso · Reducción de doble fila',
    imagePath: ASSET_IMAGES.heroSchool,
    imageAlt: 'Entrada escolar con bus amarillo, ciclorruta y zona organizada de llegada',
    situation:
      'En la vía frente al colegio hay fila doble porque varios acudientes se quedan conversando con el carro encendido justo frente al portón de ingreso.',
    guardiIntro:
      '¡Beep-boop! Los sensores simulados muestran 38 vehículos por minuto y bocinas sonando. ¿Cómo ayudamos a que la entrada fluya tranquila?',
    guardiHint:
      'Busca una estrategia colaborativa donde las familias usen puntos de descenso ágil o lleguen caminando las últimas dos cuadras.',
    iotSnapshot: {
      vehicleFlow: 38,
      pedestrianFlow: 60,
      undueOccupation: 9,
      cyclists: 7,
      activeGuardians: 2,
    },
    badgeId: 'experto-movilidad',
    choices: [
      {
        id: 'c2-a',
        label: 'Promover el "Baja y sigue" en zona segura y caminar las últimas dos cuadras en grupo',
        description:
          'Acudientes y estudiantes se despiden rápido en un punto seguro a 100 metros o llegan en caminata escolar.',
        isOptimal: true,
        starsEarned: 3,
        pointsEarned: 150,
        simulatedOutcome:
          'La doble fila desaparece, baja el ruido y los vehículos no se acumulan frente al portón.',
        impactSummary: {
          pedestrianSafetyDelta: '+32% orden en el acceso',
          congestionDelta: '-45% tiempo de congestión',
          sustainabilityDelta: '+25% caminata saludable',
        },
        defaultFeedback: {
          guardiMessage: '¡Excelente decisión! Descongestionaste el portón con una solución comunitaria.',
          pedagogicalExplanation:
            'Cuando cada carro se detiene solo lo necesario en un punto seguro o las familias estacionan dos cuadras antes, el entorno del portón queda despejado y respiramos aire más limpio.',
          schoolActionTip:
            'Propón en tu familia tener la maleta lista antes de llegar al colegio para hacer un descenso rápido y seguro.',
        },
      },
      {
        id: 'c2-b',
        label: 'Pedir a los conductores que piten más fuerte para que el de adelante avance',
        description:
          'Usar la bocina de forma continua esperando que la fila se mueva más rápido.',
        isOptimal: false,
        starsEarned: 1,
        pointsEarned: 35,
        simulatedOutcome:
          'El ruido estresa a estudiantes, vecinos y conductores sin liberar el espacio bloqueado.',
        impactSummary: {
          pedestrianSafetyDelta: '-12% calma escolar',
          congestionDelta: '0% mejora en fluidez',
          sustainabilityDelta: '+40% contaminación acústica',
        },
        defaultFeedback: {
          guardiMessage: '¡Intentémoslo de nuevo! El ruido no mueve los carros, pero la cooperación sí.',
          pedagogicalExplanation:
            'El exceso de bocina genera contaminación auditiva cerca de las aulas y aumenta la ansiedad al cruzar la calle.',
          schoolActionTip:
            'En tu colegio pueden crear mensajes positivos como "Menos pito, más respeto" junto a los Guardianes.',
        },
      },
      {
        id: 'c2-c',
        label: 'Permitir que los estudiantes bajen por la puerta izquierda hacia el carril vehicular',
        description:
          'Abrir la puerta del lado de la calle para salir rápido de la fila.',
        isOptimal: false,
        starsEarned: 1,
        pointsEarned: 45,
        simulatedOutcome:
          'Bajar hacia el carril donde circulan motos y otros autos crea un riesgo alto de choque.',
        impactSummary: {
          pedestrianSafetyDelta: '-35% seguridad al descender',
          congestionDelta: '-5% orden vial',
          sustainabilityDelta: 'Alto riesgo en puerta',
        },
        defaultFeedback: {
          guardiMessage: '¡Intentémoslo de nuevo! Siempre debemos bajar por el lado del andén.',
          pedagogicalExplanation:
            'Descender por el lado de la acera garantiza que ningún vehículo o motocicleta sorprenda al estudiante al abrir la puerta.',
          schoolActionTip:
            'Recuerda siempre la regla de oro en familia: "Puerta al andén, llegada sin sustos".',
        },
      },
    ],
  },
  {
    id: 'somos-guardianes',
    number: 3,
    title: '¡Somos Guardianes!',
    technicalTopic: 'Organización comunitaria · Roles seguros por perfil',
    imagePath: ASSET_IMAGES.heroSchool,
    imageAlt: 'Comunidad educativa organizada frente al colegio con brigada voluntaria adulta',
    situation:
      'Tu curso quiere crear una brigada escolar de Guardianes de la Movilidad para mejorar la salida del mediodía, donde salen más de 300 estudiantes.',
    guardiIntro:
      '¡Qué gran iniciativa! Pero atención: debemos organizar tareas seguras donde estudiantes, docentes y acudientes aporten sin exponerse a peligros.',
    guardiHint:
      '¿Qué tareas corresponden a los adultos voluntarios en el borde vial y cuáles a los estudiantes dentro del patio o andén?',
    iotSnapshot: {
      vehicleFlow: 26,
      pedestrianFlow: 74,
      undueOccupation: 4,
      cyclists: 12,
      activeGuardians: 5,
    },
    badgeId: 'guardian-responsable',
    choices: [
      {
        id: 'c3-a',
        label: 'Estudiantes promueven filas ordenadas y uso del casco dentro del colegio; adultos acompañan en la cebra',
        description:
          'Trabajo en equipo con roles claros: educación entre pares en zona segura y acompañamiento adulto en el cruce.',
        isOptimal: true,
        starsEarned: 3,
        pointsEarned: 150,
        simulatedOutcome:
          'La salida se organiza en dos bloques tranquilos, los acudientes saben dónde esperar y todos los estudiantes cruzan acompañados.',
        impactSummary: {
          pedestrianSafetyDelta: '+42% organización segura',
          congestionDelta: '-28% aglomeración en puerta',
          sustainabilityDelta: '+30% participación familiar',
        },
        defaultFeedback: {
          guardiMessage: '¡Excelente decisión! Demostraste qué significa ser un verdadero Guardián responsable.',
          pedagogicalExplanation:
            'La movilidad escolar mejora cuando cada actor cumple su rol seguro: los estudiantes lideran la cultura ciudadana en zonas protegidas y los adultos respaldan el cruce.',
          schoolActionTip:
            'Organiza con tu profe turnos de bienvenida dentro del plantel para recordar el uso de la cebra y el casco.',
        },
      },
      {
        id: 'c3-b',
        label: 'Enviar a los estudiantes de grados mayores a detener buses en la esquina',
        description:
          'Asignar a adolescentes el control vehicular en la intersección sin acompañamiento.',
        isOptimal: false,
        starsEarned: 1,
        pointsEarned: 40,
        simulatedOutcome:
          'Exponer a menores en la vía pública incumple las normas de cuidado escolar y los pone en riesgo.',
        impactSummary: {
          pedestrianSafetyDelta: '-40% seguridad estudiantil',
          congestionDelta: 'Riesgo en intersección',
          sustainabilityDelta: 'Protocolo no seguro',
        },
        defaultFeedback: {
          guardiMessage: '¡Intentémoslo de nuevo! Ningún estudiante debe ponerse en riesgo en la vía.',
          pedagogicalExplanation:
            'Cuidar la vida es la prioridad número uno. El control vehicular en la calzada solo puede hacerlo personal adulto autorizado o agentes de tránsito.',
          schoolActionTip:
            'Si notas un punto crítico en la esquina, regístralo con tus docentes para solicitar apoyo adulto o señalización.',
        },
      },
      {
        id: 'c3-c',
        label: 'Abrir todas las puertas a la vez sin turnos ni puntos de encuentro',
        description:
          'Dejar que cada quien salga corriendo hacia donde crea que está su transporte.',
        isOptimal: false,
        starsEarned: 2,
        pointsEarned: 75,
        simulatedOutcome:
          'Aunque nadie se queda en la calle dirigiendo carros, el desorden en el andén dificulta que familias y rutas se encuentren.',
        impactSummary: {
          pedestrianSafetyDelta: '-15% claridad en salida',
          congestionDelta: '+18% tiempo de espera',
          sustainabilityDelta: 'Menor coordinación',
        },
        defaultFeedback: {
          guardiMessage: '¡Intentémoslo de nuevo! Con pequeños puntos de encuentro todo fluye mucho mejor.',
          pedagogicalExplanation:
            'Definir zonas de encuentro por grados o rutas evita carreras en el andén y ayuda a los Guardianes a cuidar a los más pequeños.',
          schoolActionTip:
            'Acuerda con tu familia un punto fijo de encuentro en el andén para salir con calma.',
        },
      },
    ],
  },
  {
    id: 'movilidad-sostenible',
    number: 4,
    title: '¡Movilidad sostenible!',
    technicalTopic: 'Ciclorruta escolar · Transporte activo y compartido',
    imagePath: ASSET_IMAGES.missionBikeLane,
    imageAlt: 'Niños y adolescentes en bicicleta con casco por ciclorruta verde frente a la escuela',
    situation:
      'Varios compañeros viven a menos de 15 minutos del colegio en Cali y quieren organizar una forma más ecológica, saludable y segura de llegar juntos.',
    guardiIntro:
      '¡Mira esa ciclorruta verde! ¿Cómo impulsamos la bicicleta y la caminata segura para reducir los carros frente al colegio?',
    guardiHint:
      'Combina protección personal (casco, luces, revisión de frenos) con rutas grupales acompañadas por adultos.',
    iotSnapshot: {
      vehicleFlow: 14,
      pedestrianFlow: 66,
      undueOccupation: 1,
      cyclists: 26,
      activeGuardians: 7,
    },
    badgeId: 'amigo-bicicleta',
    choices: [
      {
        id: 'c4-a',
        label: 'Crear un "Bici-bus" o caminata escolar con adultos acompañantes, casco y respeto por la ciclorruta',
        description:
          'Grupos que salen a la misma hora por una ruta segura verificada, usando elementos reflectivos y parqueadero escolar.',
        isOptimal: true,
        starsEarned: 3,
        pointsEarned: 150,
        simulatedOutcome:
          'Se reducen 18 viajes en carro particular al día, aumenta la actividad física y la entrada escolar luce más limpia y alegre.',
        impactSummary: {
          pedestrianSafetyDelta: '+30% visibilidad ciclista',
          congestionDelta: '-35% carros en hora pico',
          sustainabilityDelta: '+50% movilidad limpia',
        },
        defaultFeedback: {
          guardiMessage: '¡Excelente decisión! Eres un gran amigo de la bicicleta y del planeta.',
          pedagogicalExplanation:
            'Ir en grupo acompañado por adultos, usando casco y respetando las señales, convierte la bicicleta y la caminata en alternativas seguras que reducen emisiones y trancones.',
          schoolActionTip:
            'Revisa frenos, llantas y timbre antes de salir, y usa siempre chaleco o cinta reflectiva en tu maleta.',
        },
      },
      {
        id: 'c4-b',
        label: 'Ir en bicicleta rápido por el andén peatonal para evitar la calle',
        description:
          'Pedalear entre los niños que caminan por la acera sin avisar.',
        isOptimal: false,
        starsEarned: 1,
        pointsEarned: 45,
        simulatedOutcome:
          'Genera choques con peatones en el andén; cuando no hay ciclorruta, el ciclista debe bajarse y caminar junto a su bici.',
        impactSummary: {
          pedestrianSafetyDelta: '-28% seguridad en andén',
          congestionDelta: 'Conflicto bici-peatón',
          sustainabilityDelta: 'Falta convivencia vial',
        },
        defaultFeedback: {
          guardiMessage: '¡Intentémoslo de nuevo! El andén es el hogar sagrado del peatón.',
          pedagogicalExplanation:
            'Las bicicletas deben usar la ciclorruta; si en algún tramo debes pasar por el andén, bájate de la bicicleta y camina a su lado.',
          schoolActionTip:
            'Recuerda: en el entorno escolar, quien va más rápido siempre cuida a quien camina.',
        },
      },
      {
        id: 'c4-c',
        label: 'Compartir vehículo familiar entre 3 vecinos del mismo barrio cuando llueve fuerte',
        description:
          'Organizar "carro compartido" escolar en días de lluvia en lugar de llevar tres carros distintos.',
        isOptimal: false,
        starsEarned: 2,
        pointsEarned: 95,
        simulatedOutcome:
          '¡Es una muy buena opción para días lluviosos! Reduce carros, aunque en días secos la bici y la caminata aportan aún más sostenibilidad.',
        impactSummary: {
          pedestrianSafetyDelta: '+15% orden en lluvia',
          congestionDelta: '-25% flujo vehicular',
          sustainabilityDelta: '+25% eficiencia compartida',
        },
        defaultFeedback: {
          guardiMessage: '¡Buena idea para días de lluvia! Y en mañanas soleadas podemos sumar bici y caminata.',
          pedagogicalExplanation:
            'Compartir vehículo disminuye la fila de autos en el portón cuando el clima impide caminar o pedalear.',
          schoolActionTip:
            'Combina caminata o "Bici-bus" en días secos con carro compartido cuando llueva en Cali.',
        },
      },
    ],
  },
];

export const EDUCATIONAL_BADGES: EducationalBadge[] = [
  {
    id: 'protector-peaton',
    name: 'Protector del peatón',
    description: 'Resguarda la cebra y prioriza el paso seguro en el andén escolar.',
    missionId: 'paso-peatonal',
    accentColor: 'sky',
  },
  {
    id: 'experto-movilidad',
    name: 'Experto en movilidad segura',
    description: 'Propone soluciones colaborativas para evitar la doble fila y el ruido.',
    missionId: 'sin-congestion',
    accentColor: 'orange',
  },
  {
    id: 'guardian-responsable',
    name: 'Guardián responsable',
    description: 'Organiza brigadas escolares cuidando que los estudiantes nunca se expongan al tráfico.',
    missionId: 'somos-guardianes',
    accentColor: 'amber',
  },
  {
    id: 'amigo-bicicleta',
    name: 'Amigo de la bicicleta',
    description: 'Impulsa rutas sostenibles, uso de casco y respeto entre bici y peatón.',
    missionId: 'movilidad-sostenible',
    accentColor: 'emerald',
  },
];

export const INITIAL_SHIFTS: VolunteerShift[] = [
  {
    id: 's1',
    day: 'Lunes',
    slot: '6:30 – 7:15 AM',
    zone: 'Cebra Portón Principal',
    assignedName: 'Martha Lucía P. (Acudiente 5°)',
    role: 'Acudiente',
  },
  {
    id: 's2',
    day: 'Martes',
    slot: '6:30 – 7:15 AM',
    zone: 'Acceso Ciclorruta Norte',
    assignedName: 'Profe Andrés R. (Educación Física)',
    role: 'Docente',
  },
  {
    id: 's3',
    day: 'Miércoles',
    slot: '12:30 – 1:15 PM',
    zone: 'Zona Baja y Sigue',
    assignedName: 'Disponible para voluntario',
    role: 'Acudiente',
  },
  {
    id: 's4',
    day: 'Jueves',
    slot: '6:30 – 7:15 AM',
    zone: 'Cebra Portón Principal',
    assignedName: 'Carlos Eduardo M. (Acudiente 7°)',
    role: 'Acudiente',
  },
  {
    id: 's5',
    day: 'Viernes',
    slot: '12:30 – 1:15 PM',
    zone: 'Punto de Encuentro Peatonal',
    assignedName: 'Disponible para voluntario',
    role: 'Acudiente',
  },
];

export const INITIAL_PLEDGES: CommunityPledge[] = [
  {
    id: 'p1',
    title: 'Cruzo siempre por la cebra y sin celular en la mano',
    audience: 'Estudiantes',
    description: 'Miro a ambos lados desde el andén antes de dar el primer paso.',
    supportersCount: 84,
    points: 30,
  },
  {
    id: 'p2',
    title: 'Dejo la cebra libre y hago descenso rápido en zona segura',
    audience: 'Acudientes',
    description: 'Evito estacionar en doble fila y respeto el carril de bicicletas.',
    supportersCount: 62,
    points: 30,
  },
  {
    id: 'p3',
    title: 'Uso casco y camino con mi bici si paso por un andén',
    audience: 'Estudiantes',
    description: 'Cuido a quienes caminan y verifico mis frenos y reflectivos.',
    supportersCount: 51,
    points: 30,
  },
  {
    id: 'p4',
    title: 'Integro retos de cultura vial en las actividades de clase',
    audience: 'Docentes',
    description: 'Guío reflexiones sobre empatía vial usando el simulador en el aula.',
    supportersCount: 19,
    points: 30,
  },
];

export const INITIAL_RECOGNITIONS: RecognitionMessage[] = [
  {
    id: 'r1',
    author: 'Comité Ambiental Escolar',
    role: 'Sede Sur · Cali',
    message: '¡Gracias a las 14 familias que se sumaron esta semana al recorrido caminando desde el parque!',
    timeAgo: 'Simulado · Hoy',
  },
  {
    id: 'r2',
    author: 'Brigada Adulta de Acudientes',
    role: 'Jornada Mañana',
    message: 'Hoy la cebra del portón permaneció despejada durante todo el ingreso de primaria.',
    timeAgo: 'Simulado · Ayer',
  },
  {
    id: 'r3',
    author: 'Grupo 6°B',
    role: 'Reto Bici-Segura',
    message: 'Completamos 100% de uso de casco en el parqueadero de bicicletas.',
    timeAgo: 'Simulado · Esta semana',
  },
];
