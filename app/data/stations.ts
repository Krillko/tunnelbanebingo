import type { Station } from '~/types/station';

const blueStations: Station[] = [
  { id: 'kungstradgarden', name: 'Kungsträdgården', lat: 59.3317, lng: 18.0720, line: 'blue' },
  { id: 'radhuset', name: 'Rådhuset', lat: 59.3312, lng: 18.0506, line: 'blue' },
  { id: 'stadshagen', name: 'Stadshagen', lat: 59.3363, lng: 18.0072, line: 'blue' },
  { id: 'vastra-skogen', name: 'Västra skogen', lat: 59.3481, lng: 17.9964, line: 'blue' },
  { id: 'solna-centrum', name: 'Solna centrum', lat: 59.3604, lng: 17.9970, line: 'blue' },
  // T11 branch (Akalla)
  { id: 'nackrosen', name: 'Näckrosen', lat: 59.3699, lng: 17.9970, line: 'blue' },
  { id: 'hallonbergen', name: 'Hallonbergen', lat: 59.3778, lng: 17.9991, line: 'blue' },
  { id: 'kista', name: 'Kista', lat: 59.4029, lng: 17.9476, line: 'blue' },
  { id: 'husby', name: 'Husby', lat: 59.4101, lng: 17.9331, line: 'blue' },
  { id: 'akalla', name: 'Akalla', lat: 59.4224, lng: 17.9183, line: 'blue' },
  // T10 branch (Hjulsta)
  { id: 'rissne', name: 'Rissne', lat: 59.3712, lng: 17.9616, line: 'blue' },
  { id: 'rinkeby', name: 'Rinkeby', lat: 59.3877, lng: 17.9220, line: 'blue' },
  { id: 'tensta', name: 'Tensta', lat: 59.4010, lng: 17.9026, line: 'blue' },
  { id: 'hjulsta', name: 'Hjulsta', lat: 59.4073, lng: 17.8640, line: 'blue' },
];

