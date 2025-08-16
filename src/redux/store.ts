import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './root-reducer';
import { authApi } from './services/authApi';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware),
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
