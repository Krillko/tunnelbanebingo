export interface Route {
  line: string;
  stationIds: string[];
}

export const stockholmRoutes: Route[] = [
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

  // Tvärbanan — line 30 (Sickla → Solna station) and line 31 (Bromma flygplats → Alviks strand)
  { line: 'tvarbanan', stationIds: ['sickla', 'sickla-udde', 'sickla-kaj', 'luma', 'martensdal', 'gullmarsplan', 'globen', 'linde', 'valla-torg', 'arstafalt', 'arstaberg', 'arstadal', 'liljeholmen', 'trekanten', 'grondal', 'stora-essingen', 'alviks-strand', 'alvik', 'johannesfred', 'norra-ulvsunda', 'karlsbodavagen', 'ballsta-bro', 'sundbybergs-centrum', 'solna-business-park', 'solna-centrum', 'solna-station'] },
  { line: 'tvarbanan', stationIds: ['bromma-flygplats', 'bromma-blocks', 'norra-ulvsunda', 'johannesfred', 'alvik', 'alviks-strand'] },

  // Spårväg City — line 7 (T-Centralen → Waldemarsudde)
  { line: 'sparvag-city', stationIds: ['t-centralen', 'kungstradgarden', 'nybroplan', 'styrmansgatan', 'djurgardsbron', 'nordiska-museet', 'liljevalchs', 'skansen', 'djurgardsskolan', 'waldemarsudde'] },
];

