import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiKey = process.env.REACT_APP_API_KEY;
const baseUrl = process.env.REACT_APP_BASE_URL;

const headers = {
  apiKey: apiKey,
  Authorization: `Bearer ${apiKey}`,
};

export const createItem = createAsyncThunk(
  "items/createItem",
  async (newItem, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        baseUrl,
        {
          item: newItem,
          completed: false,
        },
        { headers }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchItems = createAsyncThunk(
  "items/fetchItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}?select=*&order=id.asc`, {
        headers,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateItem = createAsyncThunk(
  "items/updateItem",
  async (newTodo, { rejectWithValue }) => {
    const { id, item } = newTodo;
    try {
      const response = await axios.patch(
        `${baseUrl}?id=eq.${id}`,
        { item },
        { headers }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteItem = createAsyncThunk(
  "items/deleteItem",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${baseUrl}?id=eq.${id}`, { headers });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const clearAllTodos = createAsyncThunk(
  "items/deleteAllItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${baseUrl}?id=neq.0`, { headers });
        // gt.0 id 0dan npyuk olanlari silirdi
        // ilk select* ile secmeye calisdim amma delete where clause teleb edir true=true shert vermelisen
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const completeTodo = createAsyncThunk(
  "items/Complete",
  async (item, { rejectWithValue }) => {
    try {
      const updatedItem = { ...item, completed: !item.completed };
      await axios.put(`${baseUrl}?id=eq.${item.id}`, updatedItem, { headers });
      return updatedItem;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  items: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload);
      })
      .addCase(createItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, item: action.payload.item }
            : item
        );
           // bu sort ardicil duzsede fecth edirem axi herdefe onda getirmirdi ardicil ona gore axios get etdilen hisseye elevaler etmisem  // tapdimm problemi map edirem guya men amma yeni array yaradir amma men daha sonra evvelkin yeni supabaseden fecth edib cagigriam axi men onu order etmemisem ona gore burda sort islemir
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(clearAllTodos.fulfilled, (state) => {
        state.status = "succeeded";
        state.items = [];
      })
      .addCase(clearAllTodos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(completeTodo.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default itemsSlice.reducer;
