import type { CityConfig, CityId } from '~/types/city';
import { stockholmStations, gothenburgStations } from '~/data/stations';
import { stockholmRoutes, gothenburgRoutes } from '~/data/routes';

export const cityConfigs: Record<CityId, CityConfig> = {
  stockholm: {
    id: 'stockholm',
    slug: '',
    titleKey: 'cities.stockholm.title',
    subtitleKey: 'cities.stockholm.subtitle',
    metaDescriptionKey: 'cities.stockholm.metaDescription',
    center: [59.332, 18.065],
    zoom: 11,
    lines: [
      { id: 'red', color: '#E4000F', nameKey: 'lines.stockholm.red' },
      { id: 'green', color: '#00873E', nameKey: 'lines.stockholm.green' },
      { id: 'blue', color: '#005DA0', nameKey: 'lines.stockholm.blue' },
      { id: 'tvarbanan', color: '#E07B39', nameKey: 'lines.stockholm.tvarbanan' },
      { id: 'sparvag-city', color: '#8B5CF6', nameKey: 'lines.stockholm.sparvagCity' },
    ],
    hasTramToggle: true,
    tramLineIds: ['tvarbanan', 'sparvag-city'],
  },
  gothenburg: {
    id: 'gothenburg',
    slug: 'gothenburg',
    titleKey: 'cities.gothenburg.title',
    subtitleKey: 'cities.gothenburg.subtitle',
    metaDescriptionKey: 'cities.gothenburg.metaDescription',
    center: [57.705, 11.965],
    zoom: 12,
    lines: [
      { id: 'gbg-1', color: '#E2007A', nameKey: 'lines.gothenburg.line1' },
      { id: 'gbg-2', color: '#00A550', nameKey: 'lines.gothenburg.line2' },
      { id: 'gbg-3', color: '#004B9D', nameKey: 'lines.gothenburg.line3' },
      { id: 'gbg-4', color: '#F7941D', nameKey: 'lines.gothenburg.line4' },
      { id: 'gbg-5', color: '#009999', nameKey: 'lines.gothenburg.line5' },
      { id: 'gbg-6', color: '#E31E24', nameKey: 'lines.gothenburg.line6' },
      { id: 'gbg-7', color: '#7B2D8B', nameKey: 'lines.gothenburg.line7' },
      { id: 'gbg-9', color: '#00AEEF', nameKey: 'lines.gothenburg.line9' },
      { id: 'gbg-11', color: '#40C0C0', nameKey: 'lines.gothenburg.line11' },
    ],
    hasTramToggle: false,
    tramLineIds: [],
  },
};

export const CITY_IDS: CityId[] = ['stockholm', 'gothenburg'];

export function getCityBySlug(slug: string): CityConfig | null {
  return Object.values(cityConfigs).find(c => c.slug === slug) ?? null;
}

export function getCityStations(cityId: CityId) {
  return cityId === 'gothenburg' ? gothenburgStations : stockholmStations;
}

export function getCityRoutes(cityId: CityId) {
  return cityId === 'gothenburg' ? gothenburgRoutes : stockholmRoutes;
}
