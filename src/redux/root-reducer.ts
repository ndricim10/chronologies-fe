import { combineReducers } from '@reduxjs/toolkit';
import { authApi } from './services/authApi';

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
});

export default rootReducer;
