import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

import { IBooking, IBookingUpdate } from 'src/types/booking';

// ----------------------------------------------------------------------

export function useGetBookings(business_id: number): {
  bookings: IBooking[];
  bookingsLoading: boolean;
  bookingError: any;
  bookingValidating: boolean;
  bookingEmpty: boolean;
} {
  const URL = endpoints.booking.list + business_id;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      bookings: (data as IBooking[]) || [],
      bookingsLoading: isLoading,
      bookingError: error,
      bookingValidating: isValidating,
      bookingEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetBookingInfo(booking_id: number): {
  booking: IBooking[];
  bookingLoading: boolean;
  bookingError: any;
  bookingValidating: boolean;
  bookingEmpty: boolean;
} {
  const URL = endpoints.booking.info + booking_id;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      booking: (data as IBooking[]) || [],
      bookingLoading: isLoading,
      bookingError: error,
      bookingValidating: isValidating,
      bookingEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function cancelBooking(booking_id: number, business_id: number) {
  const URL = endpoints.booking.cancel + booking_id + '/cancel';
  const mutateURL = endpoints.booking.list + business_id;

  /**
   * Work on server
   */
  await axiosInstance.patch(URL);

  /**
   * Work in local
   */
  mutate(
    mutateURL,
    (currentData: any) => {
      const bookings: IBooking[] = currentData.map((booking: IBooking) => {
        if (booking.id === booking_id) {
          return {
            ...booking,
            status: 'CANCELLED',
          };
        }
      });

      return bookings;
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function updateBooking(booking_id: number, data: IBookingUpdate, business_id: number) {
  const URL = endpoints.booking.info + booking_id;
  const mutateURL = endpoints.booking.list + business_id;

  /**
   * Work on server
   */
  await axiosInstance.patch(URL, {
    start_time: new Date(data.start_time).toISOString(),
    end_time: new Date(data.end_time).toISOString(),
  });

  /**
   * Work in local
   */
  mutate(
    mutateURL,
    (currentData: any) => {
      const bookings: IBooking[] = currentData.map((booking: IBooking) => {
        if (booking.id === booking_id) {
          return {
            ...booking,
            start_time: new Date(data.start_time).toISOString(),
            end_time: new Date(data.end_time).toISOString(),
          };
        }
      });

      return bookings;
    },
    false
  );
}

// ----------------------------------------------------------------------
