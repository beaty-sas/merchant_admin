import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
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

import { fDate, fTime } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { IBooking } from 'src/types/booking';
import { Typography } from '@mui/material';
import { cancelBooking } from 'src/api/booking';
import { enqueueSnackbar } from 'notistack';

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
                <BookingDetailsRow key={row.id} row={row} businessId={businessId}/>
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

  const lightMode = theme.palette.mode === 'light';

  const popover = usePopover();

  const handleDelete = async () => {
    popover.onClose();
    await cancelBooking(row.id, businessId);
    enqueueSnackbar('Бронювання відмінено!', { variant: 'error' });
  };

  return (
    <>
      <TableRow>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            variant="rounded"
            alt={row.user.display_name}
            src={row.user.display_name}
            sx={{ mr: 2, width: 48, height: 48 }}
          />
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
          <Typography variant="caption" noWrap>
            {row.offers.map((offer) => offer.name).join(', ')}
          </Typography>
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

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle2" noWrap>
            {row.price} ₴
          </Typography>
        </TableCell>

        <TableCell>
          <Label
            variant={lightMode ? 'soft' : 'filled'}
            color={
              (row.status === 'ACTIVE' && 'success') ||
              'error'
            }
          >
            {row.status}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ pr: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Відмінити
        </MenuItem>
      </CustomPopover>
    </>
  );
}
