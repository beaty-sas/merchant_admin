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

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  tableData: IWorkingHour[];
  tableLabels: any;
}

export default function HoursTableList({
  title,
  subheader,
  tableLabels,
  tableData,
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
                <OfferRow key={row.id} row={row} />
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
};

function OfferRow({ row }: OfferRowProps) {
  const popover = usePopover();

  const handleDelete = () => {
    popover.onClose();
    console.info('DELETE', row.id);
  };

  return (
    <>
      <TableRow>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemText primary={row.date} />
        </TableCell>

        <TableCell align="right">
          {row.opening_time}
        </TableCell>

        <TableCell align="right">
          {row.closing_time}
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
