
'use client';

import React from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';
import DataTable from '../components/DataTable';
import ImportExport from '../components/ImportExport';
import ManageColumns from '../components/ManageColumns';

export default function Page() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="subtitle1" color="text.secondary">
  Submitted by: Piyush Burnwal — Assignment 2025
</Typography>
 <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" gap={2} flexWrap="wrap">
          <ImportExport />
          <ManageColumns />
        </Box>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <DataTable />
      </Paper>
    </Container>
  );
}
