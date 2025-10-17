
'use client';

import React, { useMemo, useState } from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell, TableSortLabel,
  TablePagination, TextField, IconButton, Tooltip, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { updateRow, deleteRow } from '../store/tableSlice';
import { v4 as uuidv4 } from 'uuid';

export default function DataTable() {
  const dispatch = useDispatch();
  const { rows, visibleColumns } = useSelector((s: RootState) => s.table);

  const [orderBy, setOrderBy] = useState<string>(visibleColumns[0] ?? 'name');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, any>>({});
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id?: string }>({ open: false });

  const rowsFiltered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(r =>
      Object.values(r).some(v => String(v).toLowerCase().includes(q))
    );
  }, [rows, search]);

  const rowsSorted = useMemo(() => {
    const copy = [...rowsFiltered];
    copy.sort((a, b) => {
      const aVal = a[orderBy as keyof typeof a];
      const bVal = b[orderBy as keyof typeof b];
      if (aVal === undefined) return 1;
      if (bVal === undefined) return -1;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return order === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return order === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return copy;
  }, [rowsFiltered, orderBy, order]);

  const rowsPerPage = 10;
  const pageCount = Math.ceil(rowsSorted.length / rowsPerPage);

  const startEdit = (id: string) => {
    setEditingId(id);
    const row = rows.find(r => r.id === id)!;
    setEditValues({ ...row });
  };

  const saveEdit = () => {
    if (!editingId) return;
    
    if (editValues.age && isNaN(Number(editValues.age))) {
      alert('Age must be a number');
      return;
    }
    dispatch(updateRow({ id: editingId, changes: editValues }));
    setEditingId(null);
    setEditValues({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleDelete = (id: string) => {
    setConfirmDelete({ open: true, id });
  };

  const confirmDeleteRow = () => {
    if (confirmDelete.id) dispatch(deleteRow(confirmDelete.id));
    setConfirmDelete({ open: false });
  };

  return (
    <>
      <Box display="flex" gap={2} mb={2} alignItems="center">
        <TextField label="Search" variant="outlined" size="small" onChange={(e) => { setSearch(e.target.value); setPage(0); }} />
        <Box flex={1} />
        <Button variant="contained" onClick={() => {
    
          const newId = uuidv4();
          dispatch(updateRow({ id: newId, changes: {} } as any)); // noop placeholder
        }}>Add dummy</Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            {visibleColumns.map(col => (
              <TableCell key={col}>
                <TableSortLabel
                  active={orderBy === col}
                  direction={orderBy === col ? order : 'asc'}
                  onClick={() => {
                    if (orderBy === col) setOrder(order === 'asc' ? 'desc' : 'asc');
                    else { setOrderBy(col); setOrder('asc'); }
                  }}
                >
                  {col.charAt(0).toUpperCase() + col.slice(1)}
                </TableSortLabel>
              </TableCell>
            ))}
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rowsSorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
            <TableRow key={row.id}>
              {visibleColumns.map(col => (
                <TableCell key={col}>
                  {editingId === row.id ? (
                    <TextField
                      value={editValues[col] ?? ''}
                      size="small"
                      onChange={(e) => setEditValues(prev => ({ ...prev, [col]: e.target.value }))}
                    />
                  ) : (
                    String(row[col] ?? '')
                  )}
                </TableCell>
              ))}

              <TableCell>
                {editingId === row.id ? (
                  <>
                    <Tooltip title="Save"><IconButton onClick={saveEdit}><SaveIcon /></IconButton></Tooltip>
                    <Tooltip title="Cancel"><IconButton onClick={cancelEdit}><CancelIcon /></IconButton></Tooltip>
                  </>
                ) : (
                  <>
                    <Tooltip title="Edit"><IconButton onClick={() => startEdit(row.id)}><EditIcon /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton onClick={() => handleDelete(row.id)}><DeleteIcon /></IconButton></Tooltip>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={rowsSorted.length}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[rowsPerPage]}
      />

      <Dialog open={confirmDelete.open} onClose={() => setConfirmDelete({ open: false })}>
        <DialogTitle>Confirm delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this row?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete({ open: false })}>Cancel</Button>
          <Button color="error" onClick={confirmDeleteRow}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
