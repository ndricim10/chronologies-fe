import { combineReducers } from '@reduxjs/toolkit';
import { apiRegistry } from './api-register';

const reducers: Record<string, any> = {};

for (const api of apiRegistry) {
  reducers[api.reducerPath] = api.reducer;
}

const rootReducer = combineReducers(reducers);

export default rootReducer;
