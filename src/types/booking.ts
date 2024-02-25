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
};

export type IBookingUpdate = {
  start_time: Date;
  end_time: Date;
};