import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

import { IOffer, IOfferCreate } from 'src/types/offer';

// ----------------------------------------------------------------------

export function useGetMyOffers(businessId: number): {
  offers: IOffer[];
  offersLoading: boolean;
  offersError: any;
  offersValidating: boolean;
  offersEmpty: boolean;
} {
  const URL = endpoints.offer.list + `?business_id=${businessId}`;

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

export async function createNewOffer(data: IOfferCreate) {
  const URL = endpoints.offer.list;
  const MUTATE_URL = endpoints.offer.list + `?business_id=${data.business_id}`;

  await axiosInstance.post(URL, data);

  mutate(
    MUTATE_URL,
    (currentData: any) => {
      return [...currentData, data];
    },
    false
  );
}

// ----------------------------------------------------------------------
