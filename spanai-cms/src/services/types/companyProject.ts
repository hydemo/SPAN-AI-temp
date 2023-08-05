export enum ChartType {
  Social = 'Social',
  UserFilters = 'userFilters',
}
export type ChartsItem = {
  id: string;
  name: string;
  type: ChartType;
};

export type ChartsResult = {
  social: ChartsItem[];
  userFilters: ChartsItem[];
};
