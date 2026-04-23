import type { Station } from '~/types/station';

// ─── Stockholm ───────────────────────────────────────────────────────────────

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

// Tvärbanan (light rail, lines 30 and 31)
const tvarbananaStations: Station[] = [
  { id: 'sickla', name: 'Sickla', lat: 59.306855, lng: 18.120768, line: 'tvarbanan' },
  { id: 'sickla-udde', name: 'Sickla udde', lat: 59.306290, lng: 18.108543, line: 'tvarbanan' },
  { id: 'sickla-kaj', name: 'Sickla kaj', lat: 59.302626, lng: 18.103391, line: 'tvarbanan' },
  { id: 'luma', name: 'Luma', lat: 59.304196, lng: 18.095853, line: 'tvarbanan' },
  { id: 'martensdal', name: 'Mårtensdal', lat: 59.302698, lng: 18.088025, line: 'tvarbanan' },
  { id: 'linde', name: 'Linde', lat: 59.293342, lng: 18.064031, line: 'tvarbanan' },
  { id: 'valla-torg', name: 'Valla torg', lat: 59.295053, lng: 18.048480, line: 'tvarbanan' },
  { id: 'arstafalt', name: 'Årstafältet', lat: 59.296363, lng: 18.039524, line: 'tvarbanan' },
  { id: 'arstaberg', name: 'Årstaberg', lat: 59.299254, lng: 18.029713, line: 'tvarbanan' },
  { id: 'arstadal', name: 'Årstadal', lat: 59.305878, lng: 18.025612, line: 'tvarbanan' },
  { id: 'trekanten', name: 'Trekanten', lat: 59.314271, lng: 18.017902, line: 'tvarbanan' },
  { id: 'grondal', name: 'Gröndal', lat: 59.315940, lng: 18.011300, line: 'tvarbanan' },
  { id: 'stora-essingen', name: 'Stora Essingen', lat: 59.324809, lng: 17.993094, line: 'tvarbanan' },
  { id: 'alviks-strand', name: 'Alviks strand', lat: 59.328972, lng: 17.982249, line: 'tvarbanan' },
  { id: 'johannesfred', name: 'Johannesfred', lat: 59.342785, lng: 17.969715, line: 'tvarbanan' },
  { id: 'norra-ulvsunda', name: 'Norra Ulvsunda', lat: 59.350318, lng: 17.962312, line: 'tvarbanan' },
  { id: 'karlsbodavagen', name: 'Karlsbodavägen', lat: 59.355927, lng: 17.961331, line: 'tvarbanan' },
  { id: 'ballsta-bro', name: 'Bällsta bro', lat: 59.360844, lng: 17.963531, line: 'tvarbanan' },
  { id: 'solna-business-park', name: 'Solna Business Park', lat: 59.359652, lng: 17.979139, line: 'tvarbanan' },
  { id: 'solna-station', name: 'Solna station', lat: 59.363863, lng: 18.008508, line: 'tvarbanan' },
  { id: 'bromma-flygplats', name: 'Bromma flygplats', lat: 59.357027, lng: 17.946746, line: 'tvarbanan' },
  { id: 'bromma-blocks', name: 'Bromma Blocks', lat: 59.353822, lng: 17.956965, line: 'tvarbanan' },
];

// Spårväg City (tram line 7, T-Centralen → Waldemarsudde)
const sparvagstyraStations: Station[] = [
  { id: 'nybroplan', name: 'Nybroplan', lat: 59.332694, lng: 18.076602, line: 'sparvag-city' },
  { id: 'styrmansgatan', name: 'Styrmansgatan', lat: 59.331444, lng: 18.084029, line: 'sparvag-city' },
  { id: 'djurgardsbron', name: 'Djurgårdsbron', lat: 59.331736, lng: 18.092641, line: 'sparvag-city' },
  { id: 'nordiska-museet', name: 'Nordiska museet/Vasamuseet', lat: 59.329312, lng: 18.095389, line: 'sparvag-city' },
  { id: 'liljevalchs', name: 'Liljevalchs/Gröna Lund', lat: 59.325273, lng: 18.097043, line: 'sparvag-city' },
  { id: 'skansen', name: 'Skansen', lat: 59.323785, lng: 18.101370, line: 'sparvag-city' },
  { id: 'djurgardsskolan', name: 'Djurgårdsskolan', lat: 59.323247, lng: 18.104603, line: 'sparvag-city' },
  { id: 'waldemarsudde', name: 'Waldemarsudde', lat: 59.322646, lng: 18.111260, line: 'sparvag-city' },
];

