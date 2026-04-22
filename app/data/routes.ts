import type { TbanaLine } from '~/types/station';

export interface Route {
  line: TbanaLine;
  stationIds: string[];
}

export const routes: Route[] = [
  // Blue line — shared trunk + two northwest branches
  { line: 'blue', stationIds: ['kungstradgarden', 't-centralen', 'radhuset', 'fridhemsplan', 'stadshagen', 'vastra-skogen', 'solna-centrum'] },
  { line: 'blue', stationIds: ['solna-centrum', 'nackrosen', 'hallonbergen', 'kista', 'husby', 'akalla'] },
  { line: 'blue', stationIds: ['solna-centrum', 'rissne', 'rinkeby', 'tensta', 'hjulsta'] },

  // Red line — two southern branches merging at Liljeholmen, shared trunk, two northern branches
  { line: 'red', stationIds: ['norsborg', 'hallunda', 'alby', 'fittja', 'masmo', 'varby-gard', 'varberg', 'skarholmen', 'satra', 'bredang', 'malarhojden', 'axelsberg', 'ornsberg', 'aspudden', 'liljeholmen'] },
  { line: 'red', stationIds: ['fruangen', 'vastertorp', 'hagerstensasen', 'telefonplan', 'midsommarkransen', 'liljeholmen'] },
  { line: 'red', stationIds: ['liljeholmen', 'hornstull', 'zinkensdamm', 'mariatorget', 'slussen', 'gamla-stan', 't-centralen', 'ostermalmstorg'] },
  { line: 'red', stationIds: ['ostermalmstorg', 'karlaplan', 'gardet', 'ropsten'] },
  { line: 'red', stationIds: ['ostermalmstorg', 'stadion', 'tekniska-hogskolan', 'universitetet', 'danderyds-sjukhus', 'morby-centrum'] },

  // Green line — northwest branch, shared center trunk, three southern branches
  { line: 'green', stationIds: ['hasselbystrand', 'hasselbygard', 'vallingby', 'racksta', 'johannelund', 'vinsta', 'brommaplan', 'abrahamsberg', 'stora-mossen', 'alvik', 'kristineberg', 'thorildsplan', 'fridhemsplan'] },
  { line: 'green', stationIds: ['fridhemsplan', 'st-eriksplan', 'odenplan', 'radmansgatan', 'hotorget', 't-centralen', 'gamla-stan', 'slussen', 'medborgarplatsen', 'skanstull', 'gullmarsplan'] },
  { line: 'green', stationIds: ['gullmarsplan', 'karrtorp', 'bjorkhagen', 'tallkrogen', 'gubbangen', 'bagarmossen', 'skarpnack'] },
  { line: 'green', stationIds: ['gullmarsplan', 'globen', 'enskede-gard', 'sockenplan', 'svedmyra', 'stureby', 'bandhagen', 'hogdalen'] },
  { line: 'green', stationIds: ['hogdalen', 'ragsved', 'hagsatra'] },
  { line: 'green', stationIds: ['hogdalen', 'hokarangen', 'fagersjo', 'farsta', 'farsta-strand'] },
];
