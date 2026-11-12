// Ogni file di questa cartella è un capitolo: basta aggiungerne uno perché
// entri nel libro. L'ordine è dato da `order`, il raggruppamento da `part`.
const modules = import.meta.glob(['./*.js', '!./index.js'], { eager: true });

export const PARTS = [
  'Midollo e nervi spinali',
  'Vie e tronco encefalico',
  'Encefalo',
  'Nervi cranici',
  'Organi di senso',
  'Sistema vegetativo',
  'Vasi e scheletro',
];

export const CHAPTERS = Object.values(modules)
  .map((m) => m.default)
  .filter(Boolean)
  .sort((a, b) => a.order - b.order);
