import type { TbanaLine } from '~/types/station';

export interface Route {
  line: TbanaLine;
  stationIds: string[];
}

export const routes: Route[] = [
  // Blue line — shared trunk + T11 (Akalla) + T10 (Hjulsta)
  { line: 'blue', stationIds: ['kungstradgarden', 't-centralen', 'radhuset', 'fridhemsplan', 'stadshagen', 'vastra-skogen', 'huvudsta', 'solna-strand', 'solna-centrum'] },
  { line: 'blue', stationIds: ['solna-centrum', 'nackrosen', 'hallonbergen', 'kista', 'husby', 'akalla'] },
  { line: 'blue', stationIds: ['solna-centrum', 'sundbybergs-centrum', 'duvbo', 'rissne', 'rinkeby', 'tensta', 'hjulsta'] },

  // Red line — T13 south (Norsborg), T14 south (Fruängen), shared trunk, T13 north (Ropsten), T14 north (Mörby centrum)
  { line: 'red', stationIds: ['norsborg', 'hallunda', 'alby', 'fittja', 'masmo', 'varby-gard', 'varberg', 'skarholmen', 'satra', 'bredang', 'malarhojden', 'axelsberg', 'ornsberg', 'aspudden', 'liljeholmen'] },
  { line: 'red', stationIds: ['fruangen', 'vastertorp', 'hagerstensasen', 'telefonplan', 'midsommarkransen', 'liljeholmen'] },
  { line: 'red', stationIds: ['liljeholmen', 'hornstull', 'zinkensdamm', 'mariatorget', 'slussen', 'gamla-stan', 't-centralen', 'ostermalmstorg'] },
  { line: 'red', stationIds: ['ostermalmstorg', 'karlaplan', 'gardet', 'ropsten'] },
  { line: 'red', stationIds: ['ostermalmstorg', 'stadion', 'tekniska-hogskolan', 'universitetet', 'bergshamra', 'danderyds-sjukhus', 'morby-centrum'] },

  // Green line — T17/T18/T19 northwest branch, shared center trunk, T17 (Skarpnäck), T18 (Farsta strand), T19 (Hagsätra)
  { line: 'green', stationIds: ['hasselbystrand', 'hasselbygard', 'johannelund', 'vallingby', 'racksta', 'blackeberg', 'islandstorget', 'angbyplan', 'akeshov', 'brommaplan', 'abrahamsberg', 'stora-mossen', 'alvik', 'kristineberg', 'thorildsplan', 'fridhemsplan'] },
  { line: 'green', stationIds: ['fridhemsplan', 'st-eriksplan', 'odenplan', 'radmansgatan', 'hotorget', 't-centralen', 'gamla-stan', 'slussen', 'medborgarplatsen', 'skanstull', 'gullmarsplan'] },
  { line: 'green', stationIds: ['gullmarsplan', 'skarmarbrink', 'hammarbyhojden', 'bjorkhagen', 'karrtorp', 'bagarmossen', 'skarpnack'] },
  { line: 'green', stationIds: ['gullmarsplan', 'blasut', 'sandsborg', 'skogskyrkogarden', 'tallkrogen', 'gubbangen', 'hokarangen', 'fagersjo', 'farsta', 'farsta-strand'] },
  { line: 'green', stationIds: ['gullmarsplan', 'globen', 'enskede-gard', 'sockenplan', 'svedmyra', 'stureby', 'bandhagen', 'hogdalen', 'ragsved', 'hagsatra'] },
];
