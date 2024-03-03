import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
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
import { IOffer } from 'src/types/offer';
import { deleteOffer } from 'src/api/offer';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  tableData: IOffer[];
  tableLabels: any;
  businessSlug: string;
  onEditRow: (id: number) => void;
}

export default function OfferTableList({
  title,
  subheader,
  tableLabels,
  tableData,
  businessSlug,
  onEditRow,
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
                <OfferRow
                  key={row.id}
                  row={row}
                  businessSlug={businessSlug}
                  onEditRow={onEditRow}
                />
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

type OfferRowProps = {
  row: IOffer;
  businessSlug: string;
  onEditRow: (id: number) => void;
};

function OfferRow({ row, businessSlug, onEditRow }: OfferRowProps) {
  const popover = usePopover();

  const handleEditRow = () => {
    onEditRow(row.id)
    popover.onClose();
  }

  const handleDelete = async () => {
    await deleteOffer(row.id, businessSlug);
    popover.onClose();
  };

  return (
    <>
      <TableRow>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemText primary={row.name} />
        </TableCell>

        <TableCell align="right">
          {row.price} ₴
        </TableCell>

        <TableCell align="right">
          {row.duration / 60} хв
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
        <MenuItem
          onClick={() => {
            handleEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Змінити
        </MenuItem>

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Видалити
        </MenuItem>
      </CustomPopover>
    </>
  );
}
