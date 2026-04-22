import type { Station } from '~/types/station';

const blueStations: Station[] = [
  // Shared trunk: Kungsträdgården → Solna centrum
  { id: 'kungstradgarden', name: 'Kungsträdgården', lat: 59.3308, lng: 18.0711, line: 'blue' },
  { id: 'radhuset', name: 'Rådhuset', lat: 59.3302, lng: 18.0443, line: 'blue' },
  { id: 'stadshagen', name: 'Stadshagen', lat: 59.3376, lng: 18.0159, line: 'blue' },
  { id: 'vastra-skogen', name: 'Västra skogen', lat: 59.3474, lng: 18.0039, line: 'blue' },
  { id: 'huvudsta', name: 'Huvudsta', lat: 59.3497, lng: 17.9871, line: 'blue' },
  { id: 'solna-strand', name: 'Solna strand', lat: 59.3545, lng: 17.9732, line: 'blue' },
  { id: 'solna-centrum', name: 'Solna centrum', lat: 59.3595, lng: 17.9978, line: 'blue' },
  // T11 branch: Solna centrum → Akalla
  { id: 'nackrosen', name: 'Näckrosen', lat: 59.3676, lng: 17.9818, line: 'blue' },
  { id: 'hallonbergen', name: 'Hallonbergen', lat: 59.3745, lng: 17.9691, line: 'blue' },
  { id: 'kista', name: 'Kista', lat: 59.4031, lng: 17.9424, line: 'blue' },
  { id: 'husby', name: 'Husby', lat: 59.4082, lng: 17.9287, line: 'blue' },
  { id: 'akalla', name: 'Akalla', lat: 59.4156, lng: 17.9132, line: 'blue' },
  // T10 branch: Solna centrum → Hjulsta
  { id: 'sundbybergs-centrum', name: 'Sundbybergs centrum', lat: 59.3607, lng: 17.9725, line: 'blue' },
  { id: 'duvbo', name: 'Duvbo', lat: 59.3676, lng: 17.9643, line: 'blue' },
  { id: 'rissne', name: 'Rissne', lat: 59.3756, lng: 17.9407, line: 'blue' },
  { id: 'rinkeby', name: 'Rinkeby', lat: 59.3883, lng: 17.9284, line: 'blue' },
  { id: 'tensta', name: 'Tensta', lat: 59.3948, lng: 17.8997, line: 'blue' },
  { id: 'hjulsta', name: 'Hjulsta', lat: 59.3966, lng: 17.8882, line: 'blue' },
];

