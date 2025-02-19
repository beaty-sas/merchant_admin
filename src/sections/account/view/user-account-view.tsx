'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

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
          { name: 'Головна', href: paths.dashboard.root },
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
