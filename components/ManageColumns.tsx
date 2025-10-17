'use client';

import React, { useState } from 'react';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  FormGroup, FormControlLabel, Checkbox, TextField
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { toggleColumn, addColumn } from '../store/tableSlice';

export default function ManageColumns() {
  const dispatch = useDispatch();
  const { allColumns, visibleColumns } = useSelector((s: RootState) => s.table);
  const [open, setOpen] = useState(false);
  const [newCol, setNewCol] = useState('');

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>Manage Columns</Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Manage Columns</DialogTitle>
        <DialogContent>
          <FormGroup>
            {allColumns.map(col => (
              <FormControlLabel
                key={col}
                control={<Checkbox checked={visibleColumns.includes(col)} onChange={() => dispatch(toggleColumn(col))} />}
                label={col.charAt(0).toUpperCase() + col.slice(1)}
              />
            ))}
          </FormGroup>

          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <TextField size="small" label="New column (e.g. department)" value={newCol} onChange={(e) => setNewCol(e.target.value)} />
            <Button onClick={() => {
              if (!newCol.trim()) return alert('Enter column name');
              dispatch(addColumn(newCol.trim()));
              setNewCol('');
            }}>Add</Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