const redStations: Station[] = [
  // T13 southern branch: Norsborg → Liljeholmen
  { id: 'norsborg', name: 'Norsborg', lat: 59.2439, lng: 17.8127, line: 'red' },
  { id: 'hallunda', name: 'Hallunda', lat: 59.2433, lng: 17.8251, line: 'red' },
  { id: 'alby', name: 'Alby', lat: 59.2393, lng: 17.8448, line: 'red' },
  { id: 'fittja', name: 'Fittja', lat: 59.2474, lng: 17.8607, line: 'red' },
  { id: 'masmo', name: 'Masmo', lat: 59.2498, lng: 17.8815, line: 'red' },
  { id: 'varby-gard', name: 'Vårby gård', lat: 59.2651, lng: 17.8837, line: 'red' },
  { id: 'varberg', name: 'Vårberg', lat: 59.2760, lng: 17.8907, line: 'red' },
  { id: 'skarholmen', name: 'Skärholmen', lat: 59.2769, lng: 17.9068, line: 'red' },
  { id: 'satra', name: 'Sätra', lat: 59.2858, lng: 17.9217, line: 'red' },
  { id: 'bredang', name: 'Bredäng', lat: 59.2948, lng: 17.9334, line: 'red' },
  { id: 'malarhojden', name: 'Mälarhöjden', lat: 59.3010, lng: 17.9558, line: 'red' },
  { id: 'axelsberg', name: 'Axelsberg', lat: 59.3043, lng: 17.9744, line: 'red' },
  { id: 'ornsberg', name: 'Örnsberg', lat: 59.3053, lng: 17.9877, line: 'red' },
  { id: 'aspudden', name: 'Aspudden', lat: 59.3066, lng: 18.0024, line: 'red' },
  // T14 southern branch: Fruängen → Liljeholmen
  { id: 'fruangen', name: 'Fruängen', lat: 59.2865, lng: 17.9649, line: 'red' },
  { id: 'vastertorp', name: 'Västertorp', lat: 59.2913, lng: 17.9667, line: 'red' },
  { id: 'hagerstensasen', name: 'Hägerstensåsen', lat: 59.2950, lng: 17.9779, line: 'red' },
  { id: 'telefonplan', name: 'Telefonplan', lat: 59.2984, lng: 17.9982, line: 'red' },
  { id: 'midsommarkransen', name: 'Midsommarkransen', lat: 59.3016, lng: 18.0110, line: 'red' },
  // Shared trunk: Liljeholmen → Östermalmstorg
  { id: 'liljeholmen', name: 'Liljeholmen', lat: 59.3107, lng: 18.0231, line: 'red' },
  { id: 'hornstull', name: 'Hornstull', lat: 59.3164, lng: 18.0367, line: 'red' },
  { id: 'zinkensdamm', name: 'Zinkensdamm', lat: 59.3178, lng: 18.0492, line: 'red' },
  { id: 'mariatorget', name: 'Mariatorget', lat: 59.3171, lng: 18.0605, line: 'red' },
  { id: 'ostermalmstorg', name: 'Östermalmstorg', lat: 59.3355, lng: 18.0777, line: 'red' },
  // T13 northern branch: Östermalmstorg → Ropsten
  { id: 'karlaplan', name: 'Karlaplan', lat: 59.3397, lng: 18.0922, line: 'red' },
  { id: 'gardet', name: 'Gärdet', lat: 59.3459, lng: 18.0989, line: 'red' },
  { id: 'ropsten', name: 'Ropsten', lat: 59.3574, lng: 18.1024, line: 'red' },
  // T14 northern branch: Östermalmstorg → Mörby centrum
  { id: 'stadion', name: 'Stadion', lat: 59.3423, lng: 18.0805, line: 'red' },
  { id: 'tekniska-hogskolan', name: 'Tekniska högskolan', lat: 59.3458, lng: 18.0709, line: 'red' },
  { id: 'universitetet', name: 'Universitetet', lat: 59.3650, lng: 18.0543, line: 'red' },
  { id: 'bergshamra', name: 'Bergshamra', lat: 59.3807, lng: 18.0374, line: 'red' },
  { id: 'danderyds-sjukhus', name: 'Danderyds sjukhus', lat: 59.3910, lng: 18.0420, line: 'red' },
  { id: 'morby-centrum', name: 'Mörby centrum', lat: 59.3986, lng: 18.0364, line: 'red' },
];

