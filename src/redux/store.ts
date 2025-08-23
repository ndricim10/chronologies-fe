import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './root-reducer';
import { apiRegistry } from './api-register';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(...apiRegistry.map((api) => api.middleware as any)),
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