const redStations: Station[] = [
  // T13 southern branch (Norsborg)
  { id: 'norsborg', name: 'Norsborg', lat: 59.2493, lng: 17.8272, line: 'red' },
  { id: 'hallunda', name: 'Hallunda', lat: 59.2530, lng: 17.8468, line: 'red' },
  { id: 'alby', name: 'Alby', lat: 59.2524, lng: 17.8586, line: 'red' },
  { id: 'fittja', name: 'Fittja', lat: 59.2506, lng: 17.8714, line: 'red' },
  { id: 'masmo', name: 'Masmo', lat: 59.2542, lng: 17.8849, line: 'red' },
  { id: 'varby-gard', name: 'Vårby gård', lat: 59.2634, lng: 17.9071, line: 'red' },
  { id: 'varberg', name: 'Vårberg', lat: 59.2706, lng: 17.9196, line: 'red' },
  { id: 'skarholmen', name: 'Skärholmen', lat: 59.2743, lng: 17.9369, line: 'red' },
  { id: 'satra', name: 'Sätra', lat: 59.2855, lng: 17.9509, line: 'red' },
  { id: 'bredang', name: 'Bredäng', lat: 59.3007, lng: 17.9665, line: 'red' },
  { id: 'malarhojden', name: 'Mälarhöjden', lat: 59.3082, lng: 17.9758, line: 'red' },
  { id: 'axelsberg', name: 'Axelsberg', lat: 59.3135, lng: 17.9826, line: 'red' },
  { id: 'ornsberg', name: 'Örnsberg', lat: 59.3168, lng: 17.9882, line: 'red' },
  { id: 'aspudden', name: 'Aspudden', lat: 59.3205, lng: 18.0036, line: 'red' },
  // T14 southern branch (Fruängen)
  { id: 'fruangen', name: 'Fruängen', lat: 59.2929, lng: 17.9743, line: 'red' },
  { id: 'vastertorp', name: 'Västertorp', lat: 59.3010, lng: 17.9818, line: 'red' },
  { id: 'hagerstensasen', name: 'Hägerstensåsen', lat: 59.3062, lng: 17.9829, line: 'red' },
  { id: 'telefonplan', name: 'Telefonplan', lat: 59.3079, lng: 18.0004, line: 'red' },
  { id: 'midsommarkransen', name: 'Midsommarkransen', lat: 59.3098, lng: 18.0130, line: 'red' },
  // Shared trunk (Liljeholmen → Östermalmstorg)
  { id: 'liljeholmen', name: 'Liljeholmen', lat: 59.3103, lng: 18.0232, line: 'red' },
  { id: 'hornstull', name: 'Hornstull', lat: 59.3170, lng: 18.0415, line: 'red' },
  { id: 'zinkensdamm', name: 'Zinkensdamm', lat: 59.3169, lng: 18.0497, line: 'red' },
  { id: 'mariatorget', name: 'Mariatorget', lat: 59.3148, lng: 18.0640, line: 'red' },
  { id: 'ostermalmstorg', name: 'Östermalmstorg', lat: 59.3362, lng: 18.0748, line: 'red' },
  // T13 northern branch (Ropsten)
  { id: 'karlaplan', name: 'Karlaplan', lat: 59.3380, lng: 18.0934, line: 'red' },
  { id: 'gardet', name: 'Gärdet', lat: 59.3393, lng: 18.1083, line: 'red' },
  { id: 'ropsten', name: 'Ropsten', lat: 59.3556, lng: 18.1022, line: 'red' },
  // T14 northern branch (Mörby centrum)
  { id: 'stadion', name: 'Stadion', lat: 59.3428, lng: 18.0795, line: 'red' },
  { id: 'tekniska-hogskolan', name: 'Tekniska högskolan', lat: 59.3465, lng: 18.0726, line: 'red' },
  { id: 'universitetet', name: 'Universitetet', lat: 59.3658, lng: 18.0561, line: 'red' },
  { id: 'danderyds-sjukhus', name: 'Danderyds sjukhus', lat: 59.3822, lng: 18.0395, line: 'red' },
  { id: 'morby-centrum', name: 'Mörby centrum', lat: 59.3933, lng: 18.0327, line: 'red' },
];

