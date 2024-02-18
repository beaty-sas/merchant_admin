'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userAbout, _userPlans, _userPayment, _userInvoices, _userAddressBook } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import AccountGeneral from '../account-general';

export default function AccountView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Профіль"
        links={[
          { name: 'Гловна', href: paths.dashboard.root },
          { name: 'Профіль' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />


      <AccountGeneral />

    </Container>
  );
}
