import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

import { IBusiness, IBusinessUpdate } from 'src/types/business';

// ----------------------------------------------------------------------

export function useGetMyBusiness(): {
  business: IBusiness;
  businessLoading: boolean;
  businessError: any;
  businessValidating: boolean;
  businessEmpty: boolean;
} {
  const URL = endpoints.business.my;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      business: (data as IBusiness),
      businessLoading: isLoading,
      businessError: error,
      businessValidating: isValidating,
      businessEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function updateMyBusiness(businessId: number, data: IBusinessUpdate) {
  const URL = endpoints.business.list + businessId;

  await axiosInstance.patch(URL, { display_name: data.display_name, phone_number: data.phone_number });

  mutate(
    URL,
    (currentData: any) => {
      if (currentData) {
        return {
          ...currentData,
          display_name: data.display_name,
          phone_number: data.phone_number,
        };
      }
      return currentData;
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function makeNewAttachment(file: any) {
  const URL = endpoints.attachements;

  const response = await axiosInstance.post(URL, { attachment: file }, { headers: { 'Content-Type': 'multipart/form-data' } });
  return response.data;
}

// ----------------------------------------------------------------------
