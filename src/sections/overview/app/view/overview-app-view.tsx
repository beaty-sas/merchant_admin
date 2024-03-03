'use client';

import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { useAuth0 } from '@auth0/auth0-react';

import { SeoIllustration } from 'src/assets/illustrations';

import { useSettingsContext } from 'src/components/settings';

import AppWelcome from '../app-welcome';
import AppWidgetSummary from '../app-widget-summary';
import BookingDetails from '../../booking/booking-details';
import { useGetBookings } from 'src/api/booking';
import { useGetMyBusiness } from 'src/api/business';
import { HOST } from 'src/config-global';

// ----------------------------------------------------------------------

export default function OverviewAppView() {
  const { user } = useAuth0()
  const { business } = useGetMyBusiness()
  const { bookings } = useGetBookings(business?.id || 0)

  const theme = useTheme();
  const settings = useSettingsContext();


  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          <AppWelcome
            title={`З поверненням 👋 \n ${user?.name}`}
            description={`Ваше посиллання для бронювань: ${HOST}/booking/${business?.slug}`}
            img={<SeoIllustration />}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Загальна кількість бронювань"
            percent={2.6}
            total={18765}
            chart={{
              series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Кількість бронювань за тиждень"
            percent={0.2}
            total={4876}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Кількість бронювань сьогодні"
            percent={-0.1}
            total={678}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
            }}
          />
        </Grid>

        <Grid xs={12}>
          <BookingDetails
            businessId={business?.id || 0}
            title="Наступні бронювання"
            tableData={bookings}
            tableLabels={[
              { id: 'customer', label: 'Клієнт' },
              { id: 'destination', label: 'Послуги' },
              { id: 'checkIn', label: 'Час початку' },
              { id: 'checkOut', label: 'Час кінця' },
              { id: 'price', label: 'ЦІна' },
              { id: 'status', label: 'Статус' },
              { id: '' },
            ]}
          />
        </Grid>

      </Grid>
    </Container>
  );
}
