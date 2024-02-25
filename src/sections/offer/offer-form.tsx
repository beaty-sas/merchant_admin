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

import { createNewOffer } from 'src/api/offer';
import { IOfferCreate } from 'src/types/offer';

// ----------------------------------------------------------------------

type Props = {
  onClose: VoidFunction;
  businessId: number;
};

export default function OfferForm({ onClose, businessId }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const OfferSchema = Yup.object().shape({
    name: Yup.string().max(255).required('Назва послуги обов`язкова'),
    price: Yup.number().required('Ціна обов`язкова'),
    duration: Yup.number().required('Тривалість обов`язкова'),
  });

  const methods = useForm({ resolver: yupResolver(OfferSchema) });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const offerData: IOfferCreate = {
      name: data?.name,
      price: data?.price,
      duration: data?.duration * 60,
      business_id: businessId,
    } as IOfferCreate;

    try {
      await createNewOffer(offerData);
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