export const gothenburgRoutes: Route[] = [
  // Line 1 — Opaltorget/Tynnered ↔ Östra Sjukhuset
  { line: 'gbg-1', stationIds: ['gbg-opaltorget', 'gbg-smaragdgatan', 'gbg-briljantgatan', 'gbg-frolunda-torg', 'gbg-positivgatan', 'gbg-musikvagen', 'gbg-nymilsgatan', 'gbg-lantmilsgatan', 'gbg-axel-dahlstroms-torg', 'gbg-marklandsgatan', 'gbg-botaniska-tradgarden', 'gbg-linneplatsen', 'gbg-olivedalsgatan', 'gbg-prinsgatan', 'gbg-jarntorget', 'gbg-stenpiren', 'gbg-brunnsparken', 'gbg-drottningtorget', 'gbg-ullevi-norra', 'gbg-svingeln', 'gbg-olskrokstorget', 'gbg-redbergsplatsen', 'gbg-stockholmsgatan', 'gbg-harlanda', 'gbg-munkebackstorget', 'gbg-kaggeledstorget', 'gbg-tingvallsvagen', 'gbg-ostra-sjukhuset'] },

  // Line 2 — Axel Dahlströms torg ↔ Väderilsgatan (Biskopsgården)
  { line: 'gbg-2', stationIds: ['gbg-axel-dahlstroms-torg', 'gbg-marklandsgatan', 'gbg-botaniska-tradgarden', 'gbg-linneplatsen', 'gbg-olivedalsgatan', 'gbg-seminariegatan', 'gbg-brunnsgatan', 'gbg-handelshogskolan', 'gbg-vasa-viktoriagatan', 'gbg-vasaplatsen', 'gbg-gronsakstorget', 'gbg-domkyrkan', 'gbg-brunnsparken', 'gbg-nils-ericsonsplatsen', 'gbg-frihamnen', 'gbg-hjalmar-brantingsplatsen', 'gbg-vagmastareplatsen', 'gbg-wieselgrensplatsen', 'gbg-rambergsvallen', 'gbg-gropegardsgatan', 'gbg-eketragatan', 'gbg-salofjordsgatan', 'gbg-varvaderstorget', 'gbg-mildvadersgatan', 'gbg-onskevadersgatan', 'gbg-friskvaderstorget', 'gbg-vaderilsgatan'] },

  // Line 3 — Kålltorp/Virginsgatan ↔ Marklandsgatan via Majorna
  { line: 'gbg-3', stationIds: ['gbg-virginsgatan', 'gbg-solrosgatan', 'gbg-harlanda', 'gbg-stockholmsgatan', 'gbg-redbergsplatsen', 'gbg-olskrokstorget', 'gbg-svingeln', 'gbg-ullevi-norra', 'gbg-drottningtorget', 'gbg-brunnsparken', 'gbg-kungsportsplatsen', 'gbg-valand', 'gbg-vasaplatsen', 'gbg-vasa-viktoriagatan', 'gbg-hagakyrkan', 'gbg-jarntorget', 'gbg-masthuggstorget', 'gbg-stigbergstorget', 'gbg-kaptensgatan', 'gbg-chapmans-torg', 'gbg-j-gerdorffsplatsen', 'gbg-vagnhallen-majorna', 'gbg-ostindiegatan', 'gbg-mariaplan', 'gbg-godhemsgatan', 'gbg-klintens-vag', 'gbg-hogsbogatan', 'gbg-bokekullsgatan', 'gbg-marklandsgatan'] },

  // Line 4 — Mölndals Innerstad ↔ Angered Centrum
  { line: 'gbg-4', stationIds: ['gbg-molndals-innerstad', 'gbg-molndals-sjukhus', 'gbg-lackareback', 'gbg-krokslatts-fabriker', 'gbg-krokslatts-torg', 'gbg-lana', 'gbg-varbergsgatan', 'gbg-elisedal', 'gbg-almedal', 'gbg-liseberg-sodra', 'gbg-berzeliigatan', 'gbg-valand', 'gbg-kungsportsplatsen', 'gbg-brunnsparken', 'gbg-drottningtorget', 'gbg-gamlestads-torg', 'gbg-hjallbo', 'gbg-hammarkullen', 'gbg-storas', 'gbg-angered-centrum'] },

  // Line 5 — Östra Sjukhuset ↔ Varmfrontsgatan/Länsmansgården
  { line: 'gbg-5', stationIds: ['gbg-ostra-sjukhuset', 'gbg-tingvallsvagen', 'gbg-kaggeledstorget', 'gbg-munkebackstorget', 'gbg-solrosgatan', 'gbg-virginsgatan', 'gbg-welandergatan', 'gbg-topelsgatan', 'gbg-bogatan', 'gbg-ekmanska', 'gbg-sankt-sigfrids-plan', 'gbg-liseberg-station', 'gbg-korsvagen', 'gbg-berzeliigatan', 'gbg-valand', 'gbg-kungsportsplatsen', 'gbg-brunnsparken', 'gbg-lilla-bommen', 'gbg-frihamnen', 'gbg-hjalmar-brantingsplatsen', 'gbg-vagmastareplatsen', 'gbg-wieselgrensplatsen', 'gbg-rambergsvallen', 'gbg-gropegardsgatan', 'gbg-eketragatan', 'gbg-salofjordsgatan', 'gbg-varvaderstorget', 'gbg-mildvadersgatan', 'gbg-onskevadersgatan', 'gbg-friskvaderstorget', 'gbg-vaderilsgatan', 'gbg-temperaturgatan', 'gbg-varmfrontsgatan'] },

  // Line 6 — Kortedala/Aprilgatan ↔ Varmfrontsgatan via Sahlgrenska
  { line: 'gbg-6', stationIds: ['gbg-aprilgatan', 'gbg-allhelgonakyrkan', 'gbg-kortedala-torg', 'gbg-runstavsgatan', 'gbg-nymanegatan', 'gbg-bevaringsgatan', 'gbg-kviberg', 'gbg-bellevue', 'gbg-skf', 'gbg-gamlestads-torg', 'gbg-ejdergatan', 'gbg-redbergsplatsen', 'gbg-olskrokstorget', 'gbg-svingeln', 'gbg-ullevi-norra', 'gbg-ullevi-sodra', 'gbg-scandinavium', 'gbg-chalmers', 'gbg-wavrinskys-plats', 'gbg-medicinaregatan', 'gbg-sahlgrenska-huvudentre', 'gbg-linneplatsen', 'gbg-olivedalsgatan', 'gbg-prinsgatan', 'gbg-jarntorget', 'gbg-hagakyrkan', 'gbg-gronsakstorget', 'gbg-domkyrkan', 'gbg-brunnsparken', 'gbg-nils-ericsonsplatsen', 'gbg-frihamnen', 'gbg-hjalmar-brantingsplatsen', 'gbg-vagmastareplatsen', 'gbg-wieselgrensplatsen', 'gbg-rambergsvallen', 'gbg-gropegardsgatan', 'gbg-eketragatan', 'gbg-salofjordsgatan', 'gbg-varvaderstorget', 'gbg-mildvadersgatan', 'gbg-onskevadersgatan', 'gbg-friskvaderstorget', 'gbg-vaderilsgatan', 'gbg-temperaturgatan', 'gbg-varmfrontsgatan'] },

  // Line 7 — Bergsjön/Komettorget ↔ Opaltorget/Tynnered via Sahlgrenska
  { line: 'gbg-7', stationIds: ['gbg-komettorget', 'gbg-rymdtorget', 'gbg-teleskopgatan', 'gbg-galileis-gata', 'gbg-januarigatan', 'gbg-allhelgonakyrkan', 'gbg-kortedala-torg', 'gbg-runstavsgatan', 'gbg-nymanegatan', 'gbg-bevaringsgatan', 'gbg-kviberg', 'gbg-bellevue', 'gbg-skf', 'gbg-gamlestads-torg', 'gbg-drottningtorget', 'gbg-brunnsparken', 'gbg-kungsportsplatsen', 'gbg-valand', 'gbg-vasaplatsen', 'gbg-kapellplatsen', 'gbg-chalmers', 'gbg-wavrinskys-plats', 'gbg-medicinaregatan', 'gbg-sahlgrenska-huvudentre', 'gbg-botaniska-tradgarden', 'gbg-marklandsgatan', 'gbg-axel-dahlstroms-torg', 'gbg-lantmilsgatan', 'gbg-nymilsgatan', 'gbg-musikvagen', 'gbg-positivgatan', 'gbg-frolunda-torg', 'gbg-briljantgatan', 'gbg-smaragdgatan', 'gbg-opaltorget'] },

  // Line 8 — Angered Centrum ↔ Frölunda Torg via Sahlgrenska
  { line: 'gbg-8', stationIds: ['gbg-angered-centrum', 'gbg-storas', 'gbg-hammarkullen', 'gbg-hjallbo', 'gbg-gamlestads-torg', 'gbg-ejdergatan', 'gbg-redbergsplatsen', 'gbg-olskrokstorget', 'gbg-svingeln', 'gbg-ullevi-norra', 'gbg-ullevi-sodra', 'gbg-scandinavium', 'gbg-chalmers', 'gbg-wavrinskys-plats', 'gbg-medicinaregatan', 'gbg-sahlgrenska-huvudentre', 'gbg-botaniska-tradgarden', 'gbg-marklandsgatan', 'gbg-axel-dahlstroms-torg', 'gbg-lantmilsgatan', 'gbg-nymilsgatan', 'gbg-musikvagen', 'gbg-positivgatan', 'gbg-frolunda-torg'] },

  // Line 9 — Angered Centrum ↔ Kungssten via Majorna
  { line: 'gbg-9', stationIds: ['gbg-angered-centrum', 'gbg-storas', 'gbg-hammarkullen', 'gbg-hjallbo', 'gbg-gamlestads-torg', 'gbg-drottningtorget', 'gbg-brunnsparken', 'gbg-domkyrkan', 'gbg-gronsakstorget', 'gbg-hagakyrkan', 'gbg-jarntorget', 'gbg-masthuggstorget', 'gbg-stigbergstorget', 'gbg-kaptensgatan', 'gbg-chapmans-torg', 'gbg-j-gerdorffsplatsen', 'gbg-vagnhallen-majorna', 'gbg-ostindiegatan', 'gbg-sannaplan', 'gbg-sandarna', 'gbg-kungssten'] },

  // Line 11 — Bergsjön/Komettorget ↔ Saltholmen via coastal route
  { line: 'gbg-11', stationIds: ['gbg-komettorget', 'gbg-rymdtorget', 'gbg-teleskopgatan', 'gbg-galileis-gata', 'gbg-januarigatan', 'gbg-allhelgonakyrkan', 'gbg-kortedala-torg', 'gbg-runstavsgatan', 'gbg-nymanegatan', 'gbg-bevaringsgatan', 'gbg-kviberg', 'gbg-bellevue', 'gbg-skf', 'gbg-gamlestads-torg', 'gbg-drottningtorget', 'gbg-brunnsparken', 'gbg-stenpiren', 'gbg-jarntorget', 'gbg-masthuggstorget', 'gbg-stigbergstorget', 'gbg-fjallgatan', 'gbg-majvallen', 'gbg-ekedal', 'gbg-godhemsgatan', 'gbg-mariaplan', 'gbg-sannaplan', 'gbg-sandarna', 'gbg-kungssten', 'gbg-nya-varvsallen', 'gbg-hagen', 'gbg-tranered', 'gbg-karingberget', 'gbg-hinsholmen', 'gbg-langedrag', 'gbg-saltholmen'] },

  // Line 13 — Saltholmen ↔ Drottningtorget via Sahlgrenska
  { line: 'gbg-13', stationIds: ['gbg-saltholmen', 'gbg-langedrag', 'gbg-hinsholmen', 'gbg-karingberget', 'gbg-tranered', 'gbg-hagen', 'gbg-nya-varvsallen', 'gbg-kungssten', 'gbg-sandarna', 'gbg-sannaplan', 'gbg-mariaplan', 'gbg-marklandsgatan', 'gbg-botaniska-tradgarden', 'gbg-sahlgrenska-huvudentre', 'gbg-medicinaregatan', 'gbg-wavrinskys-plats', 'gbg-chalmers', 'gbg-scandinavium', 'gbg-ullevi-sodra', 'gbg-drottningtorget'] },
];

// For backwards compatibility
export const routes = stockholmRoutes;
