'use client';

import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useSearchParams } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';

// ----------------------------------------------------------------------

export default function Auth0LoginView() {
  const { loginWithRedirect } = useAuthContext();

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const handleLoginWithRedirect = useCallback(async () => {
    try {
      await loginWithRedirect?.({
        appState: {
          returnTo: returnTo || PATH_AFTER_LOGIN,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }, [loginWithRedirect, returnTo]);

  const handleRegisterWithRedirect = useCallback(async () => {
    try {
      await loginWithRedirect?.({
        appState: {
          returnTo: returnTo || PATH_AFTER_LOGIN,
        },
        authorizationParams: {
          screen_hint: 'signup',
        },
      });
    } catch (error) {
      console.error(error);
    }
  }, [loginWithRedirect, returnTo]);

  return (
    <>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Вхід в кабінет
      </Typography>

      <Stack spacing={2}>
        <Button
          fullWidth
          color="primary"
          size="large"
          variant="contained"
          onClick={handleLoginWithRedirect}
        >
          Логін
        </Button>

        <Button
          fullWidth
          color="primary"
          size="large"
          variant="soft"
          onClick={handleRegisterWithRedirect}
        >
          Реєстрація
        </Button>

      </Stack>
    </>
  );
}