export const stockholmStations: Station[] = [
  ...blueStations,
  ...redStations,
  ...greenStations,
  ...tvarbananaStations,
  ...sparvagstyraStations,
];

// ─── Gothenburg ───────────────────────────────────────────────────────────────
// Each stop is assigned to its primary line (lowest-numbered line that serves it).
// All stops are uniquely listed here; route polylines may reference any stop ID.

const gbgLine1Stations: Station[] = [
  { id: 'gbg-opaltorget', name: 'Opaltorget', lat: 57.642929, lng: 11.900071, line: 'gbg-1' },
  { id: 'gbg-smaragdgatan', name: 'Smaragdgatan', lat: 57.6452838, lng: 11.8992279, line: 'gbg-1' },
  { id: 'gbg-briljantgatan', name: 'Briljantgatan', lat: 57.6486751, lng: 11.9035015, line: 'gbg-1' },
  { id: 'gbg-frolunda-torg', name: 'Frölunda Torg', lat: 57.6527721, lng: 11.9116038, line: 'gbg-1' },
  { id: 'gbg-positivgatan', name: 'Positivgatan', lat: 57.6566434, lng: 11.9175089, line: 'gbg-1' },
  { id: 'gbg-musikvagen', name: 'Musikvägen', lat: 57.6589341, lng: 11.9204561, line: 'gbg-1' },
  { id: 'gbg-nymilsgatan', name: 'Nymilsgatan', lat: 57.6624732, lng: 11.9250576, line: 'gbg-1' },
  { id: 'gbg-lantmilsgatan', name: 'Lantmilsgatan', lat: 57.6668624, lng: 11.9248261, line: 'gbg-1' },
  { id: 'gbg-axel-dahlstroms-torg', name: 'Axel Dahlströms torg', lat: 57.6723825, lng: 11.9278338, line: 'gbg-1' },
  { id: 'gbg-marklandsgatan', name: 'Marklandsgatan', lat: 57.6744604, lng: 11.9362415, line: 'gbg-1' },
  { id: 'gbg-botaniska-tradgarden', name: 'Botaniska Trädgården', lat: 57.6812619, lng: 11.9455821, line: 'gbg-1' },
  { id: 'gbg-linneplatsen', name: 'Linnéplatsen', lat: 57.6901338, lng: 11.9520488, line: 'gbg-1' },
  { id: 'gbg-olivedalsgatan', name: 'Olivedalsgatan', lat: 57.6924153, lng: 11.9525896, line: 'gbg-1' },
  { id: 'gbg-prinsgatan', name: 'Prinsgatan', lat: 57.6968874, lng: 11.9512499, line: 'gbg-1' },
  { id: 'gbg-jarntorget', name: 'Järntorget', lat: 57.6999594, lng: 11.9530791, line: 'gbg-1' },
  { id: 'gbg-stenpiren', name: 'Stenpiren', lat: 57.7059606, lng: 11.9580454, line: 'gbg-1' },
  { id: 'gbg-brunnsparken', name: 'Brunnsparken', lat: 57.7065914, lng: 11.9688473, line: 'gbg-1' },
  { id: 'gbg-drottningtorget', name: 'Drottningtorget', lat: 57.7075969, lng: 11.9735271, line: 'gbg-1' },
  { id: 'gbg-ullevi-norra', name: 'Ullevi Norra', lat: 57.7080639, lng: 11.9861801, line: 'gbg-1' },
  { id: 'gbg-svingeln', name: 'Svingeln', lat: 57.713358, lng: 11.9917409, line: 'gbg-1' },
  { id: 'gbg-olskrokstorget', name: 'Olskrokstorget', lat: 57.7146502, lng: 11.9993711, line: 'gbg-1' },
  { id: 'gbg-redbergsplatsen', name: 'Redbergsplatsen', lat: 57.7163354, lng: 12.0051702, line: 'gbg-1' },
  { id: 'gbg-stockholmsgatan', name: 'Stockholmsgatan', lat: 57.7170967, lng: 12.0140855, line: 'gbg-1' },
  { id: 'gbg-harlanda', name: 'Härlanda', lat: 57.7181866, lng: 12.0199724, line: 'gbg-1' },
  { id: 'gbg-munkebackstorget', name: 'Munkebäckstorget', lat: 57.718568, lng: 12.0263497, line: 'gbg-1' },
  { id: 'gbg-kaggeledstorget', name: 'Kaggeledstorget', lat: 57.722895, lng: 12.0332249, line: 'gbg-1' },
  { id: 'gbg-tingvallsvagen', name: 'Tingvallsvägen', lat: 57.7247084, lng: 12.0417585, line: 'gbg-1' },
  { id: 'gbg-ostra-sjukhuset', name: 'Östra Sjukhuset', lat: 57.722586, lng: 12.047442, line: 'gbg-1' },
];

