import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

import { IWorkingHour, IWorkingHourForm } from 'src/types/working-hours';

// ----------------------------------------------------------------------

export function useGetWorkingHours(businessId: number): {
  workingHours: IWorkingHour[];
  workingHoursLoading: boolean;
  workingHoursError: any;
  workingHoursValidating: boolean;
  workingHoursEmpty: boolean;
} {
  const URL = endpoints.workingHours.list + businessId;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      workingHours: (data as IWorkingHour[]) || [],
      workingHoursLoading: isLoading,
      workingHoursError: error,
      workingHoursValidating: isValidating,
      workingHoursEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createNewWorkingHour(businessId: number, data: IWorkingHourForm[]) {
  const URL = endpoints.workingHours.list + businessId;

  const response = await axiosInstance.post(URL, data);

  mutate(
    URL,
    (currentData: any) => {
      if (!currentData) return response.data;
      return [...currentData, ...response.data];
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function deleteWorkingHour(businessId: number, workingHourId: number) {
  const URL = endpoints.workingHours.list + `${workingHourId}?business_id=${businessId}`;
  const MUTATE_URL = endpoints.workingHours.list + businessId;

  await axiosInstance.delete(URL);

  mutate(
    MUTATE_URL,
    (currentData: any) => {
      if (!currentData) return [];
      return currentData.filter((item: any) => item.id !== workingHourId);
    },
    false
  );
}

// ----------------------------------------------------------------------
