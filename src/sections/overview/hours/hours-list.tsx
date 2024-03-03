import Table from '@mui/material/Table';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
import ListItemText from '@mui/material/ListItemText';
import TableContainer from '@mui/material/TableContainer';


import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { IWorkingHour } from 'src/types/working-hours';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { deleteWorkingHour } from 'src/api/working-hours';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  tableData: IWorkingHour[];
  tableLabels: any;
  businessId: number;
}

export default function HoursTableList({
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
          <Table sx={{ minWidth: 320 }}>
            <TableHeadCustom headLabel={tableLabels} />

            <TableBody>
              {tableData.map((row) => (
                <OfferRow key={row.id} row={row} businessId={businessId}/>
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Card>
  );
}

// ----------------------------------------------------------------------

type OfferRowProps = {
  row: IWorkingHour;
  businessId: number;
};

function OfferRow({ row, businessId }: OfferRowProps) {
  const popover = usePopover();

  const handleDelete = async () => {
    await deleteWorkingHour(businessId, row.id);
    popover.onClose();
  };

  const formattedDate = String(format(new Date(row.date_from),'EEEE, d MMMM', { locale: uk }).charAt(0).toUpperCase() + format(new Date(row.date_from),'EEEE, d MMMM', { locale: uk }).slice(1));

  return (
    <>
      <TableRow>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemText primary={formattedDate} />
        </TableCell>

        <TableCell align="right">
          {new Date(row.date_from).toLocaleTimeString('ua-UK', { hour: '2-digit', minute: '2-digit', hour12: false })}
        </TableCell>

        <TableCell align="right">
          {new Date(row.date_to).toLocaleTimeString('ua-UK', { hour: '2-digit', minute: '2-digit', hour12: false})}
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
          Видалити
        </MenuItem>
      </CustomPopover>
    </>
  );
}
