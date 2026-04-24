export type CityId = 'stockholm' | 'gothenburg';

export interface LineConfig {
  id: string;
  color: string;
  nameKey: string;
}

export interface CityConfig {
  id: CityId;
  slug: string;
  titleKey: string;
  subtitleKey: string;
  metaDescriptionKey: string;
  center: [number, number];
  zoom: number;
  lines: LineConfig[];
  hasTramToggle: boolean;
  tramLineIds: string[];
}
