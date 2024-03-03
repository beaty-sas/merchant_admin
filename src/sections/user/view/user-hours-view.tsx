'use client';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import HoursTableList from 'src/sections/overview/hours/hours-list';
import { useGetMyBusiness } from 'src/api/business';
import { useGetWorkingHours } from 'src/api/working-hours';
import { useBoolean } from 'src/hooks/use-boolean';
import WorkingHourForm from 'src/sections/working-hours/workign-hours-form';


// ----------------------------------------------------------------------

export default function UserHoursView() {
  const { business } = useGetMyBusiness()
  const { workingHours } = useGetWorkingHours(business?.id || 0);

  const settings = useSettingsContext();
  const dialog = useBoolean();


  return (
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'User', href: paths.dashboard.user.account },
            { name: 'Hours' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={dialog.onTrue}
            >
              Добавити робочий час
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <HoursTableList
            title="Робочі години"
            tableLabels={[
              { id: 'date', label: 'День' },
              { id: 'startTime', label: 'Початок', align: 'right'},
              { id: 'endTime', label: 'Кінець', align: 'right'},
              { id: '' },
            
            ]}
            tableData={workingHours}
            businessId={business?.id || 0}
          />
        </Card>

        <Dialog
            fullWidth
            maxWidth="xs"
            open={dialog.value}
            onClose={dialog.onFalse}
          >
            <DialogTitle sx={{ minHeight: 76 }}>
               Новий день
            </DialogTitle>

            <WorkingHourForm onClose={dialog.onFalse} businessId={business?.id || 0}/>
          </Dialog>
      </Container>
  );
}

// ----------------------------------------------------------------------
