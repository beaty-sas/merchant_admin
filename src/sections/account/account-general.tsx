import * as Yup from 'yup';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';


import { fData } from 'src/utils/format-number';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFUpload,
  RHFUploadAvatar,
} from 'src/components/hook-form';
import { makeNewAttachment, updateMyBusiness, useGetMyBusiness } from 'src/api/business';
import OfferList from '../overview/offers/offers-list';
import { useGetMyOffers } from 'src/api/offer';
import { useBoolean } from 'src/hooks/use-boolean';
import OfferForm from '../offer/offer-form';
import { IOffer } from 'src/types/offer';

// -----------------------AccountGeneral-----------------------------------------------

type BusinessType = {
  displayName: string;
  photoURL: any;
  bannerURL: any;
  phoneNumber: string;
  address: string;
  logoId: number | null;
  bannerId: number | null;
  description: string | null;
};

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();
  const { business } = useGetMyBusiness()
  const { offers } = useGetMyOffers(business?.slug || '');
  const dialog = useBoolean();
  const [selecterOffer, setSelecterOffer] = useState<IOffer | null>(null);

  const UpdateBusinessSchema = Yup.object().shape({
    displayName: Yup.string().required('Ім`я обовязкове'),
    photoURL: Yup.mixed<any>().nullable().required('Фото обов`язкове'),
    bannerURL: Yup.mixed<any>().nullable().required('Фото обов`язкове'),
    phoneNumber: Yup.string().required('Телефон обов`язковий'),
    address: Yup.string().required('Адреса обов`язкова'),
    logoId: Yup.number().nullable(),
    bannerId: Yup.number().nullable(),
    description: Yup.string().nullable(),
  });

  const defaultValues: BusinessType = {
    displayName: business?.display_name || '',
    photoURL: business?.logo?.original || null,
    bannerURL: business?.banner?.original || null,
    phoneNumber: business?.phone_number || '',
    address: business?.location?.name || '',
    logoId: business?.logo?.id || null,
    bannerId: business?.banner?.id || null,
    description: business?.description || '',
  };

  const methods = useForm({
    resolver: yupResolver(UpdateBusinessSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    if (!isDirty) {
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      enqueueSnackbar('Зміни успішно збережено!');
      await updateMyBusiness(business.id, {
        display_name: data.displayName,
        phone_number: data.phoneNumber,
        logo_id: data.logoId ?? business.logo?.id,
        banner_id: data.bannerId ?? business.banner?.id,
        description: data.description,
        location: { name: data.address },
      });
    } catch (error) {
      enqueueSnackbar('Зміни не збережено! Спробуйте ще раз', { variant: 'error' });
    }
  });

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const logo = await makeNewAttachment(file);

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('photoURL', newFile, { shouldValidate: true });
      }
      if (logo) {
        setValue('logoId', logo.id, { shouldValidate: false })
      }
    },
    [setValue]
  );

  const handleDropBanner = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const banner = await makeNewAttachment(file);

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('bannerURL', newFile, { shouldValidate: true });
      }
      if (banner) {
        setValue('bannerId', banner.id, { shouldValidate: false })
      }
    },
    [setValue]
  );

  useEffect(() => {
    if (business) {
      setValue('displayName', business.display_name);
      setValue('photoURL', business.logo?.original || null);
      setValue('bannerURL', business.banner?.original || null);
      setValue('phoneNumber', business.phone_number || '');
      setValue('address', business?.location?.name || '');
    }
  }, [business, setValue]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 2, pb: 5, px: 3, textAlign: 'center' }}>
            <RHFUpload
              multiple={false}
              name="bannerURL"
              maxSize={3145728}
              onDrop={handleDropBanner}
            />
            <RHFUploadAvatar
              name="photoURL"
              maxSize={3145728}
              onDrop={handleDrop}
              sx={{ mt: 3 }}
              helperText={
                <>
                  <Typography variant="h6" sx={{ mt: 3 }}>Фото аватару</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Формати *.jpeg, *.jpg, *.png, *.gif
                    <br /> максимальна вага {fData(3145728)}
                  </Typography>
                </>
              }
            />
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
            >
              <RHFTextField name="displayName" label="Назва" required />
              <RHFTextField name="phoneNumber" label="Номер телефону" required />
              <RHFTextField name="address" label="Адреса" required />
              <RHFTextField name="description" label="Опис" multiline minRows={3} />

            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>

              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                fullWidth
                disabled={!isDirty}
              >
                Зберегти зміни
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>

        <Grid xs={12}>
          <OfferList
            title='Послуги'
            tableLabels={[
              { id: 'name', label: 'Назва' },
              { id: 'price', label: 'Ціна', align: 'right' },
              { id: 'duration', label: 'Тривалість', align: 'right' },
              { id: '' },
            ]}
            tableData={offers}
            businessSlug={business?.slug || ''}
            onEditRow={(offerId) => {
              setSelecterOffer(offers.find((offer) => offer.id === offerId) || null);
              dialog.onTrue();
            }}
          />
          <Box sx={{ p: 2, textAlign: 'right' }}>
            <Button
              size="small"
              color="inherit"
              onClick={dialog.onTrue}
            >
              + Нова послуга
            </Button>
          </Box>

          <Dialog
            fullWidth
            maxWidth="xs"
            open={dialog.value}
            onClose={dialog.onFalse}
          >
            <DialogTitle sx={{ minHeight: 76 }}>
              {selecterOffer ? 'Змінити послугу' : 'Нова послуга'}
            </DialogTitle>

            <OfferForm
              onClose={() => {
                setSelecterOffer(null);
                dialog.onFalse();
              }}
              businessId={business?.id || 0}
              businessSlug={business?.slug || ''}
              offer={selecterOffer}
            />
          </Dialog>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
