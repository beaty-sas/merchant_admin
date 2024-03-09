export type IAttachment = {
  id: number;
  original: string;
  thumbnail: string;
};

export type ILocation = {
  name: string;
  geom: string;
};

export type IBusiness = {
  id: number;
  display_name: string;
  slug: string;
  phone_number: string;
  location?: ILocation | null;
  logo?: IAttachment | null;
  banner?: IAttachment | null;
  description?: string | null;
};

export type IBusinessUpdate = {
  display_name: string;
  phone_number: string;
  location?: {name: string};
  logo_id?: number | null;
  banner_id?: number | null;
  description?: string | null;
};
