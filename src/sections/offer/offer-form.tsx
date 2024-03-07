import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

import { createNewOffer, updateOffer } from 'src/api/offer';
import { IOffer, IOfferCreate } from 'src/types/offer';

// ----------------------------------------------------------------------

type Props = {
  onClose: VoidFunction;
  businessId: number;
  businessSlug: string;
  offer?: IOffer | null;
};

export default function OfferForm({ onClose, businessId, businessSlug, offer }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const OfferSchema = Yup.object().shape({
    name: Yup.string().max(255).required('Назва послуги обов`язкова'),
    price: Yup.number().required('Ціна обов`язкова'),
    duration: Yup.number().required('Тривалість обов`язкова'),
  });

  const methods = useForm({
    defaultValues: {
      name: offer?.name || '',
      price: offer?.price || 0,
      duration: Number(offer?.duration) / 60 || 0,
    }, 
    resolver: yupResolver(OfferSchema)
   });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmitForm = handleSubmit(async (data) => {
    const offerData: IOfferCreate = {
      name: data?.name,
      price: data?.price,
      duration: data?.duration * 60,
      business_id: businessId,
    } as IOfferCreate;

    if (offer) {
      offerData.id = offer.id;
    }
    
    try {
      if (offer) {
        await updateOffer(offerData, businessSlug);
        enqueueSnackbar('Успішно змінено!')
      } else {
        await createNewOffer(offerData, businessSlug);
        enqueueSnackbar('Успішно створено!')
      }
      onClose();
      reset();
    }
    catch (error) {
      enqueueSnackbar(error, { variant: 'error' });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmitForm}>
      <Stack spacing={3} sx={{ px: 3 }}>
        <RHFTextField name="name" label="Назва" />
        <RHFTextField name="price" label="Ціна, грн" type="number"/>
        <RHFTextField name="duration" label="Тривалість, хв" type="number"/>

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
