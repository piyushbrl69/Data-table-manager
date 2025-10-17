'use client';

import React, { useRef } from 'react';
import { Button } from '@mui/material';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setRows, addColumn } from '../store/tableSlice';
import { v4 as uuidv4 } from 'uuid';

export default function ImportExport() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();
  const { rows, visibleColumns, allColumns } = useSelector((s: RootState) => s.table);

  const onImportClick = () => fileRef.current?.click();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length) {
          alert('Parse errors: ' + JSON.stringify(results.errors));
          return;
        }
        
        const parsed: any[] = results.data as any[];
        const normalized = parsed.map((r) => {
          const id = r.id || uuidv4();
          
          if (r.age) r.age = Number(r.age);
          return { id, ...r };
        });

        const headers = results.meta.fields || [];
        headers.forEach(h => {
          if (!allColumns.includes(h)) dispatch(addColumn(h));
        });

        dispatch(setRows(normalized));
        alert('Imported ' + normalized.length + ' rows');
        if (fileRef.current) fileRef.current.value = '';
      }
    });
  };

  const handleExport = () => {

    const header = ['id', ...visibleColumns];
    const csvRows = [header.join(',')];
    rows.forEach(r => {
      const row = header.map(h => {
        const v = r[h as keyof typeof r];

        const s = v === undefined || v === null ? '' : String(v).replace(/"/g, '""');
        return `"${s}"`;
      }).join(',');
      csvRows.push(row);
    });
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'table_export.csv');
  };

  return (
    <>
      <input ref={fileRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleFile} />
      <Button variant="contained" onClick={onImportClick}>Import CSV</Button>
      <Button variant="outlined" onClick={handleExport}>Export CSV</Button>
    </>
  );
}
