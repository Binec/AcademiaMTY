// 30 dummy questions per exam level about traffic rules and safe driving.
// Each question has 4 options (A, B, C, D) or T/F and a correct answer index.

export interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number; // index
  explanation?: string;
}

export interface Exam {
  level: "basico" | "intermedio" | "experto" | "primeros-auxilios";
  title: string;
  description: string;
  passingScore: number; // percentage
  duration: number; // minutes
  questions: Question[];
}

const basico: Question[] = [
  { id: 1, text: "¿A qué edad mínima se puede obtener la licencia de conducir tipo A en México?", options: ["14 años", "15 años", "16 años", "18 años"], correct: 2, explanation: "La licencia tipo A para menores se obtiene a partir de los 16 años." },
  { id: 2, text: "¿Qué significa una luz roja intermitente en un semáforo?", options: ["Avance con precaución", "Detenerse completamente y luego avanzar con cuidado", "No detenerse", "Ceder el paso a vehículos de emergencia"], correct: 1 },
  { id: 3, text: "¿Qué indica una línea continua amarilla en el centro de la calle?", options: ["Se puede rebasar", "Prohibido rebasar", "Fin de la vía", "Zona de estacionamiento"], correct: 1 },
  { id: 4, text: "¿Cuál es la distancia mínima de seguridad recomendada entre vehículos?", options: ["1 metro", "2 metros", "3 segundos de distancia", "50 centímetros"], correct: 2 },
  { id: 5, text: "¿Qué debe hacer al escuchar una sirena de ambulancia?", options: ["Acelerar para salir del camino", "Detenerse a la derecha y ceder el paso", "Seguir conduciendo igual", "Tocar el claxon"], correct: 1 },
  { id: 6, text: "¿Cuál es el límite de alcohol permitido para conducir?", options: ["0.08 g/L", "0.05 g/L", "0.0 g/L para menores y nuevos conductores", "No hay límite"], correct: 2 },
  { id: 7, text: "¿Qué significa una señal de 'Ceda el paso'?", options: ["Detenerse obligatoriamente", "Reducir la velocidad y ceder el paso a otros vehículos", "Avance preferente", "Zona escolar"], correct: 1 },
  { id: 8, text: "¿Dónde está prohibido estacionarse?", options: ["En doble fila", "Sobre banquetas", "Frente a entradas de garaje", "Todas las anteriores"], correct: 3 },
  { id: 9, text: "¿Qué indica una luz amarilla en el semáforo?", options: ["Acelerar para cruzar", "Detenerse si es posible con seguridad", "Avance", "Reversa"], correct: 1 },
  { id: 10, text: "¿Es obligatorio el uso del cinturón de seguridad?", options: ["Solo en autopista", "Solo para el conductor", "Para todos los ocupantes en todo momento", "Solo en viajes largos"], correct: 2 },
  { id: 11, text: "¿Qué debe hacer antes de cambiar de carril?", options: ["Encender la direccional y revisar puntos ciegos", "Tocar el claxon", "Acelerar", "Nada en especial"], correct: 0 },
  { id: 12, text: "¿Qué es un punto ciego?", options: ["Una esquina oscura", "Área no visible en los espejos retrovisores", "Un bache en la calle", "Zona sin señalización"], correct: 1 },
  { id: 13, text: "¿Cuál es el orden correcto de prioridad en un cruce sin señales?", options: ["El vehículo más grande", "Vehículo de la derecha", "Vehículo de la izquierda", "El que acelere más"], correct: 1 },
  { id: 14, text: "¿Qué indica una señal triangular roja?", options: ["Advertencia de peligro", "Stop", "Dirección obligatoria", "Zona de parqueo"], correct: 0 },
  { id: 15, text: "¿Es permitido usar el celular mientras se conduce?", options: ["Sí, con manos libres", "Sí, en semáforos", "No, está prohibido en cualquier forma", "Solo para llamadas"], correct: 2 },
  { id: 16, text: "¿Qué se debe hacer en caso de lluvia intensa?", options: ["Acelerar para llegar rápido", "Reducir velocidad y aumentar distancia", "Encender luces altas", "Estacionarse en medio de la vía"], correct: 1 },
  { id: 17, text: "¿Qué significa una línea blanca discontinua?", options: ["Prohibido cambiar de carril", "Se puede cambiar de carril con precaución", "Zona de carga y descarga", "Carril exclusivo de autobuses"], correct: 1 },
  { id: 18, text: "¿Cuál es la velocidad máxima en zona escolar?", options: ["20 km/h", "30 km/h", "40 km/h", "50 km/h"], correct: 1 },
  { id: 19, text: "¿Qué debe hacer si sufre una falla mecánica en la autopista?", options: ["Detenerse en el carril", "Orillarse al acotamiento y encender luces intermitentes", "Seguir conduciendo", "Salir del vehículo inmediatamente"], correct: 1 },
  { id: 20, text: "¿Es obligatorio el uso de casco para motociclistas?", options: ["Solo en ciudad", "Solo en carretera", "Sí, en todo momento conductor y acompañante", "No es obligatorio"], correct: 2 },
  { id: 21, text: "¿Qué indica la señal de 'STOP'?", options: ["Ceder el paso", "Detenerse completamente", "Avance lento", "Prohibido girar"], correct: 1 },
  { id: 22, text: "¿Qué es conducción defensiva?", options: ["Conducir rápido", "Anticipar riesgos y reaccionar a tiempo", "Usar el claxon constantemente", "Conducir de noche"], correct: 1 },
  { id: 23, text: "¿Qué hacer ante un accidente de tránsito?", options: ["Huir", "Detenerse, auxiliar y reportar a autoridades", "Seguir su camino", "Bajar del auto y tomar fotos"], correct: 1 },
  { id: 24, text: "¿Qué indica un paso peatonal?", options: ["Zona para estacionar", "Prioridad absoluta a los peatones", "Zona de carga", "Carril para bicicletas"], correct: 1 },
  { id: 25, text: "¿Es permitido rebasar en curva?", options: ["Sí", "Sí de día", "Prohibido absolutamente", "Solo si no viene nadie"], correct: 2 },
  { id: 26, text: "¿Qué se debe revisar antes de salir a conducir?", options: ["Nivel de combustible", "Presión de llantas y frenos", "Espejos y cinturón", "Todas las anteriores"], correct: 3 },
  { id: 27, text: "¿Qué significa una flecha verde en el semáforo?", options: ["Giro permitido en dirección de la flecha", "Detenerse", "Prohibido girar", "Precaución"], correct: 0 },
  { id: 28, text: "¿Cuál es la postura correcta al conducir?", options: ["Brazos totalmente extendidos", "Manos en el volante a las 9 y 3, espalda recta", "Un brazo fuera de la ventana", "Piernas cruzadas"], correct: 1 },
  { id: 29, text: "¿Qué es la distancia de frenado?", options: ["Distancia que recorre el auto hasta detenerse", "Distancia al auto de adelante", "Longitud del auto", "Distancia de reacción"], correct: 0 },
  { id: 30, text: "¿Qué hacer si se pincha una llanta en movimiento?", options: ["Frenar bruscamente", "Sujetar el volante firmemente y frenar suavemente", "Girar rápidamente", "Acelerar"], correct: 1 },
];