const gbgLine2Stations: Station[] = [
  { id: 'gbg-seminariegatan', name: 'Seminariegatan', lat: 57.6923509, lng: 11.9575419, line: 'gbg-2' },
  { id: 'gbg-brunnsgatan', name: 'Brunnsgatan', lat: 57.693785, lng: 11.959526, line: 'gbg-2' },
  { id: 'gbg-handelshogskolan', name: 'Handelshögskolan', lat: 57.696179, lng: 11.9624549, line: 'gbg-2' },
  { id: 'gbg-vasa-viktoriagatan', name: 'Vasa Viktoriagatan', lat: 57.6981715, lng: 11.9669504, line: 'gbg-2' },
  { id: 'gbg-vasaplatsen', name: 'Vasaplatsen', lat: 57.6994174, lng: 11.9693282, line: 'gbg-2' },
  { id: 'gbg-gronsakstorget', name: 'Grönsakstorget', lat: 57.7024564, lng: 11.9649857, line: 'gbg-2' },
  { id: 'gbg-domkyrkan', name: 'Domkyrkan', lat: 57.7043165, lng: 11.9637167, line: 'gbg-2' },
  { id: 'gbg-nils-ericsonsplatsen', name: 'Nils Ericsonsplatsen', lat: 57.7093126, lng: 11.9710133, line: 'gbg-2' },
  { id: 'gbg-frihamnen', name: 'Frihamnen', lat: 57.7203339, lng: 11.9601168, line: 'gbg-2' },
  { id: 'gbg-hjalmar-brantingsplatsen', name: 'Hjalmar Brantingsplatsen', lat: 57.7205954, lng: 11.9532604, line: 'gbg-2' },
  { id: 'gbg-vagmastareplatsen', name: 'Vågmästareplatsen', lat: 57.7205725, lng: 11.9451473, line: 'gbg-2' },
  { id: 'gbg-wieselgrensplatsen', name: 'Wieselgrensplatsen', lat: 57.7206418, lng: 11.9356288, line: 'gbg-2' },
  { id: 'gbg-rambergsvallen', name: 'Rambergsvallen', lat: 57.7195189, lng: 11.9277024, line: 'gbg-2' },
  { id: 'gbg-gropegardsgatan', name: 'Gropegårdsgatan', lat: 57.7183442, lng: 11.9191511, line: 'gbg-2' },
  { id: 'gbg-eketragatan', name: 'Eketrägatan', lat: 57.7167011, lng: 11.9101366, line: 'gbg-2' },
  { id: 'gbg-salofjordsgatan', name: 'Sälöfjordsgatan', lat: 57.7134933, lng: 11.9015894, line: 'gbg-2' },
  { id: 'gbg-varvaderstorget', name: 'Vårväderstorget', lat: 57.7129636, lng: 11.8931812, line: 'gbg-2' },
  { id: 'gbg-mildvadersgatan', name: 'Mildvädersgatan', lat: 57.7155501, lng: 11.8909961, line: 'gbg-2' },
  { id: 'gbg-onskevadersgatan', name: 'Önskevädersgatan', lat: 57.7201505, lng: 11.8930502, line: 'gbg-2' },
  { id: 'gbg-friskvaderstorget', name: 'Friskväderstorget', lat: 57.7233637, lng: 11.8933238, line: 'gbg-2' },
  { id: 'gbg-vaderilsgatan', name: 'Väderilsgatan', lat: 57.7267621, lng: 11.8934391, line: 'gbg-2' },
];

