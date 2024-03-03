import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider from 'src/components/hook-form';

import { IWorkingHourForm } from 'src/types/working-hours';
import { createNewWorkingHour } from 'src/api/working-hours';
import { TimePicker } from '@mui/x-date-pickers';

// ----------------------------------------------------------------------

type Props = {
  onClose: VoidFunction;
  businessId: number;
};

export default function WorkingHourForm({ onClose, businessId }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const OfferSchema = Yup.object().shape({
    opening_time: Yup.date().required('Час початку обовязковий'),
    closing_time: Yup.date().required('Час кінця обовязковий'),
    start_date: Yup.date().required('Дата початку обовязкова'),
    end_date: Yup.date().required('Дата кінця обовязкова'),
  });

  const methods = useForm({ resolver: yupResolver(OfferSchema) });

  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const requestData: IWorkingHourForm[] = [];
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    
    const openingTime = new Date(data.opening_time);
    const closingTime = new Date(data.closing_time);
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        const dateFrom = new Date(date);
        dateFrom.setHours(openingTime.getHours(), openingTime.getMinutes(), 0, 0);
        const dateTo = new Date(date);
        dateTo.setHours(closingTime.getHours(), closingTime.getMinutes(), 0, 0);
        requestData.push({ date_from: dateFrom.toISOString(), date_to: dateTo.toISOString() });
    }
    
    try {
      await createNewWorkingHour(businessId, requestData);
      enqueueSnackbar('Успішно створено!');
      onClose();
      reset();
    }
    catch (error) {
      enqueueSnackbar(error, { variant: 'error' });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ px: 3 }}>

        <Controller
          name="opening_time"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TimePicker
              {...field}
              label="Час першого замовлення"
              format="HH:mm"
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!error,
                  helperText: error?.message,
                },
              }}
            />
          )}
        />

        <Controller
          name="closing_time"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TimePicker
              {...field}
              label="Час до якого приймати замовлення"
              format="HH:mm"
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!error,
                  helperText: error?.message,
                },
              }}
            />
          )}
        />

        <Controller
          name="start_date"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DatePicker
              {...field}
              label="Робочий день з"
              format="dd-MM-yyyy"
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!error,
                  helperText: error?.message,
                },
              }}
            />
          )}
        />

        <Controller
          name="end_date"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DatePicker
              {...field}
              label="Робочий день по"
              format="dd-MM-yyyy"
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!error,
                  helperText: error?.message,
                },
              }}
            />
          )}
        />

      </Stack>

      <DialogActions>
        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="inherit" onClick={onClose}>
          Закрити
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Зберегти
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}