const intermedio: Question[] = [
  { id: 1, text: "¿Qué técnica se usa para frenar en superficies resbaladizas?", options: ["Frenado intermitente (bombeo)", "Frenado brusco", "Tirar del freno de mano", "Apagar el motor"], correct: 0 },
  { id: 2, text: "¿Qué es el subviraje (understeer)?", options: ["El auto gira más de lo esperado", "El auto tiende a seguir recto al girar", "Pérdida de tracción trasera", "Frenado de emergencia"], correct: 1 },
  { id: 3, text: "¿Qué es el sobreviraje (oversteer)?", options: ["El auto no gira", "La parte trasera derrapa al girar", "Aumento de velocidad en curva", "Falta de potencia"], correct: 1 },
  { id: 4, text: "¿Cuál es la velocidad máxima en autopista para autos particulares?", options: ["80 km/h", "100 km/h", "110 km/h", "130 km/h"], correct: 2 },
  { id: 5, text: "¿Qué significa la regla de los '3 segundos'?", options: ["Tiempo para encender direccional", "Distancia mínima de seguridad entre vehículos", "Tiempo de reacción en frenado", "Tiempo para arrancar en semáforo"], correct: 1 },
  { id: 6, text: "¿Qué hacer si el auto entra en un derrape?", options: ["Frenar fuerte", "Girar en dirección contraria al derrape", "Girar suavemente en dirección al derrape y soltar acelerador", "Tirar freno de mano"], correct: 2 },
  { id: 7, text: "¿Es recomendable conducir con calzado de suela gruesa?", options: ["Sí", "No, reduce la sensibilidad en los pedales", "Solo en lluvia", "Solo en carretera"], correct: 1 },
  { id: 8, text: "¿Qué indica el sistema ABS?", options: ["Aire acondicionado", "Sistema antibloqueo de frenos", "Control de tracción", "Asistente de arranque"], correct: 1 },
  { id: 9, text: "¿Cómo se debe rebasar en carretera?", options: ["Por la derecha", "Por la izquierda, usando direccional y asegurando visibilidad", "Por el acotamiento", "No se puede rebasar"], correct: 1 },
  { id: 10, text: "¿Qué es la fatiga al volante y cómo evitarla?", options: ["No existe", "Cansancio extremo; descansar cada 2 horas", "Solo afecta a conductores novatos", "Se soluciona con música alta"], correct: 1 },
  { id: 11, text: "¿Qué luces se deben usar de noche en ciudad?", options: ["Luces altas", "Luces bajas", "Solo luces de posición", "Intermitentes"], correct: 1 },
  { id: 12, text: "¿Cuándo usar luces altas?", options: ["En ciudad", "En carreteras sin iluminación y sin tráfico en sentido contrario", "En niebla", "Siempre"], correct: 1 },
  { id: 13, text: "¿Qué hacer si hay niebla espesa?", options: ["Encender luces altas", "Encender luces bajas y antiniebla, reducir velocidad", "Acelerar", "Encender intermitentes"], correct: 1 },
  { id: 14, text: "¿Qué es un carril de aceleración?", options: ["Carril para coches rápidos", "Carril para incorporarse a la autopista", "Carril de emergencia", "Carril para camiones"], correct: 1 },
  { id: 15, text: "¿Qué indica la presión correcta de llantas?", options: ["Lo que diga el mecánico", "La etiqueta del fabricante en la puerta del conductor", "La máxima que marca la llanta", "No es importante"], correct: 1 },
  { id: 16, text: "¿Qué es el punto de fricción del embrague?", options: ["Punto donde se desgasta el clutch", "Punto donde el motor empieza a transmitir fuerza a las ruedas", "Punto máximo de velocidad", "Punto de frenado"], correct: 1 },
  { id: 17, text: "¿Cómo subir una cuesta empinada en auto estándar?", options: ["Primera velocidad y embrague a punto", "Tercera velocidad", "Neutro y freno", "Solo acelerador"], correct: 0 },
  { id: 18, text: "¿Qué es la conducción ecoeficiente?", options: ["Conducir rápido", "Manejo suave, cambios de marcha adecuados y menos frenado", "Usar aire acondicionado todo el tiempo", "Acelerar fuerte en cada cambio"], correct: 1 },
  { id: 19, text: "¿Qué indica un testigo de aceite encendido?", options: ["Nivel bajo o presión insuficiente de aceite", "Aceite nuevo", "Cambio de aceite pasado", "No indica nada importante"], correct: 0 },
  { id: 20, text: "¿Qué es un sistema de frenos antibloqueo (ABS)?", options: ["Evita que las llantas se bloqueen al frenar fuerte", "Aumenta la velocidad", "Controla el aire acondicionado", "Sistema de audio"], correct: 0 },
  { id: 21, text: "¿Qué distancia debe guardar con el vehículo de adelante en autopista?", options: ["1 segundo", "2 segundos", "3 a 4 segundos", "50 metros"], correct: 2 },
  { id: 22, text: "¿Cómo detectar puntos ciegos?", options: ["Con los espejos", "Mirando sobre el hombro antes de cambiar de carril", "Con el GPS", "No existen"], correct: 1 },
  { id: 23, text: "¿Qué hacer si se cruza un animal en la vía?", options: ["Frenar fuerte y girar", "Frenar suavemente sin girar bruscamente", "Acelerar", "Encender luces altas"], correct: 1 },
  { id: 24, text: "¿Qué indica el testigo de temperatura del motor?", options: ["Temperatura exterior", "Sobrecalentamiento del motor", "Nivel de gasolina", "Velocidad"], correct: 1 },
  { id: 25, text: "¿Cómo se debe estacionar en subida?", options: ["Ruedas hacia la acera y primera velocidad", "Ruedas hacia la calle y reversa", "Neutro sin freno de mano", "No importa"], correct: 0 },
  { id: 26, text: "¿Qué es el frenado motor?", options: ["Usar el motor para reducir velocidad al cambiar a marchas más bajas", "Frenar con el pie", "Freno de mano", "Sistema ABS"], correct: 0 },
  { id: 27, text: "¿Cuándo se debe revisar el nivel de aceite?", options: ["Cada 10,000 km o mensualmente", "Cada 100 km", "Nunca", "Solo cuando se acabe"], correct: 0 },
  { id: 28, text: "¿Qué indica una señal de 'Prohibido estacionarse'?", options: ["Se puede parar 5 minutos", "No se debe detener el vehículo en esa zona", "Solo carga y descarga", "Estacionamiento de pago"], correct: 1 },
  { id: 29, text: "¿Qué es el control de tracción?", options: ["Sistema que evita que las llantas patinen al acelerar", "Control de volante", "Sistema de audio", "Control de clima"], correct: 0 },
  { id: 30, text: "¿Qué hacer ante una falla de frenos?", options: ["Usar el freno de mano gradualmente y reducir marchas", "Apagar el motor", "Girar bruscamente", "Saltar del auto"], correct: 0 },
];