const greenStations: Station[] = [
  // Northwest branch: Hässelby strand → Fridhemsplan (shared T17/T18/T19)
  { id: 'hasselbystrand', name: 'Hässelby strand', lat: 59.3615, lng: 17.8325, line: 'green' },
  { id: 'hasselbygard', name: 'Hässelby gård', lat: 59.3670, lng: 17.8439, line: 'green' },
  { id: 'johannelund', name: 'Johannelund', lat: 59.3679, lng: 17.8579, line: 'green' },
  { id: 'vallingby', name: 'Vällingby', lat: 59.3639, lng: 17.8708, line: 'green' },
  { id: 'racksta', name: 'Råcksta', lat: 59.3549, lng: 17.8818, line: 'green' },
  { id: 'blackeberg', name: 'Blackeberg', lat: 59.3485, lng: 17.8827, line: 'green' },
  { id: 'islandstorget', name: 'Islandstorget', lat: 59.3459, lng: 17.8937, line: 'green' },
  { id: 'angbyplan', name: 'Ängbyplan', lat: 59.3419, lng: 17.9074, line: 'green' },
  { id: 'akeshov', name: 'Åkeshov', lat: 59.3421, lng: 17.9242, line: 'green' },
  { id: 'brommaplan', name: 'Brommaplan', lat: 59.3383, lng: 17.9397, line: 'green' },
  { id: 'abrahamsberg', name: 'Abrahamsberg', lat: 59.3365, lng: 17.9538, line: 'green' },
  { id: 'stora-mossen', name: 'Stora mossen', lat: 59.3346, lng: 17.9661, line: 'green' },
  { id: 'alvik', name: 'Alvik', lat: 59.3334, lng: 17.9823, line: 'green' },
  // Center trunk: Alvik → Gullmarsplan (shared T17/T18/T19)
  { id: 'kristineberg', name: 'Kristineberg', lat: 59.3326, lng: 18.0041, line: 'green' },
  { id: 'thorildsplan', name: 'Thorildsplan', lat: 59.3314, lng: 18.0143, line: 'green' },
  { id: 'fridhemsplan', name: 'Fridhemsplan', lat: 59.3329, lng: 18.0311, line: 'green' },
  { id: 'st-eriksplan', name: 'S:t Eriksplan', lat: 59.3405, lng: 18.0372, line: 'green' },
  { id: 'odenplan', name: 'Odenplan', lat: 59.3430, lng: 18.0479, line: 'green' },
  { id: 'radmansgatan', name: 'Rådmansgatan', lat: 59.3403, lng: 18.0591, line: 'green' },
  { id: 'hotorget', name: 'Hötorget', lat: 59.3358, lng: 18.0633, line: 'green' },
  { id: 't-centralen', name: 'T-Centralen', lat: 59.3319, lng: 18.0609, line: 'green' },
  { id: 'gamla-stan', name: 'Gamla stan', lat: 59.3233, lng: 18.0670, line: 'green' },
  { id: 'slussen', name: 'Slussen', lat: 59.3193, lng: 18.0722, line: 'green' },
  { id: 'medborgarplatsen', name: 'Medborgarplatsen', lat: 59.3152, lng: 18.0732, line: 'green' },
  { id: 'skanstull', name: 'Skanstull', lat: 59.3087, lng: 18.0760, line: 'green' },
  { id: 'gullmarsplan', name: 'Gullmarsplan', lat: 59.2995, lng: 18.0806, line: 'green' },
  // T17 branch: Gullmarsplan → Skarpnäck (easternmost route)
  { id: 'skarmarbrink', name: 'Skärmarbrink', lat: 59.2956, lng: 18.0899, line: 'green' },
  { id: 'hammarbyhojden', name: 'Hammarbyhöjden', lat: 59.2948, lng: 18.1043, line: 'green' },
  { id: 'bjorkhagen', name: 'Björkhagen', lat: 59.2912, lng: 18.1155, line: 'green' },
  { id: 'karrtorp', name: 'Kärrtorp', lat: 59.2842, lng: 18.1146, line: 'green' },
  { id: 'bagarmossen', name: 'Bagarmossen', lat: 59.2762, lng: 18.1313, line: 'green' },
  { id: 'skarpnack', name: 'Skarpnäck', lat: 59.2664, lng: 18.1331, line: 'green' },
  // T18 branch: Gullmarsplan → Farsta strand (middle route)
  { id: 'blasut', name: 'Blåsut', lat: 59.2905, lng: 18.0912, line: 'green' },
  { id: 'sandsborg', name: 'Sandsborg', lat: 59.2857, lng: 18.0920, line: 'green' },
  { id: 'skogskyrkogarden', name: 'Skogskyrkogården', lat: 59.2787, lng: 18.0954, line: 'green' },
  { id: 'tallkrogen', name: 'Tallkrogen', lat: 59.2715, lng: 18.0861, line: 'green' },
  { id: 'gubbangen', name: 'Gubbängen', lat: 59.2636, lng: 18.0821, line: 'green' },
  { id: 'hokarangen', name: 'Hökarängen', lat: 59.2573, lng: 18.0828, line: 'green' },
  { id: 'fagersjo', name: 'Fagersjö', lat: 59.2502, lng: 18.0978, line: 'green' },
  { id: 'farsta', name: 'Farsta', lat: 59.2434, lng: 18.0939, line: 'green' },
  { id: 'farsta-strand', name: 'Farsta strand', lat: 59.2350, lng: 18.1021, line: 'green' },
  // T19 branch: Gullmarsplan → Hagsätra (westernmost southern route)
  { id: 'globen', name: 'Globen', lat: 59.2941, lng: 18.0768, line: 'green' },
  { id: 'enskede-gard', name: 'Enskede gård', lat: 59.2893, lng: 18.0702, line: 'green' },
  { id: 'sockenplan', name: 'Sockenplan', lat: 59.2830, lng: 18.0703, line: 'green' },
  { id: 'svedmyra', name: 'Svedmyra', lat: 59.2775, lng: 18.0671, line: 'green' },
  { id: 'stureby', name: 'Stureby', lat: 59.2746, lng: 18.0558, line: 'green' },
  { id: 'bandhagen', name: 'Bandhagen', lat: 59.2703, lng: 18.0496, line: 'green' },
  { id: 'hogdalen', name: 'Högdalen', lat: 59.2638, lng: 18.0431, line: 'green' },
  { id: 'ragsved', name: 'Rågsved', lat: 59.2567, lng: 18.0284, line: 'green' },
  { id: 'hagsatra', name: 'Hagsätra', lat: 59.2625, lng: 18.0128, line: 'green' },
];

export const stations: Station[] = [...blueStations, ...redStations, ...greenStations];
