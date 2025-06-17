import {configureStore} from '@reduxjs/toolkit';
import userReducer from './slice/UsernameSlice';
import receiverReducer from './slice/receiverSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    receiver: receiverReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
