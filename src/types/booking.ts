import { IAttachment } from "./business";
import { IOffer } from "./offer";

export type IUser = {
  display_name: string
  phone_number: string
}

export type IBooking = {
  id: number;
  start_time: Date;
  end_time: Date;
  price: number;
  offers: Array<IOffer>;
  user: IUser;
  status: string;
  comment?: string;
  attachments?: Array<IAttachment>;
};

export type IBookingUpdate = {
  start_time: Date;
  end_time: Date;
};

export type IBookingAnalytics = {
  total: number;
  future: number;
  today: number;
};

export type IBookingCreate = {
  start_time: Date;
  business_id: number;
  price: number;
  offers: Array<number>;
  user: IUser;
  comment?: string;
};