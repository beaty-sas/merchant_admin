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
import { Autocomplete, Chip, TextField } from '@mui/material';

import { ICalendarDate, ICalendarEvent } from 'src/types/calendar';
import { cancelBooking, createNewBooking, updateBooking } from 'src/api/booking';
import Image from 'src/components/image';
import { IOffer } from 'src/types/offer';
import { IBookingCreate } from 'src/types/booking';

// ----------------------------------------------------------------------

type Props = {
  onClose: VoidFunction;
  currentEvent?: ICalendarEvent;
  businessId: number;
  offers?: IOffer[];
};

export default function CalendarForm({ currentEvent, businessId, onClose, offers }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const EventSchema = Yup.object().shape({
    title: Yup.string().max(255).required('Заголовок обовязковий'),
    offers: Yup.array().min(1, 'Оберіть хоча б одну послугу'),
    comment: Yup.string().max(1000, 'Коментар має бути менше 1000 символів'),
    start: Yup.mixed(),
    end: Yup.mixed(),
    phoneNumber: Yup.string().max(255),
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
      end: data?.end,
      start: data?.start,
      offers: data?.offers,
      comment: data?.comment || '',
    } as ICalendarEvent;

    try {
      if (!dateError) {
        if (currentEvent?.id) {
          await updateBooking(Number(currentEvent?.id), { start_time: data.start, end_time: data.end }, businessId, eventData.comment ?? '');
          enqueueSnackbar('Успішно змінено!');
        } else {
          const booking: IBookingCreate = {
            start_time: data.start,
            business_id: businessId,
            price: 0,
            offers: data.offers || [],
            user: {
              display_name: data.title,
              phone_number: data.phoneNumber || '',
            },
            comment: data.comment,
          };
          await createNewBooking(booking, businessId);
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
        <RHFTextField name="title" label="Клієнт" />
        <RHFTextField name="phoneNumber" label="Номер телефону" />

        <Autocomplete
          fullWidth
          multiple
          limitTags={3}
          options={offers || []}
          onChange={(_, value) => {
            if (value.length > 0) {
              const offers = value.map((offer) => offer.id);
              methods.setValue('offers', offers);
            }
          }}
          defaultValue={currentEvent?.offers || []}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField {...params} label="Послуги" />
          )}
          renderOption={(props, option) => (
            <li {...props} key={option.name}>
              {option.name}
            </li>
          )}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option.name}
                label={option.name}
                size="small"
                variant="soft"
              />
            ))
          }
        />

        <RHFTextField
          name="comment"
          label="Коментар"
          multiline
          rows={3}
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

        <Box>
          {currentEvent?.attachments?.map((attachment) => (
            <Image key={attachment.id} src={attachment.original} sx={{ borderRadius: 2 }} />
          ))}
        </Box>

      </Stack>

      <DialogActions>
        {!!currentEvent?.id && (
          <Tooltip title="Скаcувати бронювання">
            <IconButton onClick={onDelete}>
              <Iconify icon="bi:trash" width={20} height={20} />
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