const gbgLine3Stations: Station[] = [
  { id: 'gbg-virginsgatan', name: 'Virginsgatan', lat: 57.7107856, lng: 12.0235253, line: 'gbg-3' },
  { id: 'gbg-solrosgatan', name: 'Solrosgatan', lat: 57.7165013, lng: 12.0251095, line: 'gbg-3' },
  { id: 'gbg-kungsportsplatsen', name: 'Kungsportsplatsen', lat: 57.7039668, lng: 11.9697972, line: 'gbg-3' },
  { id: 'gbg-valand', name: 'Valand', lat: 57.7004526, lng: 11.9736913, line: 'gbg-3' },
  { id: 'gbg-hagakyrkan', name: 'Hagakyrkan', lat: 57.6996437, lng: 11.9624545, line: 'gbg-3' },
  { id: 'gbg-masthuggstorget', name: 'Masthuggstorget', lat: 57.6993282, lng: 11.9426724, line: 'gbg-3' },
  { id: 'gbg-stigbergstorget', name: 'Stigbergstorget', lat: 57.699039, lng: 11.9338853, line: 'gbg-3' },
  { id: 'gbg-kaptensgatan', name: 'Kaptensgatan', lat: 57.6971859, lng: 11.9276919, line: 'gbg-3' },
  { id: 'gbg-chapmans-torg', name: 'Chapmans Torg', lat: 57.6942497, lng: 11.9193533, line: 'gbg-3' },
  { id: 'gbg-j-gerdorffsplatsen', name: 'Jægerdorffsplatsen', lat: 57.6914175, lng: 11.91499, line: 'gbg-3' },
  { id: 'gbg-vagnhallen-majorna', name: 'Vagnhallen Majorna', lat: 57.6889761, lng: 11.9126923, line: 'gbg-3' },
  { id: 'gbg-ostindiegatan', name: 'Ostindiegatan', lat: 57.6878362, lng: 11.9150836, line: 'gbg-3' },
  { id: 'gbg-mariaplan', name: 'Mariaplan', lat: 57.6867412, lng: 11.9207548, line: 'gbg-3' },
  { id: 'gbg-godhemsgatan', name: 'Godhemsgatan', lat: 57.6845048, lng: 11.9259303, line: 'gbg-3' },
  { id: 'gbg-klintens-vag', name: 'Klintens Väg', lat: 57.6824578, lng: 11.9279564, line: 'gbg-3' },
  { id: 'gbg-hogsbogatan', name: 'Högsbogatan', lat: 57.6801215, lng: 11.9302815, line: 'gbg-3' },
  { id: 'gbg-bokekullsgatan', name: 'Bokekullsgatan', lat: 57.6771253, lng: 11.9327977, line: 'gbg-3' },
];

const gbgLine4Stations: Station[] = [
  { id: 'gbg-molndals-innerstad', name: 'Mölndals Innerstad', lat: 57.6560881, lng: 12.0172243, line: 'gbg-4' },
  { id: 'gbg-molndals-sjukhus', name: 'Mölndals sjukhus', lat: 57.6614548, lng: 12.0136632, line: 'gbg-4' },
  { id: 'gbg-lackareback', name: 'Lackarebäck', lat: 57.6651824, lng: 12.0118863, line: 'gbg-4' },
  { id: 'gbg-krokslatts-fabriker', name: 'Krokslätts Fabriker', lat: 57.6720686, lng: 12.0099724, line: 'gbg-4' },
  { id: 'gbg-krokslatts-torg', name: 'Krokslätts torg', lat: 57.6753924, lng: 12.0078652, line: 'gbg-4' },
  { id: 'gbg-lana', name: 'Lana', lat: 57.6780259, lng: 12.004441, line: 'gbg-4' },
  { id: 'gbg-varbergsgatan', name: 'Varbergsgatan', lat: 57.6796154, lng: 12.0030599, line: 'gbg-4' },
  { id: 'gbg-elisedal', name: 'Elisedal', lat: 57.6834396, lng: 12.0004371, line: 'gbg-4' },
  { id: 'gbg-almedal', name: 'Almedal', lat: 57.6867861, lng: 11.9974999, line: 'gbg-4' },
  { id: 'gbg-liseberg-sodra', name: 'Liseberg Södra', lat: 57.6916821, lng: 11.9921031, line: 'gbg-4' },
  { id: 'gbg-berzeliigatan', name: 'Berzeliigatan', lat: 57.6986577, lng: 11.981542, line: 'gbg-4' },
  { id: 'gbg-gamlestads-torg', name: 'Gamlestads Torg', lat: 57.7275931, lng: 12.0044754, line: 'gbg-4' },
  { id: 'gbg-hjallbo', name: 'Hjällbo', lat: 57.7692595, lng: 12.0223783, line: 'gbg-4' },
  { id: 'gbg-hammarkullen', name: 'Hammarkullen', lat: 57.7796924, lng: 12.0364998, line: 'gbg-4' },
  { id: 'gbg-storas', name: 'Storås', lat: 57.7849634, lng: 12.0463093, line: 'gbg-4' },
  { id: 'gbg-angered-centrum', name: 'Angered Centrum', lat: 57.7956033, lng: 12.0492714, line: 'gbg-4' },
];

