export type TbanaLine = 'red' | 'green' | 'blue';

export interface Station {
  id: string;
  name: string;
  lat: number;
  lng: number;
  line: TbanaLine;
}
