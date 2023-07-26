import { configureStore } from '@reduxjs/toolkit';
import styleReducer from './styleSlice';
import mainReducer from './mainSlice';
import authSlice from './authSlice';

import usersSlice from './users/usersSlice';
import subscription_plansSlice from './subscription_plans/subscription_plansSlice';
import transactionsSlice from './transactions/transactionsSlice';
import customersSlice from './customers/customersSlice';
import global_settingsSlice from './global_settings/global_settingsSlice';

export const store = configureStore({
  reducer: {
    style: styleReducer,
    main: mainReducer,
    auth: authSlice,

    users: usersSlice,
    subscription_plans: subscription_plansSlice,
    transactions: transactionsSlice,
    customers: customersSlice,
    global_settings: global_settingsSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