const greenStations: Station[] = [
  // Northwestern branches (T17/T18/T19 shared)
  { id: 'hasselbystrand', name: 'Hässelby strand', lat: 59.3627, lng: 17.8380, line: 'green' },
  { id: 'hasselbygard', name: 'Hässelby gård', lat: 59.3637, lng: 17.8527, line: 'green' },
  { id: 'vallingby', name: 'Vällingby', lat: 59.3626, lng: 17.8713, line: 'green' },
  { id: 'racksta', name: 'Råcksta', lat: 59.3619, lng: 17.8847, line: 'green' },
  { id: 'johannelund', name: 'Johannelund', lat: 59.3603, lng: 17.9000, line: 'green' },
  { id: 'vinsta', name: 'Vinsta', lat: 59.3547, lng: 17.9108, line: 'green' },
  { id: 'brommaplan', name: 'Brommaplan', lat: 59.3394, lng: 17.9400, line: 'green' },
  { id: 'abrahamsberg', name: 'Abrahamsberg', lat: 59.3358, lng: 17.9547, line: 'green' },
  { id: 'stora-mossen', name: 'Stora mossen', lat: 59.3318, lng: 17.9583, line: 'green' },
  { id: 'alvik', name: 'Alvik', lat: 59.3278, lng: 17.9625, line: 'green' },
  { id: 'kristineberg', name: 'Kristineberg', lat: 59.3313, lng: 17.9827, line: 'green' },
  { id: 'thorildsplan', name: 'Thorildsplan', lat: 59.3329, lng: 18.0108, line: 'green' },
  // Center trunk (shared with blue at Fridhemsplan, with red at Slussen/Gamla stan/T-Centralen)
  { id: 'fridhemsplan', name: 'Fridhemsplan', lat: 59.3332, lng: 18.0290, line: 'green' },
  { id: 'st-eriksplan', name: 'S:t Eriksplan', lat: 59.3403, lng: 18.0398, line: 'green' },
  { id: 'odenplan', name: 'Odenplan', lat: 59.3433, lng: 18.0494, line: 'green' },
  { id: 'radmansgatan', name: 'Rådmansgatan', lat: 59.3418, lng: 18.0576, line: 'green' },
  { id: 'hotorget', name: 'Hötorget', lat: 59.3347, lng: 18.0631, line: 'green' },
  { id: 't-centralen', name: 'T-Centralen', lat: 59.3311, lng: 18.0588, line: 'green' },
  { id: 'gamla-stan', name: 'Gamla stan', lat: 59.3238, lng: 18.0671, line: 'green' },
  { id: 'slussen', name: 'Slussen', lat: 59.3194, lng: 18.0717, line: 'green' },
  { id: 'medborgarplatsen', name: 'Medborgarplatsen', lat: 59.3146, lng: 18.0722, line: 'green' },
  { id: 'skanstull', name: 'Skanstull', lat: 59.3082, lng: 18.0694, line: 'green' },
  { id: 'gullmarsplan', name: 'Gullmarsplan', lat: 59.3001, lng: 18.0793, line: 'green' },
  // T18/T19 southern trunk
  { id: 'globen', name: 'Globen', lat: 59.2954, lng: 18.0834, line: 'green' },
  { id: 'enskede-gard', name: 'Enskede gård', lat: 59.2887, lng: 18.0826, line: 'green' },
  { id: 'sockenplan', name: 'Sockenplan', lat: 59.2835, lng: 18.0871, line: 'green' },
  { id: 'svedmyra', name: 'Svedmyra', lat: 59.2801, lng: 18.0893, line: 'green' },
  { id: 'stureby', name: 'Stureby', lat: 59.2763, lng: 18.0937, line: 'green' },
  { id: 'bandhagen', name: 'Bandhagen', lat: 59.2699, lng: 18.0955, line: 'green' },
  { id: 'hogdalen', name: 'Högdalen', lat: 59.2650, lng: 18.0968, line: 'green' },
  // T19 branch (Hagsätra)
  { id: 'ragsved', name: 'Rågsved', lat: 59.2588, lng: 18.0980, line: 'green' },
  { id: 'hagsatra', name: 'Hagsätra', lat: 59.2539, lng: 18.0994, line: 'green' },
  // T18 branch (Farsta strand)
  { id: 'hokarangen', name: 'Hökarängen', lat: 59.2607, lng: 18.0962, line: 'green' },
  { id: 'fagersjo', name: 'Fagersjö', lat: 59.2502, lng: 18.0978, line: 'green' },
  { id: 'farsta', name: 'Farsta', lat: 59.2437, lng: 18.0994, line: 'green' },
  { id: 'farsta-strand', name: 'Farsta strand', lat: 59.2380, lng: 18.1023, line: 'green' },
  // T17 branch (Skarpnäck)
  { id: 'karrtorp', name: 'Kärrtorp', lat: 59.2932, lng: 18.1046, line: 'green' },
  { id: 'bjorkhagen', name: 'Björkhagen', lat: 59.2887, lng: 18.1079, line: 'green' },
  { id: 'tallkrogen', name: 'Tallkrogen', lat: 59.2853, lng: 18.1183, line: 'green' },
  { id: 'gubbangen', name: 'Gubbängen', lat: 59.2789, lng: 18.1217, line: 'green' },
  { id: 'bagarmossen', name: 'Bagarmossen', lat: 59.2716, lng: 18.1329, line: 'green' },
  { id: 'skarpnack', name: 'Skarpnäck', lat: 59.2653, lng: 18.1414, line: 'green' },
];

export const stations: Station[] = [...blueStations, ...redStations, ...greenStations];