const experto: Question[] = [
  { id: 1, text: "¿Qué es la conducción predictiva?", options: ["Conducir a máxima velocidad", "Anticipar acciones de otros conductores y situaciones para evitar riesgos", "Usar el claxon para advertir", "Conducir de noche"], correct: 1 },
  { id: 2, text: "¿Cuál es el principal factor de riesgo en accidentes?", options: ["El auto", "La vía", "El factor humano", "El clima"], correct: 2 },
  { id: 3, text: "¿Qué es la técnica 'IPDE' en conducción defensiva?", options: ["Identificar, Predecir, Decidir, Ejecutar", "Ignorar, Pasar, Detener, Esperar", "Ir, Parar, Doblar, Entrar", "Ninguna"], correct: 0 },
  { id: 4, text: "¿Cómo se debe maniobrar en una curva de velocidad?", options: ["Frenar dentro de la curva", "Frenar antes, tomar la curva y acelerar a la salida", "Acelerar al entrar", "Neutro en la curva"], correct: 1 },
  { id: 5, text: "¿Qué es el aquaplaning (hidroplaneo)?", options: ["Llantas con mucha agua", "Pérdida de contacto por una capa de agua entre llanta y pavimento", "Sistema de limpiaparabrisas", "Riego de calles"], correct: 1 },
  { id: 6, text: "¿Cómo evitar el aquaplaning?", options: ["Acelerar", "Reducir velocidad, mantener llantas en buen estado y frenar suavemente", "Girar bruscamente", "Encender luces altas"], correct: 1 },
  { id: 7, text: "¿Qué es la distancia de reacción?", options: ["Distancia que recorre el auto desde que se ve el peligro hasta que se frena", "Distancia de frenado", "Distancia al auto de adelante", "Espacio entre ejes"], correct: 0 },
  { id: 8, text: "¿A 100 km/h, cuántos metros recorre un auto en 1 segundo?", options: ["10 m", "18 m", "28 m", "50 m"], correct: 2, explanation: "100 km/h ÷ 3.6 ≈ 27.78 m/s." },
  { id: 9, text: "¿Qué es la fuerza centrífuga en una curva?", options: ["Fuerza que empuja el vehículo hacia afuera de la curva", "Fuerza de tracción", "Fuerza de fricción", "Fuerza del motor"], correct: 0 },
  { id: 10, text: "¿Cómo compensar la fuerza centrífuga?", options: ["Acelerar en la curva", "Reducir velocidad antes de la curva", "Frenar en la curva", "Neutro"], correct: 1 },
  { id: 11, text: "¿Qué es el sistema ESC (control electrónico de estabilidad)?", options: ["Sistema de audio", "Sistema que ayuda a evitar derrames en curvas y maniobras bruscas", "Control de clima", "Sistema de navegación"], correct: 1 },
  { id: 12, text: "¿Qué técnica se usa para recuperar un derrape en vehículo sin ABS?", options: ["Frenar fuerte", "Contravolante suave y bombeo de freno", "Tirar freno de mano", "Acelerar"], correct: 1 },
  { id: 13, text: "¿Qué es la conducción económica?", options: ["Usar gasolina barata", "Manejo que reduce consumo y emisiones mediante aceleración suave y marchas adecuadas", "Conducir poco", "Usar solo neutro"], correct: 1 },
  { id: 14, text: "¿A qué rpm se recomienda cambiar de marcha en un auto estándar para ahorro?", options: ["1,500 - 2,500 rpm", "4,000 - 5,000 rpm", "6,000 rpm", "No importa"], correct: 0 },
  { id: 15, text: "¿Qué indica la profundidad mínima legal del dibujo de las llantas?", options: ["1.0 mm", "1.6 mm", "3.0 mm", "5.0 mm"], correct: 1 },
  { id: 16, text: "¿Qué es un chequeo pre-viaje?", options: ["Revisar llantas, frenos, fluidos, luces y espejos antes de salir", "Llenar el tanque", "Lavar el auto", "Revisar seguro"], correct: 0 },
  { id: 17, text: "¿Qué distancia de seguridad se recomienda en condiciones adversas?", options: ["1 segundo", "2 segundos", "5 a 6 segundos", "50 metros"], correct: 2 },
  { id: 18, text: "¿Qué es la regla de 'mirar 12 segundos adelante'?", options: ["Mirar el auto de adelante", "Escanear el camino 12 segundos por delante para anticipar riesgos", "Mirar el velocímetro", "Mirar los espejos cada 12 segundos"], correct: 1 },
  { id: 19, text: "¿Qué indica un testigo de freno ABS encendido?", options: ["Frenos nuevos", "Falla en el sistema antibloqueo; frenos normales siguen funcionando", "Falta de aceite", "Batería baja"], correct: 1 },
  { id: 20, text: "¿Qué es la maniobra de frenado de emergencia con ABS?", options: ["Presionar el freno con fuerza firme y mantener hasta detenerse", "Bombear el freno", "Soltar el freno", "Tirar freno de mano"], correct: 0 },
  { id: 21, text: "¿Qué es un punto de no retorno al cruzar un crucero?", options: ["Momento en que ya no se puede detener con seguridad y se debe continuar", "Punto de giro", "Límite de velocidad", "Carril exclusivo"], correct: 0 },
  { id: 22, text: "¿Qué indica la señal de 'Zona de seguridad'?", options: ["Zona peatonal protegida", "Zona para estacionar", "Zona de carga", "Carril exclusivo"], correct: 0 },
  { id: 23, text: "¿Qué es la evaluación de riesgos en conducción?", options: ["Ignorar el entorno", "Identificar peligros potenciales y planear una acción correctiva", "Conducir sin planear", "Usar el GPS todo el tiempo"], correct: 1 },
  { id: 24, text: "¿Qué hacer ante un conductor agresivo?", options: ["Competir con él", "Ceder el paso y mantener distancia", "Encender luces altas", "Tocar el claxon"], correct: 1 },
  { id: 25, text: "¿Qué es la técnica de 'espejeo' en revisión de puntos ciegos?", options: ["Ajustar los espejos cada 5 minutos", "Mirar por encima del hombro además de los espejos antes de cambiar de carril", "Usar solo espejo central", "No revisar"], correct: 1 },
  { id: 26, text: "¿Qué indica la presión de llantas en frío?", options: ["Presión incorrecta", "Medición recomendada antes de conducir, cuando las llantas están frías", "Presión de invierno", "No importa"], correct: 1 },
  { id: 27, text: "¿Qué es un plan de escape en conducción?", options: ["Ruta alternativa para evitar un peligro inesperado", "Plan de vacaciones", "Plan de mantenimiento", "Ruta de GPS"], correct: 0 },
  { id: 28, text: "¿Qué es la ley de cero tolerancia en alcohol?", options: ["Cero alcohol permitido para menores y nuevos conductores", "Permite un vaso", "No existe", "Solo para camioneros"], correct: 0 },
  { id: 29, text: "¿Qué indica la señal 'Sentido contrario'?", options: ["Prohibido el paso, circulación en dirección opuesta", "Vía de dos sentidos", "Giro permitido", "Zona de peatones"], correct: 0 },
  { id: 30, text: "¿Qué es la conducción a prueba de fallos?", options: ["Conducir asumiendo que otros conductores pueden cometer errores", "Conducir sin errores propios", "Conducir sin seguro", "Conducir en autopista"], correct: 0 },
];

