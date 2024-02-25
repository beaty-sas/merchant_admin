'use client';

import Calendar from '@fullcalendar/react'; // => request placed at the top
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import { useState, useEffect, useCallback } from 'react';
import interactionPlugin from '@fullcalendar/interaction';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { isAfter, isBetween } from 'src/utils/format-time';

import { CALENDAR_COLOR_OPTIONS } from 'src/_mock/_calendar';

import { useSettingsContext } from 'src/components/settings';

import { ICalendarEvent, ICalendarFilters, ICalendarFilterValue } from 'src/types/calendar';

import { StyledCalendar } from '../styles';
import CalendarForm from '../calendar-form';
import { useEvent, useCalendar } from '../hooks';
import CalendarToolbar from '../calendar-toolbar';
import CalendarFilters from '../calendar-filters';
import CalendarFiltersResult from '../calendar-filters-result';
import { useGetMyBusiness } from 'src/api/business';
import { useGetBookings } from 'src/api/booking';
import { IBooking } from 'src/types/booking';
import { secondary } from 'src/theme/palette';

// ----------------------------------------------------------------------

const defaultFilters: ICalendarFilters = {
  colors: [],
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function CalendarView() {
  const theme = useTheme();

  const settings = useSettingsContext();

  const smUp = useResponsive('up', 'sm');

  const openFilters = useBoolean();

  const [filters, setFilters] = useState(defaultFilters);
  const { business, businessLoading } = useGetMyBusiness()
  const { bookings, bookingsLoading } = useGetBookings(business?.id || 0)

  const dateError = isAfter(filters.startDate, filters.endDate);

  const {
    calendarRef,
    //
    view,
    date,
    //
    onDatePrev,
    onDateNext,
    onDateToday,
    onChangeView,
    onClickEvent,
    onInitialView,
    //
    openForm,
    onCloseForm,
    //
    selectEventId,
    selectedRange,
    //
    onClickEventInFilters,
  } = useCalendar();

  useEffect(() => {
    onInitialView();
  }, [onInitialView]);

  const handleFilters = useCallback((name: string, value: ICalendarFilterValue) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    dataFiltered
    setFilters(defaultFilters);
  }, []);

  const canReset = !!filters.colors.length || (!!filters.startDate && !!filters.endDate);

  const dataFiltered = applyFilter({
    inputData: bookings,
    filters,
    dateError,
  });

  const currentEvent = useEvent(dataFiltered, selectEventId, selectedRange, openForm);

  const renderResults = (
    <CalendarFiltersResult
      filters={filters}
      onFilters={handleFilters}
      //
      canReset={canReset}
      onResetFilters={handleResetFilters}
      //
      results={dataFiltered.length}
      sx={{ mb: { xs: 3, md: 5 } }}
    />
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          <Typography variant="h4">Календар</Typography>
        </Stack>

        {canReset && renderResults}

        <Card>
          <StyledCalendar>
            <CalendarToolbar
              date={date}
              view={view}
              loading={bookingsLoading || businessLoading}
              onNextDate={onDateNext}
              onPrevDate={onDatePrev}
              onToday={onDateToday}
              onChangeView={onChangeView}
              onOpenFilters={openFilters.onTrue}
            />

            <Calendar
              titleFormat={{ hour12: false }}
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              }}
              weekends
              rerenderDelay={10}
              allDayMaintainDuration
              eventResizableFromStart
              ref={calendarRef}
              initialDate={date}
              initialView={view}
              dayMaxEventRows={3}
              eventDisplay="block"
              events={dataFiltered}
              headerToolbar={false}
              eventClick={onClickEvent}
              height={smUp ? 720 : 'auto'}
              plugins={[
                listPlugin,
                dayGridPlugin,
                timelinePlugin,
                timeGridPlugin,
                interactionPlugin,
              ]}
            />
          </StyledCalendar>
        </Card>
      </Container>

      <Dialog
        fullWidth
        maxWidth="xs"
        open={openForm}
        onClose={onCloseForm}
        transitionDuration={{
          enter: theme.transitions.duration.shortest,
          exit: theme.transitions.duration.shortest - 80,
        }}
      >
        <DialogTitle sx={{ minHeight: 76 }}>
          {openForm && <> {currentEvent?.id ? 'Змінти бронювання' : 'Додати бронювання'}</>}
        </DialogTitle>

        <CalendarForm
          currentEvent={currentEvent}
          businessId={business?.id}
          onClose={onCloseForm}
        />
      </Dialog>

      <CalendarFilters
        open={openFilters.value}
        onClose={openFilters.onFalse}
        //
        filters={filters}
        onFilters={handleFilters}
        //
        canReset={canReset}
        onResetFilters={handleResetFilters}
        //
        dateError={dateError}
        //
        events={dataFiltered}
        colorOptions={CALENDAR_COLOR_OPTIONS}
        onClickEvent={onClickEventInFilters}
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  filters,
  dateError,
}: {
  inputData: IBooking[];
  filters: ICalendarFilters;
  dateError: boolean;
}): ICalendarEvent[] {
  const { startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  inputData = stabilizedThis.map((el) => el[0]).filter((booking) => booking.status !== 'CANCELLED');

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((booking) => isBetween(booking.start_time, startDate, endDate));
    }
  }

  const normalizedTypes = inputData.map((booking: IBooking) => {
    return {
      id: booking.id.toString(),
      title: `${booking.user.display_name} (${booking.user.phone_number})`,
      start: booking.start_time.toString(),
      end: booking.end_time.toString(),
      color: secondary.main,
      allDay: false,
      description: booking.offers.map((offer) => offer.name).join(', '),
    };
  })
  return normalizedTypes;
}
