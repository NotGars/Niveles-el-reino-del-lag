export const triviaQuestions = [
  {
    question: '¿Cuál es la capital de Francia?',
    options: ['París', 'Londres', 'Berlín', 'Madrid'],
    correct: 0
  },
  {
    question: '¿En qué año llegó el hombre a la Luna?',
    options: ['1965', '1969', '1972', '1975'],
    correct: 1
  },
  {
    question: '¿Cuál es el planeta más grande del sistema solar?',
    options: ['Saturno', 'Neptuno', 'Júpiter', 'Urano'],
    correct: 2
  },
  {
    question: '¿Cuántos continentes hay en el mundo?',
    options: ['5', '6', '7', '8'],
    correct: 2
  },
  {
    question: '¿Quién pintó la Mona Lisa?',
    options: ['Van Gogh', 'Picasso', 'Da Vinci', 'Monet'],
    correct: 2
  },
  {
    question: '¿Cuál es el océano más grande?',
    options: ['Atlántico', 'Índico', 'Ártico', 'Pacífico'],
    correct: 3
  },
  {
    question: '¿Cuántos lados tiene un hexágono?',
    options: ['4', '5', '6', '7'],
    correct: 2
  },
  {
    question: '¿En qué país se encuentra la Torre Eiffel?',
    options: ['Italia', 'Francia', 'España', 'Alemania'],
    correct: 1
  },
  {
    question: '¿Cuál es el animal terrestre más rápido?',
    options: ['León', 'Leopardo', 'Guepardo', 'Tigre'],
    correct: 2
  },
  {
    question: '¿Cuál es el idioma más hablado del mundo?',
    options: ['Inglés', 'Mandarín', 'Español', 'Hindi'],
    correct: 1
  },
  {
    question: '¿Cuántos huesos tiene el cuerpo humano adulto?',
    options: ['186', '206', '226', '246'],
    correct: 1
  },
  {
    question: '¿Quién escribió Don Quijote?',
    options: ['García Márquez', 'Cervantes', 'Lope de Vega', 'Borges'],
    correct: 1
  },
  {
    question: '¿Cuál es el metal más abundante en la Tierra?',
    options: ['Hierro', 'Aluminio', 'Cobre', 'Oro'],
    correct: 1
  },
  {
    question: '¿En qué año comenzó la Segunda Guerra Mundial?',
    options: ['1935', '1937', '1939', '1941'],
    correct: 2
  },
  {
    question: '¿Cuál es el río más largo del mundo?',
    options: ['Nilo', 'Amazonas', 'Yangtsé', 'Misisipi'],
    correct: 1
  },
  {
    question: '¿Cuántos jugadores hay en un equipo de fútbol?',
    options: ['9', '10', '11', '12'],
    correct: 2
  },
  {
    question: '¿Qué gas respiramos principalmente?',
    options: ['Oxígeno', 'Nitrógeno', 'CO2', 'Hidrógeno'],
    correct: 1
  },
  {
    question: '¿Cuál es la montaña más alta del mundo?',
    options: ['K2', 'Everest', 'Kilimanjaro', 'Aconcagua'],
    correct: 1
  },
  {
    question: '¿De qué país es la bandera con una hoja de arce?',
    options: ['Suiza', 'Austria', 'Canadá', 'Noruega'],
    correct: 2
  },
  {
    question: '¿Cuántos días tiene un año bisiesto?',
    options: ['364', '365', '366', '367'],
    correct: 2
  }
];

export function getRandomQuestions(count = 5) {
  const shuffled = [...triviaQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
