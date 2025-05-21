import { configureStore } from '@reduxjs/toolkit';

import { blogAPI } from './blogAPI';

export const store = configureStore({
  reducer: {
    [blogAPI.reducerPath]: blogAPI.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(blogAPI.middleware),
});
