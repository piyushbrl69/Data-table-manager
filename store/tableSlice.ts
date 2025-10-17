import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type RowData = {
  id: string;
  name: string;
  email: string;
  age: number;
  role: string;
  [key: string]: any;
};

type TableState = {
  rows: RowData[];
  visibleColumns: string[];
  allColumns: string[]; // tracks columns that exist
};

const defaultColumns = ['name', 'email', 'age', 'role'];

const persistedVisible = typeof window !== 'undefined'
  ? (localStorage.getItem('visibleColumns') ? JSON.parse(localStorage.getItem('visibleColumns') as string) : null)
  : null;

const initialState: TableState = {
  rows: [
    { id: '1', name: 'Asha K', email: 'asha@example.com', age: 28, role: 'Designer' },
    { id: '2', name: 'Rajat S', email: 'rajat@example.com', age: 31, role: 'Developer' },
    { id: '3', name: 'Meena P', email: 'meena@example.com', age: 24, role: 'QA' },
    { id: '4', name: 'Sahil T', email: 'sahil@example.com', age: 35, role: 'Manager' },
  ],
  visibleColumns: ['name', 'email', 'age', 'role'],   // ✅ make sure this exists
  allColumns: ['name', 'email', 'age', 'role'],
};


const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setRows: (state, action: PayloadAction<RowData[]>) => {
      state.rows = action.payload;
    },
    addRow: (state, action: PayloadAction<RowData>) => {
      state.rows.unshift(action.payload);
    },
    updateRow: (state, action: PayloadAction<{ id: string; changes: Partial<RowData> }>) => {
      const { id, changes } = action.payload;
      const idx = state.rows.findIndex(r => r.id === id);
      if (idx >= 0) state.rows[idx] = { ...state.rows[idx], ...changes };
    },
    deleteRow: (state, action: PayloadAction<string>) => {
      state.rows = state.rows.filter(r => r.id !== action.payload);
    },
    addColumn: (state, action: PayloadAction<string>) => {
      const col = action.payload;
      if (!state.allColumns.includes(col)) {
        state.allColumns.push(col);
        state.visibleColumns.push(col);
        localStorage.setItem('visibleColumns', JSON.stringify(state.visibleColumns));
      }
    },
    toggleColumn: (state, action: PayloadAction<string>) => {
      const col = action.payload;
      if (state.visibleColumns.includes(col)) {
        state.visibleColumns = state.visibleColumns.filter(c => c !== col);
      } else {
        state.visibleColumns.push(col);
      }
      localStorage.setItem('visibleColumns', JSON.stringify(state.visibleColumns));
    },
    setVisibleColumns: (state, action: PayloadAction<string[]>) => {
      state.visibleColumns = action.payload;
      localStorage.setItem('visibleColumns', JSON.stringify(state.visibleColumns));
    }
  }
});

export const { setRows, addRow, updateRow, deleteRow, addColumn, toggleColumn, setVisibleColumns } = tableSlice.actions;
export default tableSlice.reducer;
