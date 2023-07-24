import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface MainState {
  subscription_plans: any;
  loading: boolean;
  count: number;
  notify: {
    showNotification: boolean;
    textNotification: string;
    typeNotification: string;
  };
}

const initialState: MainState = {
  subscription_plans: [],
  loading: false,
  count: 0,
  notify: {
    showNotification: false,
    textNotification: '',
    typeNotification: 'warn',
  },
};

export const fetch = createAsyncThunk(
  'subscription_plans/fetch',
  async (data: any) => {
    const { id, query } = data;
    const result = await axios.get(
      `subscription_plans${query || (id ? `/${id}` : '')}`,
    );
    return id
      ? result.data
      : { rows: result.data.rows, count: result.data.count };
  },
);

export const deleteItem = createAsyncThunk(
  'subscription_plans/deleteSubscription_plans',
  async (id: string) => {
    try {
      await axios.delete(`subscription_plans/${id}`);
      //        thunkAPI.dispatch(fetch({ id: '', query: '' }))
    } catch (error) {
      console.log(error);
    }

    // showNotification('Users has been deleted', 'success');
  },
);

export const create = createAsyncThunk(
  'subscription_plans/createSubscription_plans',
  async (data: any) => {
    const result = await axios.post('subscription_plans', { data });
    // showNotification('Users has been created', 'success');
    return result.data;
  },
);

export const update = createAsyncThunk(
  'subscription_plans/updateSubscription_plans',
  async (payload: any) => {
    const result = await axios.put(`subscription_plans/${payload.id}`, {
      id: payload.id,
      data: payload.data,
    });
    return result.data;
  },
);

export const subscription_plansSlice = createSlice({
  name: 'subscription_plans',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetch.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetch.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(fetch.fulfilled, (state, action) => {
      if (action.payload.count >= 0) {
        state.subscription_plans = action.payload.rows;
        state.count = action.payload.count;
      } else {
        state.subscription_plans = action.payload;
      }
      state.loading = false;
    });

    builder.addCase(deleteItem.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteItem.fulfilled, (state) => {
      state.loading = false;
    });

    builder.addCase(deleteItem.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(create.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(create.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(create.fulfilled, (state) => {
      state.loading = false;
    });

    builder.addCase(update.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(update.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(update.rejected, (state) => {
      state.loading = false;
    });
  },
});

// Action creators are generated for each case reducer function
// export const {  } = usersSlice.actions

export default subscription_plansSlice.reducer;