const primerosAuxilios: Question[] = [
  { id: 1, text: "¿Qué significan las siglas RCP?", options: ["Respiración Cardiovascular Primaria", "Reanimación Cardio Pulmonar", "Reacción Cardiaca de Primeros auxilios", "Rescate Cardíaco Profesional"], correct: 1 },
  { id: 2, text: "¿Cuál es la velocidad recomendada de compresiones torácicas en RCP adulto?", options: ["50-60 por minuto", "70-80 por minuto", "100-120 por minuto", "140-160 por minuto"], correct: 2 },
  { id: 3, text: "¿Cuál es la proporción de compresiones y ventilaciones en RCP adulto?", options: ["15:1", "15:2", "30:2", "20:2"], correct: 2 },
  { id: 4, text: "¿Qué profundidad deben tener las compresiones en RCP adulto?", options: ["1-2 cm", "3-4 cm", "5-6 cm", "8-10 cm"], correct: 2 },
  { id: 5, text: "¿Qué significa la sigla PAS en primeros auxilios?", options: ["Prevenir, Avisar, Socorrer", "Proteger, Avisar, Socorrer", "Proteger, Actuar, Sanar", "Preguntar, Avisar, Salvar"], correct: 1 },
  { id: 6, text: "¿Qué número se marca en México para emergencias médicas?", options: ["066", "080", "911", "Todos los anteriores según la región"], correct: 3 },
  { id: 7, text: "¿Qué se debe hacer primero ante una persona inconsciente que respira?", options: ["Darle agua", "Colocarla en posición lateral de seguridad", "Aplicarle RCP", "Levantarla"], correct: 1 },
  { id: 8, text: "¿Qué NO se debe hacer ante una hemorragia externa severa?", options: ["Aplicar presión directa", "Elevar la zona afectada", "Retirar un objeto empalado", "Colocar un apósito limpio"], correct: 2 },
  { id: 9, text: "¿Qué es un torniquete?", options: ["Una férula", "Un dispositivo para detener hemorragias graves en extremidades", "Una mascarilla", "Una venda elástica"], correct: 1 },
  { id: 10, text: "¿Cuál es el tratamiento inmediato para una quemadura leve?", options: ["Aplicar mantequilla", "Aplicar pasta dental", "Enfriar con agua corriente 10-20 minutos", "Aplicar hielo directo"], correct: 2 },
  { id: 11, text: "¿Qué hacer ante una fractura abierta?", options: ["Introducir el hueso", "Cubrir con un paño limpio sin manipular y llamar a emergencias", "Aplicar una férula inmediatamente", "Lavar con agua"], correct: 1 },
  { id: 12, text: "¿Qué es una inmovilización?", options: ["Fijar una zona lesionada para evitar movimiento", "Dar masaje a la lesión", "Aplicar calor", "Elevar la zona"], correct: 0 },
  { id: 13, text: "¿Qué NO debes hacer ante una sospecha de lesión de columna?", options: ["Mover a la víctima", "Pedirle que no se mueva", "Llamar a emergencias", "Mantenerla abrigada"], correct: 0 },
  { id: 14, text: "¿Qué significa DEA?", options: ["Dispositivo Eléctrico Automático", "Desfibrilador Externo Automático", "Dispositivo de Emergencia Avanzada", "Descompresión Eléctrica Asistida"], correct: 1 },
  { id: 15, text: "¿Cuál es la temperatura normal del cuerpo humano?", options: ["34-35 °C", "36.5-37.5 °C", "38-39 °C", "40-41 °C"], correct: 1 },
  { id: 16, text: "¿Qué es la hipotermia?", options: ["Temperatura corporal muy alta", "Temperatura corporal anormalmente baja", "Presión arterial alta", "Fiebre"], correct: 1 },
  { id: 17, text: "¿Qué es una convulsión?", options: ["Movimientos involuntarios causados por actividad eléctrica anormal del cerebro", "Un ataque cardíaco", "Una fractura", "Un desmayo simple"], correct: 0 },
  { id: 18, text: "¿Qué hacer durante una convulsión?", options: ["Sostener a la víctima con fuerza", "Meter algo en la boca", "Proteger la cabeza y retirar objetos peligrosos", "Darle de beber"], correct: 2 },
  { id: 19, text: "¿Qué es un shock o estado de choque?", options: ["Sorpresa emocional", "Fallo circulatorio donde no llega suficiente sangre a los órganos", "Ataque de pánico", "Desmayo por calor"], correct: 1 },
  { id: 20, text: "¿Qué posición se recomienda para una víctima en shock?", options: ["De pie", "Boca abajo", "Acostada con las piernas elevadas", "Sentada"], correct: 2 },
  { id: 21, text: "¿Qué es la maniobra de Heimlich?", options: ["Técnica para detener hemorragias", "Técnica para desobstruir vías aéreas en atragantamiento", "Técnica de RCP", "Técnica de inmovilización"], correct: 1 },
  { id: 22, text: "¿Cuántas compresiones abdominales se realizan en Heimlich?", options: ["Hasta que expulse el objeto o pierda el conocimiento", "Solo 2", "Solo 5", "20"], correct: 0 },
  { id: 23, text: "¿Qué hacer ante una persona que se atraganta y no puede toser ni hablar?", options: ["Darle agua", "Aplicar la maniobra de Heimlich", "Dejarla sola", "Darle palmadas en la espalda acostada"], correct: 1 },
  { id: 24, text: "¿Cuál es el primer paso al atender a un herido?", options: ["Darle medicamentos", "Evaluar la seguridad del entorno", "Tomarle la presión", "Llamar a familiares"], correct: 1 },
  { id: 25, text: "¿Qué información debes dar al llamar a emergencias?", options: ["Tu nombre únicamente", "Ubicación, tipo de emergencia, número de víctimas y tu contacto", "Solo la ubicación", "Los síntomas del herido únicamente"], correct: 1 },
  { id: 26, text: "¿Qué es un botiquín de primeros auxilios?", options: ["Un maletín médico con instrumental quirúrgico", "Un conjunto básico de elementos para atender emergencias", "Una farmacia portátil", "Un maletín de medicamentos"], correct: 1 },
  { id: 27, text: "¿Qué elemento NO debe faltar en un botiquín básico?", options: ["Bisturí", "Gasas estériles, vendas y guantes desechables", "Medicamentos con receta", "Instrumentos quirúrgicos"], correct: 1 },
  { id: 28, text: "¿Qué hacer ante una picadura de abeja con aguijón visible?", options: ["Dejar el aguijón", "Retirar el aguijón raspando con una tarjeta, no con pinzas", "Apretar la zona", "Aplicar calor"], correct: 1 },
  { id: 29, text: "¿Qué NO debes hacer con una ampolla intacta?", options: ["Dejarla así", "Reventarla", "Cubrirla con apósito limpio", "Evitar fricción en la zona"], correct: 1 },
  { id: 30, text: "¿Qué significa la sigla ABC en la evaluación primaria?", options: ["Alerta, Breve, Calma", "Vía Aérea, Respiración, Circulación", "Atención, Balance, Control", "Ayuda, Brecha, Confianza"], correct: 1 },
];

export const exams: Record<string, Exam> = {
  basico: {
    level: "basico",
    title: "Examen Básico",
    description: "Evaluación de conocimientos fundamentales de reglamento de tránsito y conducción segura.",
    passingScore: 80,
    duration: 30,
    questions: basico,
  },
  intermedio: {
    level: "intermedio",
    title: "Examen Intermedio",
    description: "Evaluación de técnicas de conducción, mecánica básica y normativa aplicada.",
    passingScore: 80,
    duration: 35,
    questions: intermedio,
  },
  experto: {
    level: "experto",
    title: "Examen Experto",
    description: "Evaluación avanzada de conducción defensiva, predictiva y toma de decisiones de riesgo.",
    passingScore: 80,
    duration: 45,
    questions: experto,
  },
  "primeros-auxilios": {
    level: "primeros-auxilios",
    title: "Examen de Primeros Auxilios",
    description: "Evaluación sobre reanimación cardiopulmonar, atención de heridas, fracturas y emergencias médicas básicas.",
    passingScore: 80,
    duration: 25,
    questions: primerosAuxilios,
  },
};
