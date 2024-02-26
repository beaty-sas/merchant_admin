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
import FormProvider, { RHFTextField } from 'src/components/hook-form';

import { IWorkingHour, IWorkingHourForm } from 'src/types/working-hours';
import { createNewWorkingHour } from 'src/api/working-hours';
import { DateTimePicker, TimePicker } from '@mui/x-date-pickers';
import { request } from 'http';

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
  });

  const methods = useForm({ resolver: yupResolver(OfferSchema) });

  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const requestData: IWorkingHourForm[] = [{
      date: data.opening_time.toISOString().split('T')[0],
      opening_time: data.opening_time.toISOString(),
      closing_time: data.closing_time.toISOString(),
    } as IWorkingHourForm]

    console.log(requestData);
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
            <DateTimePicker
              {...field}
              label="Час відкриття"
              format="dd-MM-yyyy HH:mm"
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
            <DateTimePicker
              {...field}
              label="Час закриття"
              format="dd-MM-yyyy HH:mm"
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
