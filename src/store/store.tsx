
import { Action, combineReducers, configureStore, ThunkAction } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';

import {
  persistStore,
  persistReducer
} from 'redux-persist';

import userSlice from './slices/user/userSlice';
import taskReducer from './slices/task';
import appModalSlice from "./slices/app-modal/app-modal.slice";

const persistConfig = {
  key: 'root',
  version: 1,
  storage,  
  blacklist: ['appModal', 'tasksForm']
}
const reducers = combineReducers({
  user: userSlice,
  task: taskReducer,
  appModal: appModalSlice,
});

const persistedReducer = persistReducer(persistConfig, reducers)


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
// export const persistor = persistStore(store)
 

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

