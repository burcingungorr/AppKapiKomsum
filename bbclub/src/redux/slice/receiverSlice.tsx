import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  username: '',
  receiver: null,
};

const receiverSlice = createSlice({
  name: 'receiver',
  initialState,
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setReceiver: (state, action) => {
      state.receiver = action.payload;
    },
    clearReceiver: state => {
      state.receiver = null;
    },
  },
});

export const {setUsername, setReceiver, clearReceiver} = receiverSlice.actions;
export default receiverSlice.reducer;