const gbgLine5Stations: Station[] = [
  { id: 'gbg-welandergatan', name: 'Welandergatan', lat: 57.7060773, lng: 12.0239131, line: 'gbg-5' },
  { id: 'gbg-topelsgatan', name: 'Töpelsgatan', lat: 57.7025157, lng: 12.0224734, line: 'gbg-5' },
  { id: 'gbg-bogatan', name: 'Bögatan', lat: 57.7011187, lng: 12.016452, line: 'gbg-5' },
  { id: 'gbg-ekmanska', name: 'Ekmanska', lat: 57.6996668, lng: 12.0096351, line: 'gbg-5' },
  { id: 'gbg-sankt-sigfrids-plan', name: 'Sankt Sigfrids Plan', lat: 57.6986136, lng: 11.9992078, line: 'gbg-5' },
  { id: 'gbg-liseberg-station', name: 'Liseberg Station', lat: 57.6975236, lng: 11.9938309, line: 'gbg-5' },
  { id: 'gbg-korsvagen', name: 'Korsvägen', lat: 57.6968324, lng: 11.9863037, line: 'gbg-5' },
  { id: 'gbg-lilla-bommen', name: 'Lilla Bommen', lat: 57.7092219, lng: 11.9667699, line: 'gbg-5' },
  { id: 'gbg-temperaturgatan', name: 'Temperaturgatan', lat: 57.7325718, lng: 11.8952747, line: 'gbg-5' },
  { id: 'gbg-varmfrontsgatan', name: 'Varmfrontsgatan', lat: 57.7368794, lng: 11.8966544, line: 'gbg-5' },
];

const gbgLine6Stations: Station[] = [
  { id: 'gbg-aprilgatan', name: 'Aprilgatan', lat: 57.7608937, lng: 12.0410207, line: 'gbg-6' },
  { id: 'gbg-allhelgonakyrkan', name: 'Allhelgonakyrkan', lat: 57.7572713, lng: 12.0372348, line: 'gbg-6' },
  { id: 'gbg-kortedala-torg', name: 'Kortedala Torg', lat: 57.7529122, lng: 12.0331078, line: 'gbg-6' },
  { id: 'gbg-runstavsgatan', name: 'Runstavsgatan', lat: 57.748042, lng: 12.0303317, line: 'gbg-6' },
  { id: 'gbg-nymanegatan', name: 'Nymånegatan', lat: 57.7425552, lng: 12.0297833, line: 'gbg-6' },
  { id: 'gbg-bevaringsgatan', name: 'Beväringsgatan', lat: 57.7399617, lng: 12.0286261, line: 'gbg-6' },
  { id: 'gbg-kviberg', name: 'Kviberg', lat: 57.736484, lng: 12.0264064, line: 'gbg-6' },
  { id: 'gbg-bellevue', name: 'Bellevue', lat: 57.7322694, lng: 12.0238706, line: 'gbg-6' },
  { id: 'gbg-skf', name: 'SKF', lat: 57.7292315, lng: 12.0137267, line: 'gbg-6' },
  { id: 'gbg-ejdergatan', name: 'Ejdergatan', lat: 57.7208253, lng: 12.0058409, line: 'gbg-6' },
  { id: 'gbg-ullevi-sodra', name: 'Ullevi Södra', lat: 57.7039541, lng: 11.9850022, line: 'gbg-6' },
  { id: 'gbg-scandinavium', name: 'Scandinavium', lat: 57.7003947, lng: 11.9858686, line: 'gbg-6' },
  { id: 'gbg-chalmers', name: 'Chalmers', lat: 57.689904, lng: 11.9726412, line: 'gbg-6' },
  { id: 'gbg-wavrinskys-plats', name: 'Wavrinskys Plats', lat: 57.6889682, lng: 11.968195, line: 'gbg-6' },
  { id: 'gbg-medicinaregatan', name: 'Medicinaregatan', lat: 57.6852715, lng: 11.9641644, line: 'gbg-6' },
  { id: 'gbg-sahlgrenska-huvudentre', name: 'Sahlgrenska Huvudentré', lat: 57.6836795, lng: 11.9614653, line: 'gbg-6' },
];

