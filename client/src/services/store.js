import thunk from 'redux-thunk';
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import persistReducer from 'redux-persist/es/persistReducer';
import appApi from './appApi';
import userSlice from './userSlice';

const customReducer = combineReducers({
  user: userSlice,
  [appApi.reducerPath]: appApi.reducer,
});

const persistConfiguration = {
  key: 'root',
  storage,
  blackList: [appApi.reducerPath],
};
const myPersistReducer = persistReducer(persistConfiguration, customReducer);

const store = configureStore({
  reducer: myPersistReducer,
  middleware: [thunk, appApi.middleware],
});

export default store;
