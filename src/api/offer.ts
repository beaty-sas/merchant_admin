import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

import { IOffer, IOfferCreate } from 'src/types/offer';

// ----------------------------------------------------------------------

export function useGetMyOffers(businessId: string): {
  offers: IOffer[];
  offersLoading: boolean;
  offersError: any;
  offersValidating: boolean;
  offersEmpty: boolean;
} {
  const URL = endpoints.offer.list + `?slug=${businessId}`;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      offers: (data as IOffer[]) || [],
      offersLoading: isLoading,
      offersError: error,
      offersValidating: isValidating,
      offersEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createNewOffer(data: IOfferCreate, slug: string) {
  const URL = endpoints.offer.list;
  const MUTATE_URL = endpoints.offer.list + `?slug=${slug}`;

  const respose = await axiosInstance.post(URL, data);

  mutate(
    MUTATE_URL,
    (currentData: any) => {
      if (!currentData) return [data];
      data.id = respose.data.id;
      return [...currentData, data];
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function deleteOffer(offerId: number, slug: string) {
  const URL = endpoints.offer.list + `/${offerId}/delete?slug=${slug}`;
  const MUTATE_URL = endpoints.offer.list + `?slug=${slug}`;

  await axiosInstance.delete(URL);

  mutate(
    MUTATE_URL,
    (currentData: any) => {
      if (!currentData) return [];
      return currentData.filter((item: any) => item.id !== offerId)
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function updateOffer(data: IOfferCreate, slug: string) {
  const URL = endpoints.offer.list + `/${data.id}`;
  const MUTATE_URL = endpoints.offer.list + `?slug=${slug}`;

  await axiosInstance.patch(URL, data);

  mutate(
    MUTATE_URL,
    (currentData: any) => {
      if (!currentData) return [];
      return currentData.map((item: any) => {
        if (item.id === data.id) {
          return data;
        }
        return item;
      });
    },
    false
  );
}

// ----------------------------------------------------------------------