const gbgLine7Stations: Station[] = [
  { id: 'gbg-komettorget', name: 'Komettorget', lat: 57.7511423, lng: 12.0713114, line: 'gbg-7' },
  { id: 'gbg-rymdtorget', name: 'Rymdtorget', lat: 57.7557468, lng: 12.0669149, line: 'gbg-7' },
  { id: 'gbg-teleskopgatan', name: 'Teleskopgatan', lat: 57.7593069, lng: 12.0600746, line: 'gbg-7' },
  { id: 'gbg-galileis-gata', name: 'Galileis Gata', lat: 57.7605102, lng: 12.0516912, line: 'gbg-7' },
  { id: 'gbg-januarigatan', name: 'Januarigatan', lat: 57.7603496, lng: 12.0412752, line: 'gbg-7' },
  { id: 'gbg-kapellplatsen', name: 'Kapellplatsen', lat: 57.6927695, lng: 11.9735487, line: 'gbg-7' },
];

const gbgLine9Stations: Station[] = [
  { id: 'gbg-sannaplan', name: 'Sannaplan', lat: 57.684194, lng: 11.9164755, line: 'gbg-9' },
  { id: 'gbg-sandarna', name: 'Sandarna', lat: 57.682819, lng: 11.9098416, line: 'gbg-9' },
  { id: 'gbg-kungssten', name: 'Kungssten', lat: 57.6805538, lng: 11.901761, line: 'gbg-9' },
];

const gbgLine11Stations: Station[] = [
  { id: 'gbg-fjallgatan', name: 'Fjällgatan', lat: 57.6941944, lng: 11.9362536, line: 'gbg-11' },
  { id: 'gbg-majvallen', name: 'Majvallen', lat: 57.6910747, lng: 11.935553, line: 'gbg-11' },
  { id: 'gbg-ekedal', name: 'Ekedal', lat: 57.6863608, lng: 11.9276735, line: 'gbg-11' },
  { id: 'gbg-nya-varvsallen', name: 'Nya Varvsallén', lat: 57.6778774, lng: 11.8946559, line: 'gbg-11' },
  { id: 'gbg-hagen', name: 'Hagen', lat: 57.6748588, lng: 11.8841839, line: 'gbg-11' },
  { id: 'gbg-tranered', name: 'Tranered', lat: 57.6725083, lng: 11.8794745, line: 'gbg-11' },
  { id: 'gbg-karingberget', name: 'Käringberget', lat: 57.6695317, lng: 11.8720126, line: 'gbg-11' },
  { id: 'gbg-hinsholmen', name: 'Hinsholmen', lat: 57.6678877, lng: 11.860756, line: 'gbg-11' },
  { id: 'gbg-langedrag', name: 'Långedrag', lat: 57.6681317, lng: 11.8535293, line: 'gbg-11' },
  { id: 'gbg-saltholmen', name: 'Saltholmen', lat: 57.6606627, lng: 11.8464671, line: 'gbg-11' },
];

export const gothenburgStations: Station[] = [
  ...gbgLine1Stations,
  ...gbgLine2Stations,
  ...gbgLine3Stations,
  ...gbgLine4Stations,
  ...gbgLine5Stations,
  ...gbgLine6Stations,
  ...gbgLine7Stations,
  ...gbgLine9Stations,
  ...gbgLine11Stations,
];

// For backwards compatibility
export const stations = stockholmStations;
