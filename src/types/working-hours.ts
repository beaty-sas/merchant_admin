export type IWorkingHour = {
  id: number;
  date: string;
  opening_time: string;
  closing_time: string;
};

export type IWorkingHourForm = {
  date: string;
  opening_time: string;
  closing_time: string;
};