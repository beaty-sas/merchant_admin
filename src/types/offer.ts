export type IOffer = {
  id: number;
  name: string;
  price: number;
  duration: number;
};

export type IOfferCreate = {
  name: string;
  price: number;
  duration: number;
  business_id: number;
};