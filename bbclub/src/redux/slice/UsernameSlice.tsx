import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const initialState: UserState = {
  uid: null,
  email: null,
  displayName: null,
  city: null,
  district: null,
  neighborhood: null,
  town: null,
  username: null,
  loading: false,
  error: null,
};

export const fetchUserInfo = createAsyncThunk(
  'user/fetchUserInfo',
  async (_, {rejectWithValue}) => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) throw new Error('No user logged in');

      const userDoc = await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .get();
      const userData = userDoc.data();

      if (!userData) throw new Error('User data not found');

      return {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: userData.displayName || currentUser.displayName || null,
        city: userData.city || null,
        town: userData.town || null,
        district: userData.district || null,
        neighborhood: userData.neighborhood || null,
        username: userData.username || null,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser(state) {
      state.uid = null;
      state.email = null;
      state.displayName = null;
      state.city = null;
      state.district = null;
      state.neighborhood = null;
      state.town = null;
      state.username = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserInfo.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserInfo.fulfilled,
        (
          state,
          action: PayloadAction<{
            uid: string;
            email: string | null;
            displayName: string | null;
            city: string | null;
            town: string | null;
            district: string | null;
            neighborhood: string | null;
            username: string | null;
          }>,
        ) => {
          state.uid = action.payload.uid;
          state.email = action.payload.email;
          state.displayName = action.payload.displayName;
          state.city = action.payload.city;
          state.town = action.payload.town;
          state.district = action.payload.district;
          state.neighborhood = action.payload.neighborhood;
          state.username = action.payload.username;
          state.loading = false;
        },
      )
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export const {clearUser} = userSlice.actions;
export default userSlice.reducer;
