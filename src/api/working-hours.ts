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

  await axiosInstance.post(URL, data);

  mutate(
    URL,
    (currentData: any) => {
      const newData = data.map((item) => {
        return {
          date: item.date,
          opening_time: item.opening_time.split('T')[1].split('.')[0],
          closing_time: item.closing_time.split('T')[1].split('.')[0],
        };
      })

      return [...currentData, ...newData];
    },
    false
  );
}

// ----------------------------------------------------------------------
