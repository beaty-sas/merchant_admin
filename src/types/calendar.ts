// ----------------------------------------------------------------------

import { IAttachment } from "./business";
import { IOffer } from "./offer";

export type ICalendarFilterValue = string[] | Date | null;

export type ICalendarFilters = {
  colors: string[];
  startDate: Date | null;
  endDate: Date | null;
};

// ----------------------------------------------------------------------

export type ICalendarDate = string | number;

export type ICalendarView = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';

export type ICalendarRange = {
  start: ICalendarDate;
  end: ICalendarDate;
} | null;

export type ICalendarEvent = {
  id: string;
  title: string;
  phoneNumber?: string;
  end: ICalendarDate;
  start: ICalendarDate;
  comment?: string;
  offers?: Array<IOffer>;
  attachments?: Array<IAttachment>;
};
