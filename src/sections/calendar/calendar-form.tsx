import * as Yup from 'yup';
import { useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

import uuidv4 from 'src/utils/uuidv4';
import { isAfter, fTimestamp } from 'src/utils/format-time';

import { createEvent } from 'src/api/calendar';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

import { ICalendarDate, ICalendarEvent } from 'src/types/calendar';
import { cancelBooking, updateBooking } from 'src/api/booking';

// ----------------------------------------------------------------------

type Props = {
  onClose: VoidFunction;
  currentEvent?: ICalendarEvent;
  businessId: number;
};

export default function CalendarForm({ currentEvent, businessId, onClose }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const EventSchema = Yup.object().shape({
    title: Yup.string().max(255).required('Заголовок обовязковий'),
    description: Yup.string().max(5000, 'Перелік послуг має бути менше 5000 символів'),
    start: Yup.mixed(),
    end: Yup.mixed(),
  });

  const methods = useForm({
    resolver: yupResolver(EventSchema),
    defaultValues: currentEvent,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const dateError = isAfter(values.start, values.end);

  const onSubmit = handleSubmit(async (data) => {
    const eventData: ICalendarEvent = {
      id: currentEvent?.id ? currentEvent?.id : uuidv4(),
      title: data?.title,
      description: data?.description,
      end: data?.end,
      start: data?.start,
    } as ICalendarEvent;

    try {
      if (!dateError) {
        if (currentEvent?.id) {
          await updateBooking(Number(currentEvent?.id), {start_time: data.start, end_time: data.end}, businessId);
          enqueueSnackbar('Успішно змінено!');
        } else {
          await createEvent(eventData);
          enqueueSnackbar('Успішно стврено!');
        }
        onClose();
        reset();
      }
    } catch (error) {
      enqueueSnackbar(error, { variant: 'error' });
    }
  });

  const onDelete = useCallback(async () => {
    try {
      await cancelBooking(Number(currentEvent?.id) || 0, businessId);
      enqueueSnackbar('Успішно скасовано!');
      onClose();
    } catch (error) {
      enqueueSnackbar(error, { variant: 'error' });
    }
  }, [currentEvent?.id, enqueueSnackbar, onClose]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ px: 3 }}>
        <RHFTextField name="title" label="Заголовок" disabled/>

        <RHFTextField
          name="description"
          label="Перелік послуг"
          multiline
          rows={3}
          disabled
        />

        <Controller
          name="start"
          control={control}
          render={({ field }) => (
            <MobileDateTimePicker
              {...field}
              value={new Date(field.value as ICalendarDate)}
              onChange={(newValue) => {
                if (newValue) {
                  field.onChange(fTimestamp(newValue));
                }
              }}
              label="Дата та час початку"
              format="dd/MM/yyyy HH:mm"
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
          )}
        />

        <Controller
          name="end"
          control={control}
          render={({ field }) => (
            <MobileDateTimePicker
              {...field}
              value={new Date(field.value as ICalendarDate)}
              onChange={(newValue) => {
                if (newValue) {
                  field.onChange(fTimestamp(newValue));
                }
              }}
              label="Дата та час кінця"
              format="dd/MM/yyyy HH:mm"
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: dateError,
                  helperText: dateError && 'Дата та час кінця повинні бути пізніше, ніж початок',
                },
              }}
            />
          )}
        />

      </Stack>

      <DialogActions>
        {!!currentEvent?.id && (
          <Tooltip title="Скачувати бронювання">
            <IconButton onClick={onDelete}>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="inherit" onClick={onClose}>
          Закрити
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={dateError}
        >
          Зберегти зміни
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}
