import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import { useTheme } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
import ListItemText from '@mui/material/ListItemText';
import TableContainer from '@mui/material/TableContainer';
import Collapse from '@mui/material/Collapse';
import { enqueueSnackbar } from 'notistack';
import { Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';

import { fDate, fTime } from 'src/utils/format-time';
import { useBoolean } from 'src/hooks/use-boolean';

import Image from 'src/components/image';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { IBooking } from 'src/types/booking';
import { cancelBooking, confirmBooking } from 'src/api/booking';
import { Box } from '@mui/system';
import Lightbox from 'src/components/lightbox/lightbox';
import { useLightBox } from 'src/components/lightbox';

// ----------------------------------------------------------------------


interface Props extends CardProps {
  title?: string;
  subheader?: string;
  tableLabels: any;
  tableData: IBooking[];
  businessId: number;
}

export default function BookingDetails({
  title,
  subheader,
  tableLabels,
  tableData,
  businessId,
  ...other
}: Props) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 960 }}>
            <TableHeadCustom headLabel={tableLabels} />

            <TableBody>
              {tableData.map((row: IBooking) => (
                <BookingDetailsRow key={row.id} row={row} businessId={businessId} />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <Divider sx={{ borderStyle: 'dashed' }} />
    </Card>
  );
}

// ----------------------------------------------------------------------

type BookingDetailsRowProps = {
  row: IBooking;
  businessId: number;
};

function BookingDetailsRow({ row, businessId }: BookingDetailsRowProps) {
  const theme = useTheme();
  const collapse = useBoolean();
  const slides = row.attachments?.map((attachment) => ({
    src: attachment.original,
    title: '',
    description: '',
  })) ?? [];
  const lightbox = useLightBox(slides);

  const lightMode = theme.palette.mode === 'light';

  const popover = usePopover();

  const handleDelete = async () => {
    popover.onClose();
    await cancelBooking(row.id, businessId);
    enqueueSnackbar('Бронювання відмінено!', { variant: 'error' });
  };

  const handleConfirmRow = async () => {
    popover.onClose();
    await confirmBooking(row.id, businessId);
    enqueueSnackbar('Бронювання підтверджено!', { variant: 'success' });
  }

  const renderDetails = (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
        <Collapse
          in={collapse.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          <Stack component={Paper} sx={{ m: 1.5 }}>
            <Stack
              direction="column"
              alignItems="center"
              sx={{
                p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
                '&:not(:last-of-type)': {
                  borderBottom: (theme) => `solid 2px ${theme.palette.background.neutral}`,
                },
              }}
            >
              <Box flex={1} mb={2}>
                <Typography variant="body1" noWrap>
                  <b>Коментар:</b> {row.comment}
                </Typography>
              </Box>

              <Box flex={3}>
                {row.attachments?.map((attachment) => (
                  <Image
                    key={attachment.id}
                    src={attachment.original}
                    sx={{ borderRadius: 2, mr: 1, with: 100, height: 100, cursor: 'zoom-in' }}
                    onClick={() => lightbox.onOpen(attachment.original)}
                  />
                ))}
              </Box>

              <Lightbox
                open={lightbox.open}
                close={lightbox.onClose}
                slides={slides}
                index={lightbox.selected}
                disabledZoom={false}
                disabledTotal={true}
                disabledVideo={true}
                disabledCaptions={true}
                disabledSlideshow={true}
                disabledThumbnails={true}
                disabledFullscreen={false}
              />

            </Stack>
          </Stack>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      <TableRow>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemText
            primary={row.user.display_name}
            secondary={row.user.phone_number}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={fTime(new Date(row.start_time))}
            secondary={fDate(new Date(row.start_time))}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={fTime(new Date(row.end_time))}
            secondary={fDate(new Date(row.end_time))}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell>
          <Typography variant="subtitle2" noWrap>
            {row.price} ₴
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="caption" noWrap>
            {row.offers.map((offer) => offer.name).join(', ')}
          </Typography>
        </TableCell>

        <TableCell>
          <Label
            variant={lightMode ? 'soft' : 'filled'}
            color={
              ('NEW' === row.status && 'info') ||
              ('CONFIRMED' === row.status && 'success') ||
              ('COMPLETED' === row.status && 'default') ||
              'error'
            }
          >
            {row.status}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ pr: 1 }}>
          <IconButton
            color={collapse.value ? 'inherit' : 'default'}
            onClick={collapse.onToggle}
            sx={{
              ...(collapse.value && {
                bgcolor: 'action.hover',
              }),
            }}
          >
            <Iconify icon="eva:arrow-ios-downward-fill" />
          </IconButton>

          {row.status !== 'CANCELLED' && (
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          )}
        </TableCell>
      </TableRow>

      {renderDetails}

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        {row.status === 'NEW' && (
          <MenuItem
            onClick={() => {
              popover.onClose();
              handleConfirmRow();
            }}
          >
            <Iconify icon="eva:checkmark-circle-2-fill" />
            Підтвердити
          </MenuItem>
        )}

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Відмінити
        </MenuItem>
      </CustomPopover>
    </>
  );
}
