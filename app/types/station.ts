export type TbanaLine = 'red' | 'green' | 'blue' | 'tvarbanan' | 'sparvag-city';

export interface Station {
  id: string;
  name: string;
  lat: number;
  lng: number;
  line: string;
}
